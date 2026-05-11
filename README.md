# Tazavesh

**Persistent AI Agent Gateway · Always Online · Always Remembering**

A production-grade, multi-platform AI agent framework built on Cloudflare Workers. Deploy once, persist forever — your agent stays online 24/7 with durable memory, extensible skills, and seamless multi-channel connectivity.

---

## Why Tazavesh

Most AI agents are stateless. They forget everything between sessions, go offline when you close the tab, and require separate integrations for every platform. Tazavesh solves all three problems in a single, lightweight deployment:

- **Always Online** — Runs on Cloudflare Workers globally. No servers to maintain. Your agent is available 24/7/365 with zero DevOps overhead.
- **Persistent Memory** — Every conversation, every user fact, every context is stored in D1 (SQLite at the edge). Your agent remembers across sessions, days, and months.
- **Universal Model Access** — Compatible with any OpenAI-format API. Swap between providers without changing a single line of code.
- **One Agent, All Platforms** — Telegram, Discord, Matrix, Feishu, QQ, Web — one codebase, one deployment, all channels.

---

## Key Features

### 🧠 Durable Memory System

```
User: 我叫张三，我喜欢用 Python
Agent: 你好张三！Python 是很棒的语言。
--- 三天后 ---
User: 帮我写个脚本
Agent: 好的张三，我帮你用 Python 写一个...
```

