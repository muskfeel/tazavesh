/**
 * Matrix Channel - Webhook 适配器
 */
import type { Env } from "../index";
import type { AgentDO } from "../core/agent-core";

interface MatrixEvent {
  type: string;
  content: { body?: string; msgtype?: string };
  room_id: string;
  sender: string;
  event_id: string;
}

export async function handleMatrixWebhook(
  request: Request, env: Env, ctx: ExecutionContext
): Promise<Response> {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const event = await request.json() as MatrixEvent;
    if (event.type !== "m.room.message" || event.content.msgtype !== "m.text") {
      return new Response("OK");
    }
    const text = event.content.body || "";
    const chatId = event.room_id;
    const userId = event.sender;
    const agentId = env.AGENT.idFromName(`matrix:${chatId}`);
    const agent = env.AGENT.get(agentId) as unknown as AgentDO;
    const reply = await agent.onMessage(text, { platform: "matrix", userId, chatId });
    // Send reply via Matrix Client-Server API
    await fetch(`https://matrix.org/_matrix/client/r0/rooms/${encodeURIComponent(chatId)}/send/m.room.message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.MATRIX_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ msgtype: "m.text", body: reply }),
    });
    return new Response("OK");
  } catch (error) {
    console.error("Matrix webhook error:", error);
    return new Response("OK");
  }
}
