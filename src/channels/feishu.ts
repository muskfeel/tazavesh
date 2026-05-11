/**
 * Feishu Channel - Webhook 适配器
 */
import type { Env } from "../index";
import type { AgentDO } from "../core/agent-core";

interface FeishuEvent {
  header: { event_type: string };
  event: {
    message: { chat_id: string; content: string; message_type: string };
    sender: { sender_id: { open_id: string } };
  };
}

export async function handleFeishuWebhook(
  request: Request, env: Env, ctx: ExecutionContext
): Promise<Response> {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const body = await request.json() as FeishuEvent;
    if (body.header.event_type !== "im.message.receive_v1") return new Response("OK");
    const msg = body.event.message;
    if (msg.message_type !== "text") return new Response("OK");
    const text = JSON.parse(msg.content).text || "";
    const chatId = msg.chat_id;
    const userId = body.event.sender.sender_id.open_id;
    const agentId = env.AGENT.idFromName(`feishu:${chatId}`);
    const agent = env.AGENT.get(agentId) as unknown as AgentDO;
    const reply = await agent.onMessage(text, { platform: "feishu", userId, chatId });
    // Get tenant access token
    const tokenRes = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: env.FEISHU_APP_ID, app_secret: env.FEISHU_APP_SECRET }),
    });
    const { tenant_access_token } = await tokenRes.json() as { tenant_access_token: string };
    await fetch(`https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tenant_access_token}` },
      body: JSON.stringify({ receive_id: chatId, msg_type: "text", content: JSON.stringify({ text: reply }) }),
    });
    return new Response("OK");
  } catch (error) {
    console.error("Feishu webhook error:", error);
    return new Response("OK");
  }
}
