/**
 * QQ Channel - Webhook 适配器
 */
import type { Env } from "../index";
import type { AgentDO } from "../core/agent-core";

export async function handleQQWebhook(
  request: Request, env: Env, ctx: ExecutionContext
): Promise<Response> {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const body = await request.json() as { content?: string; group_id?: string; user_id?: string };
    const text = body.content || "";
    const chatId = body.group_id || "private";
    const userId = body.user_id || "unknown";
    const agentId = env.AGENT.idFromName(`qq:${chatId}`);
    const agent = env.AGENT.get(agentId) as unknown as AgentDO;
    const reply = await agent.onMessage(text, { platform: "qq", userId, chatId });
    return new Response(JSON.stringify({ reply }), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("QQ webhook error:", error);
    return new Response("OK");
  }
}
