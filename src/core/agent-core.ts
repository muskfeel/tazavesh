/**
 * Agent Core - Durable Object 实现
 * 
 * 基于 @cloudflare/think 重构
 * 每个用户/会话一个 Agent 实例，持久化状态
 */

import { Agent } from "agents";
import { ModelRouter, type ModelProvider } from "../models/router";
import { createTools } from "../tools/registry";
import type { Env } from "../index";

export interface AgentState {
  // 会话状态
  sessionId: string;
  userId: string;
  platform: string;
  
  // 对话历史
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
    timestamp: number;
  }>;
  
  // 用户偏好
  preferences: {
    model: string;
    language: string;
    maxTokens: number;
  };
  
  // 元数据
  createdAt: number;
  updatedAt: number;
  messageCount: number;
}

export class AgentDO extends Agent<Env, AgentState> {
  private modelRouter: ModelRouter;
  
  initialState: AgentState = {
    sessionId: "",
    userId: "",
    platform: "",
    messages: [],
    preferences: {
      model: "mimo-v2.5-pro",
      language: "zh-CN",
      maxTokens: 4096,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messageCount: 0,
  };
  
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.modelRouter = new ModelRouter(env);
  }
  
  /**
   * 处理来自平台的消息
   */
  async onMessage(message: string, context: { platform: string; userId: string; chatId: string }): Promise<string> {
    // 更新状态
    this.setState({
      ...this.state,
      platform: context.platform,
      userId: context.userId,
      updatedAt: Date.now(),
    });
    
    // 添加用户消息到历史
    const userMessage = {
      role: "user" as const,
      content: message,
      timestamp: Date.now(),
    };
    
    this.setState({
      ...this.state,
      messages: [...this.state.messages, userMessage],
      messageCount: this.state.messageCount + 1,
    });
    
    // 构建完整消息列表（含系统提示）
    const systemPrompt = this.getSystemPrompt();
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...this.state.messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    ];
    
    // 调用模型
    const model = this.state.preferences.model;
    const response = await this.modelRouter.chat(model, messages, {
      maxTokens: this.state.preferences.maxTokens,
    });
    
    // 添加助手回复到历史
    const assistantMessage = {
      role: "assistant" as const,
      content: response,
      timestamp: Date.now(),
    };
    
    this.setState({
      ...this.state,
      messages: [...this.state.messages, assistantMessage],
      updatedAt: Date.now(),
    });
    
    // 持久化到 D1
    await this.persistToD1(context.chatId, userMessage, assistantMessage);
    
    return response;
  }
  
  /**
   * 系统提示词
   */
  private getSystemPrompt(): string {
    return `你是 AI Agent，一个智能助手。
你由 Agent Gateway 驱动，运行在 Cloudflare Workers 上。
你支持多种模型：MiMo、硅基流动、DeepSeek 等。
当前使用的模型：${this.state.preferences.model}
语言偏好：${this.state.preferences.language}`;
  }
  
  /**
   * 持久化到 D1
   */
  private async persistToD1(
    chatId: string,
    userMsg: { role: string; content: string; timestamp: number },
    assistantMsg: { role: string; content: string; timestamp: number }
  ): Promise<void> {
    try {
      await this.env.DB.prepare(
        `INSERT INTO messages (chat_id, role, content, created_at) VALUES (?, ?, ?, ?)`
      ).bind(chatId, userMsg.role, userMsg.content, userMsg.timestamp).run();
      
      await this.env.DB.prepare(
        `INSERT INTO messages (chat_id, role, content, created_at) VALUES (?, ?, ?, ?)`
      ).bind(chatId, assistantMsg.role, assistantMsg.content, assistantMsg.timestamp).run();
    } catch (error) {
      console.error("Failed to persist to D1:", error);
    }
  }
}
