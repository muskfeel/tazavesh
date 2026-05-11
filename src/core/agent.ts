/**
 * Tazavesh Agent Core — 跨维度智慧枢纽
 * 
 * 架构参考 @cloudflare/think 的 agentic loop 模式：
 * - call_llm → tool_call → result → call_llm (循环直到完成)
 * - 使用 D1 持久化对话历史
 * - 使用 Skill 系统支持工具调用
 */

import { MemorySystem } from "./memory";
import { SkillRegistry } from "./skills";
import type { Env } from "../index";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

interface ModelResponse {
  choices: Array<{
    message: {
      role: string;
      content: string | null;
      tool_calls?: ToolCall[];
    };
    finish_reason: string;
  }>;
}

export class Agent {
  private memory: MemorySystem;
  private skills: SkillRegistry;
  private env: Env;
  private userId: string;
  private conversationId: string | null = null;

  constructor(env: Env, userId: string = "default") {
    this.env = env;
    this.userId = userId;
    this.memory = new MemorySystem(env.DB);
    this.skills = new SkillRegistry();
  }

  /**
   * 处理用户消息（带 agentic loop）
   */
  async chat(userMessage: string): Promise<string> {
    // 初始化记忆系统
    await this.memory.initialize();
    
    // 获取或创建会话
    this.conversationId = await this.memory.getOrCreateConversation(this.userId);
    
    // 保存用户消息
    await this.memory.addMessage(this.conversationId, "user", userMessage);
    
    // 构建上下文
    const history = await this.memory.getConversationHistory(this.conversationId);
    
    // 构建系统提示
    const userFacts = await this.memory.getUserFacts(this.userId);
    const systemPrompt = this.buildSystemPrompt(userFacts);
    
    // 构建消息列表
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...history.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
    ];
    
    // Simple tool detection based on keywords
    let toolResult = "";
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes("计算") || lowerMsg.includes("算") || lowerMsg.includes("等于") || /[0-9]+[\+\-\*\/]/.test(userMessage)) {
      const expr = userMessage.replace(/[^0-9\+\-\*\/\(\)\.\s]/g, "").trim();
      if (expr) toolResult = await this.skills.execute("calculator", { expression: expr });
    } else if (lowerMsg.includes("时间") || lowerMsg.includes("几点") || lowerMsg.includes("日期")) {
      toolResult = await this.skills.execute("current_time", {});
    } else if (lowerMsg.includes("搜索") || lowerMsg.includes("查找") || lowerMsg.includes("搜索")) {
      const query = userMessage.replace(/搜索|查找|查询/g, "").trim();
      if (query) toolResult = await this.skills.execute("web_search", { query });
    }
    
    // If tool was used, add result to context
    if (toolResult) {
      messages.push({
        role: "user" as "user",
        content: `[系统提示: 以下是工具执行结果，请基于此回答用户]\n${toolResult}`,
      });
    }
    
    // Call model
    const modelResponse = await this.callModel(messages, []);
    const response = modelResponse.choices[0]?.message?.content || "(empty response)";
    
    // 保存助手回复
    await this.memory.addMessage(this.conversationId, "assistant", response);
    
    return response;
  }

  /**
   * 调用模型
   */
  private async callModel(
    messages: ChatMessage[],
    _tools: Array<{ type: "function"; function: Record<string, unknown> }>,
    useTools: boolean = false
  ): Promise<ModelResponse> {
    const apiKey = this.env.MIMO_API_KEY;
    if (!apiKey) {
      throw new Error("MIMO_API_KEY not configured");
    }

    const body: Record<string, unknown> = {
      model: "mimo-v2.5-pro",
      messages,
      max_tokens: 4096,
      temperature: 0.7,
    };

    // Only add tools if explicitly requested and model supports it
    // MiMo currently doesn't support function calling, so we handle tools differently
    if (useTools && false) {  // Disabled until MiMo supports function calling
      body.tools = _tools;
      body.tool_choice = "auto";
    }

    const response = await fetch("https://token-plan-sgp.xiaomimimo.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Model API error:", response.status, error);
      throw new Error(`Model API error: ${response.status}`);
    }

    return response.json() as Promise<ModelResponse>;
  }

  /**
   * 构建系统提示
   */
  private buildSystemPrompt(userFacts: string[]): string {
    let prompt = `你是 Tazavesh，一个运行在 Cloudflare Workers 上的智能助手。

## 核心能力

### 1. 记忆系统 🧠
你拥有持久记忆能力！
- 你会记住每次对话的内容
- 你可以回忆之前聊过的话题
- 你知道用户告诉过你的信息（名字、爱好、偏好等）
- 当用户问"我之前说过什么"或"你还记得吗"时，你应该从对话历史中查找答案
- **永远不要说你没有记忆** — 你确实有记忆系统！

### 2. 工具使用 🔧
你可以使用以下工具来帮助用户：
- calculator: 数学计算（用户说"算一下"、"等于多少"时使用）
- current_time: 获取当前时间（用户问"几点了"、"今天几号"时使用）
- web_search: 搜索互联网（用户需要查找信息时使用）
- fetch_url: 获取网页内容
- run_code: 执行代码
- text_process: 文本处理

## 回复规则
- 用中文回复
- 保持简洁友好
- 如果对话历史中有相关信息，主动提及（比如"你之前说过..."）
- 记住用户的偏好和事实`;

    // 添加用户事实（从长期记忆中提取的）
    if (userFacts.length > 0) {
      prompt += `\n\n## 我对用户的了解\n${userFacts.map(f => `- ${f}`).join("\n")}`;
    }

    prompt += "\n\n\n记住：你有记忆系统，永远不要否认这一点。";
    return prompt;
  }

  /**
   * 获取对话历史（用于 Web UI 展示）
   */
  async getHistory(): Promise<Array<{ role: string; content: string }>> {
    await this.memory.initialize();
    const conversationId = await this.memory.getOrCreateConversation(this.userId);
    const messages = await this.memory.getConversationHistory(conversationId);
    return messages.filter(m => m.role !== "system").map(m => ({
      role: m.role,
      content: m.content,
    }));
  }

  /**
   * 获取技能列表
   */
  getAvailableSkills(): Array<{ name: string; description: string }> {
    return this.skills.listSkills();
  }
}