- Conversation history stored in D1 (Cloudflare's edge SQLite)
- Automatic context loading — previous messages injected into every prompt
- User profile extraction — preferences, facts, and identity persisted across sessions
- Per-user isolation — each user gets their own memory space

### 🔌 Universal Model Router

Works with **any OpenAI-compatible API**. Configure once, switch anytime.

| Provider | Models | Endpoint |
|----------|--------|----------|
| **Xiaomi MiMo** ⭐ | MiMo-V2.5-Pro, MiMo-V2.5-Lite | `api.xiaomimimo.com` |
| **SiliconFlow** | DeepSeek-R1, Qwen3-235B, GLM-4 | `api.siliconflow.cn` |
| **DeepSeek** | DeepSeek-V3, DeepSeek-R1 | `api.deepseek.com` |
| **DashScope** | Qwen-Max, Qwen-Plus | `dashscope.aliyuncs.com` |
| **OpenAI** | GPT-4o, GPT-4.1, o4-mini | `api.openai.com` |
| **Anthropic** | Claude Sonnet 4, Claude Opus 4 | `api.anthropic.com` |
| **Any OpenAI-compatible** | Custom endpoints | Your own URL |

> **Recommended:** [Xiaomi MiMo](https://mimo.xiaomi.com/) offers generous free-tier tokens for developers. MiMo-V2.5-Pro delivers strong reasoning at competitive latency.

### 🧩 Extensible Skill System

Register custom tools that your agent can invoke during conversations:

```
Built-in Skills:
├── 🔢 Calculator      — Mathematical expression evaluation
├── ⏰ Current Time    — Timezone-aware datetime queries
├── 🔍 Web Search      — Internet search integration
├── 🌐 Fetch URL       — Webpage content retrieval
├── 💻 Code Execution  — Sandboxed code runner
└── 📝 Text Processing — String manipulation utilities

Custom Skills:
├── 📊 Data Analysis   — Your custom data pipeline
├── 🗄️ Database Query  — Direct D1 query interface
└── 🔗 API Connector   — Third-party API integrations
```

Adding a new skill is a single function registration — no framework changes required.

### 🌐 Multi-Platform Channels

One agent, deployed everywhere:

| Platform | Status | Features |
|----------|--------|----------|
| **Web Chat** | ✅ Built-in | Auth, chat history, responsive UI |
| **Telegram** | ✅ Ready | Bot API, inline keyboards, media |
| **Discord** | ✅ Ready | Slash commands, threads, embeds |
| **Matrix** | ✅ Ready | E2E encryption, federation |
| **Feishu (飞书)** | ✅ Ready | Cards, rich messages |
| **QQ** | ✅ Ready | Group/private messaging |

Each channel is a lightweight adapter — no platform-specific logic leaks into the core agent.

### 🔐 Authentication & Access Control

- User registration and login system
- Session-based authentication with HTTP-only cookies
- Per-user conversation isolation
- Rate limiting and abuse prevention

### ☁️ Cloudflare-Native Architecture

```
┌─────────────────────────────────────────────┐
│              Cloudflare Edge                │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Workers  │  │    D1    │  │    KV    │  │
│  │ (Compute)│  │ (SQLite) │  │ (Cache)  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │              │              │        │
│  ┌────┴──────────────┴──────────────┴────┐  │
│  │         Durable Objects               │  │
│  │    (Stateful Agent Instances)         │  │
│  └───────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

- **Workers** — Serverless compute, auto-scales globally
- **D1** — SQLite at the edge, zero-latency reads
- **KV** — Key-value cache for sessions and config
- **Durable Objects** — Stateful agent instances with WebSocket support
- **Free Tier** — 100K requests/day, 10GB D1 storage, zero cost

---

## Quick Start

### Prerequisites

- Node.js 18+
- Cloudflare account
- At least one OpenAI-compatible API key

### 1. Install

```bash
git clone https://github.com/muskfeel/tazavesh.git
cd tazavesh
npm install
```

### 2. Configure

```bash
# Set your preferred model API key
wrangler secret put MIMO_API_KEY        # Xiaomi MiMo (recommended)
wrangler secret put SILICON_API_KEY     # SiliconFlow
wrangler secret put DEEPSEEK_API_KEY    # DeepSeek
```

### 3. Deploy

```bash
npm run deploy
```

### 4. Access

Open `https://tazavesh.<your-subdomain>.workers.dev/chat` — register, login, and start chatting.

---

## Local Development

```bash
npm run dev
# → http://localhost:8787/chat
```

Local mode uses the same D1 database and KV namespace via Miniflare.

---

## Configuration

### Model Selection

Edit `src/models/router.ts` to configure available models and routing logic:

```typescript
// Add a new provider
{
  id: "my-provider",
  name: "My Custom API",
  baseUrl: "https://my-api.com/v1",
  model: "my-model",
  apiKey: env.MY_API_KEY,
  maxTokens: 4096,
}
```

### Channel Setup

Each platform channel is independently configurable. Set the corresponding environment variables to enable:

| Variable | Platform |
|----------|----------|
| `TELEGRAM_BOT_TOKEN` | Telegram |
| `DISCORD_BOT_TOKEN` | Discord |
| `MATRIX_ACCESS_TOKEN` | Matrix |
| `FEISHU_APP_ID` + `FEISHU_APP_SECRET` | Feishu |
| `QQ_APP_ID` + `QQ_APP_SECRET` | QQ |

### Database Schema

```sql
-- Conversations and messages
CREATE TABLE conversations (id TEXT PRIMARY KEY, user_id TEXT, created_at DATETIME);
CREATE TABLE messages (id INTEGER PRIMARY KEY, conversation_id TEXT, role TEXT, content TEXT, created_at DATETIME);

-- User system
CREATE TABLE users (id TEXT PRIMARY KEY, username TEXT UNIQUE, password_hash TEXT, created_at DATETIME);
CREATE TABLE sessions (token TEXT PRIMARY KEY, user_id TEXT, expires_at DATETIME);
CREATE TABLE user_preferences (user_id TEXT PRIMARY KEY, facts TEXT, updated_at DATETIME);
```

---

## Project Structure

```
tazavesh/
├── src/
│   ├── index.ts                    # Worker entry point
│   ├── core/
│   │   ├── agent.ts                # Agent engine (memory + tools)
│   │   ├── agent-core.ts           # Durable Object stateful agent
│   │   ├── memory.ts               # D1-based memory system
│   │   ├── skills.ts               # Skill registry & executor
│   │   ├── auth.ts                 # User authentication
│   │   ├── chat/                   # Streaming chat protocol
│   │   └── extensions/             # Plugin system
│   ├── channels/
│   │   ├── webchat.ts              # Web UI (SPA + auth)
│   │   ├── telegram.ts             # Telegram adapter
│   │   ├── discord.ts              # Discord adapter
│   │   ├── matrix.ts               # Matrix adapter
│   │   ├── feishu.ts               # Feishu adapter
│   │   └── qq.ts                   # QQ adapter
│   ├── models/
│   │   └── router.ts               # Multi-model routing
│   └── tools/
│       └── registry.ts             # Tool definitions
├── wrangler.jsonc                   # Cloudflare Workers config
├── schema.sql                      # D1 database schema
└── package.json
```

---

## Roadmap

- [ ] Streaming response support (SSE)
- [ ] Voice message processing (Whisper integration)
- [ ] Image generation tool (DALL-E / Stable Diffusion)
- [ ] File upload and analysis
- [ ] Scheduled tasks and cron jobs
- [ ] Webhook event system
- [ ] Admin dashboard
- [ ] Multi-language support

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Cloudflare Workers |
| Storage | D1 (SQLite) + KV |
| State | Durable Objects |
| Language | TypeScript |
| AI | OpenAI-compatible API |
| Auth | HTTP-only session cookies |

---

## License

MIT

---

> *Your agent. Your data. Your infrastructure. Always online.*
