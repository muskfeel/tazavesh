/**
 * Telegram Channel - Webhook 适配器
 */
import type { Env } from "../index";
import type { AgentDO } from "../core/agent-core";

interface TelegramMessage {
  message_id: number;
  from: { id: number; first_name: string; username?: string };
  chat: { id: number; type: string };
  text?: string;
  date: number;
}

export async function handleTelegramWebhook(
  request: Request, env: Env, ctx: ExecutionContext
): Promise<Response> {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const update = await request.json() as { message?: TelegramMessage };
    const message = update.message;
    if (!message?.text) return new Response("OK");
    const chatId = message.chat.id.toString();
    const userId = message.from.id.toString();
    const agentId = env.AGENT.idFromName(`telegram:${chatId}`);
    const agent = env.AGENT.get(agentId) as unknown as AgentDO;
    const reply = await agent.onMessage(message.text, { platform: "telegram", userId, chatId });
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: reply, parse_mode: "Markdown" }),
    });
    return new Response("OK");
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return new Response("OK");
  }
}
