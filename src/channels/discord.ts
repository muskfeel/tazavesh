/**
 * Discord Channel - Webhook 适配器
 */
import type { Env } from "../index";
import type { AgentDO } from "../core/agent-core";

interface DiscordInteraction {
  type: number;
  data?: { name: string; options?: Array<{ name: string; value: string }> };
  member?: { user: { id: string; username: string } };
  channel_id: string;
  token: string;
}

export async function handleDiscordWebhook(
  request: Request, env: Env, ctx: ExecutionContext
): Promise<Response> {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const interaction = await request.json() as DiscordInteraction;
    if (interaction.type !== 3) return new Response("OK"); // Only handle message interactions
    const userId = interaction.member?.user.id || "unknown";
    const chatId = interaction.channel_id;
    const text = interaction.data?.options?.[0]?.value || "";
    if (!text) return new Response("OK");
    const agentId = env.AGENT.idFromName(`discord:${chatId}`);
    const agent = env.AGENT.get(agentId) as unknown as AgentDO;
    const reply = await agent.onMessage(text, { platform: "discord", userId, chatId });
    return new Response(JSON.stringify({
      type: 4,
      data: { content: reply },
    }), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Discord webhook error:", error);
    return new Response("OK");
  }
}
