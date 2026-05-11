/**
 * Agent Gateway - Cloudflare Workers 入口
 * 
 * 基于 Cloudflare Agents SDK 重构
 * 支持多平台 Bot 接入 + 多模型路由
 */

import { Agent, routeAgentRequest } from "agents";
import { AgentDO } from "./core/agent-core";
import { handleTelegramWebhook } from "./channels/telegram";
import { handleDiscordWebhook } from "./channels/discord";
import { handleMatrixWebhook } from "./channels/matrix";
import { handleFeishuWebhook } from "./channels/feishu";
import { handleQQWebhook } from "./channels/qq";
import { handleWebChat } from "./channels/webchat";

export interface Env {
  AGENT: DurableObjectNamespace;
  KV: KVNamespace;
  DB: D1Database;
  AI: Ai;
  
  // 模型 API Keys
  MIMO_API_KEY: string;
  SILICON_API_KEY: string;
  DEEPSEEK_API_KEY?: string;
  DASHSCOPE_API_KEY?: string;
  
  // Bot Tokens
  TELEGRAM_BOT_TOKEN?: string;
  DISCORD_BOT_TOKEN?: string;
  MATRIX_ACCESS_TOKEN?: string;
  FEISHU_APP_ID?: string;
  FEISHU_APP_SECRET?: string;
  QQ_APP_ID?: string;
  QQ_APP_SECRET?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // 平台 Webhook 路由
    if (path === "/webhook/telegram" && env.TELEGRAM_BOT_TOKEN) {
      return handleTelegramWebhook(request, env, ctx);
    }
    
    if (path === "/webhook/discord" && env.DISCORD_BOT_TOKEN) {
      return handleDiscordWebhook(request, env, ctx);
    }
    
    if (path === "/webhook/matrix" && env.MATRIX_ACCESS_TOKEN) {
      return handleMatrixWebhook(request, env, ctx);
    }
    
    if (path === "/webhook/feishu" && env.FEISHU_APP_ID) {
      return handleFeishuWebhook(request, env, ctx);
    }
    
    if (path === "/webhook/qq" && env.QQ_APP_ID) {
      return handleQQWebhook(request, env, ctx);
    }
    
    // Web 聊天接口 (包括 /chat/history)
    if (path === "/chat" || path === "/chat/" || path.startsWith("/chat/")) {
      return handleWebChat(request, env, ctx);
    }
    
    // Agent Durable Object 路由
    if (path.startsWith("/agent/")) {
      return (await routeAgentRequest(request, env)) ?? new Response("Not found", { status: 404 });
    }
    
    // 健康检查
    if (path === "/health") {
      return new Response(JSON.stringify({ status: "ok", version: "0.1.0" }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    
    return new Response("Agent Gateway", { status: 200 });
  },
};

// Re-export AgentDO for Durable Objects binding
export { AgentDO };
