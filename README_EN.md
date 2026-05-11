<p align="center">
  <h1 align="center">Tazavesh 🌀</h1>
  <p align="center"><b>Persistent AI Agent Gateway · Always Online · Always Remembering · Universal Access</b></p>
</p>

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/README-中文-blue?style=for-the-badge" alt="中文"></a>
  <a href="README_EN.md"><img src="https://img.shields.io/badge/README-English-green?style=for-the-badge" alt="English"></a>
  <a href="README_DE.md"><img src="https://img.shields.io/badge/README-Deutsch-red?style=for-the-badge" alt="Deutsch"></a>
</p>

<p align="center">
  <a href="https://github.com/muskfeel/tazavesh"><img src="https://img.shields.io/github/stars/muskfeel/tazavesh?style=flat-square" alt="Stars"></a>
  <a href="https://github.com/muskfeel/tazavesh/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License: MIT"></a>
  <a href="https://workers.cloudflare.com"><img src="https://img.shields.io/badge/Deploy-Cloudflare%20Workers-orange?style=flat-square" alt="Deploy to CF"></a>
  <a href="#"><img src="https://img.shields.io/badge/Free%20Tier-100K%20req%2Fday-blueviolet?style=flat-square" alt="Free Tier"></a>
</p>

---

## What is Tazavesh

Tazavesh is a production-grade, multi-platform AI agent framework built on **Cloudflare Workers**.

**Deploy once, run forever.** Your agent stays online 24/7 with durable memory, extensible skills, and seamless multi-channel connectivity. No servers, no DevOps, zero cost to start.

### Core Highlights

<table>
<tr><td><b>⚡ Always Online</b></td><td>Runs on Cloudflare's global edge network. No servers to maintain. 24/7/365 availability with zero DevOps overhead.</td></tr>
<tr><td><b>🧠 Persistent Memory</b></td><td>Conversation history, user preferences, and context stored in D1 (edge SQLite). Cross-session, cross-day, cross-month memory — never forgets.</td></tr>
<tr><td><b>🔌 Universal Model Access</b></td><td>Compatible with any OpenAI-format API. Recommended: Xiaomi MiMo. Also supports SiliconFlow, DeepSeek, OpenAI, Anthropic, and more.</td></tr>
<tr><td><b>🧩 Skill System</b></td><td>Extensible skill registry and execution. Built-in calculator, search, time queries. Custom tools are one function away.</td></tr>
<tr><td><b>🌐 Multi-Platform</b></td><td>Web, Telegram, Discord, Matrix, Feishu, QQ — one codebase, all channels.</td></tr>
<tr><td><b>🔐 Authentication</b></td><td>User registration/login, session isolation, rate limiting, abuse prevention.</td></tr>
<tr><td><b>☁️ Zero Cost</b></td><td>Cloudflare Workers free tier: 100K requests/day, 10GB D1 storage — completely free.</td></tr>
</table>

---

## ⭐ Recommended: Xiaomi MiMo

<table>
<tr>
<td width="120" align="center">
  <img src="https://img.shields.io/badge/Xiaomi-MiMo-FF6900?style=for-the-badge&logo=xiaomi&logoColor=white" alt="MiMo">
</td>
<td>
  <b>MiMo-V2.5-Pro</b> — Xiaomi's flagship reasoning model<br>
  ✅ Generous free tier (apply for massive token allocation)<br>
  ✅ Strong reasoning, low latency<br>
  ✅ Fully compatible with OpenAI API format<br>
  ✅ Apply at: <a href="https://100t.xiaomimimo.com">100t.xiaomimimo.com</a>
</td>
</tr>
</table>

> 💡 **Why MiMo?** Xiaomi offers developers generous free token allocations (100 trillion token pool). MiMo-V2.5-Pro excels at reasoning tasks with zero integration cost — just swap the API key.

### Supported Providers

| Provider | Models | Endpoint | Rating |
|----------|--------|----------|--------|
| **Xiaomi MiMo** | MiMo-V2.5-Pro, MiMo-V2.5-Lite | `api.xiaomimimo.com` | ⭐⭐⭐⭐⭐ |
| **SiliconFlow** | DeepSeek-R1, Qwen3-235B, GLM-4 | `api.siliconflow.cn` | ⭐⭐⭐⭐ |
| **DeepSeek** | DeepSeek-V3, DeepSeek-R1 | `api.deepseek.com` | ⭐⭐⭐⭐ |
| **DashScope** | Qwen-Max, Qwen-Plus | `dashscope.aliyuncs.com` | ⭐⭐⭐⭐ |
| **OpenAI** | GPT-4o, GPT-4.1, o4-mini | `api.openai.com` | ⭐⭐⭐ |
| **Anthropic** | Claude Sonnet 4, Claude Opus 4 | `api.anthropic.com` | ⭐⭐⭐ |
| **Any OpenAI-compatible** | Custom endpoints | Your own URL | — |

---

## Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Devices (Any Platform)              │
│  Web · Telegram · Discord · Matrix · Feishu · QQ           │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS / WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Cloudflare Edge Network                    │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Workers   │  │     D1      │  │     KV      │        │
│  │ (Serverless)│  │(Edge SQLite)│  │ (Key-Value) │        │
│  │  Global     │  │  Zero-lat.  │  │  Session    │        │
│  │  Auto-scale │  │  Persistent │  │  Cache      │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                 │
│  ┌──────┴────────────────┴────────────────┴──────┐         │
│  │              Durable Objects                   │         │
│  │         (Stateful Agent Instances)             │         │
│  │    WebSocket · Session State · Concurrency     │         │
│  └───────────────────────────────────────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  AI Model APIs (Any Provider)               │
│  MiMo · SiliconFlow · DeepSeek · OpenAI · Anthropic ...    │
└─────────────────────────────────────────────────────────────┘
```

### Core Modules

| Module | File | Responsibility |
|--------|------|---------------|
| **Worker Entry** | `src/index.ts` | Routing, platform dispatch |
| **Agent Engine** | `src/core/agent.ts` | Agentic loop, model calls, system prompt |
| **Durable Object** | `src/core/agent-core.ts` | Stateful agent instance, concurrency |
| **Memory System** | `src/core/memory.ts` | D1 conversation store, history loading |
| **Skill System** | `src/core/skills.ts` | Tool registration, execution engine |
| **Auth System** | `src/core/auth.ts` | User registration/login, sessions |
| **Model Router** | `src/models/router.ts` | Multi-provider switching, routing |
| **Chat Protocol** | `src/core/chat/` | Streaming, message building, tool state |
| **Extensions** | `src/core/extensions/` | Plugin architecture, hook proxy |

### Data Flow

```
User Message → Platform Adapter → Agent Engine
  ├── Load Memory (D1 history query)
  ├── Build Context (system prompt + history + user profile)
  ├── Detect Tool Calls (keyword matching / LLM function calling)
  │   ├── Calculator → math evaluation
  │   ├── Web Search → search results
  │   └── Fetch URL → webpage content
  ├── Call Model API (OpenAI-compatible format)
  ├── Save Response (D1 write)
  └── Return to User (original platform)
```

---

## Feature Deep Dive

### 🧠 Persistent Memory System

```
User: My name is Alice, I prefer Python, I work in fintech
Agent: Hi Alice! Python is great for fintech — I recommend ccxt for trading APIs.
--- Three days later ---
User: Write me a BTC price scraper
Agent: Sure Alice, I'll use Python + ccxt for your BTC scraper...
```

**Technical Implementation:**

- Conversation history stored in D1 `messages` table, indexed by `conversation_id`
- Automatic context loading: last N messages injected into LLM context per turn
- `user_preferences` table stores user profiles (fact extraction + preference tracking)
- Per-user isolation: each user has their own `user_id` with fully separated data

### 🔌 Universal Model Router

Works with **any OpenAI-compatible API**. Configure once, switch anytime.

**Quick Setup (MiMo example):**

```bash
npx wrangler secret put MIMO_API_KEY
# Enter your MiMo API Key
```

**Add Custom Provider:**

Edit `src/models/router.ts`:

```typescript
{
  id: "my-provider",
  name: "My Custom API",
  baseUrl: "https://my-api.com/v1",
  model: "my-model-name",
  apiKey: env.MY_API_KEY,
  maxTokens: 4096,
  temperature: 0.7,
}
```

### 🧩 Extensible Skill System

```
Built-in:
├── 🔢 Calculator      — Math expression evaluation
├── ⏰ Current Time    — Timezone-aware datetime
├── 🔍 Web Search      — Internet search
├── 🌐 Fetch URL       — Webpage content retrieval
├── 💻 Code Execution  — Sandboxed code runner
└── 📝 Text Processing — String manipulation

Custom:
├── 📊 Data Analysis   — Your custom pipeline
├── 🗄️ Database Query  — Direct D1 interface
├── 🔗 API Connector   — Third-party integrations
└── 🤖 Auto Reply      — Automated response rules
```

### 🌐 Multi-Platform Channels

| Platform | Status | Features | Config |
|----------|--------|----------|--------|
| **Web Chat** | ✅ Built-in | Auth, history, responsive UI | None |
| **Telegram** | ✅ Ready | Bot API, inline keyboards, media | `TELEGRAM_BOT_TOKEN` |
| **Discord** | ✅ Ready | Slash commands, threads, embeds | `DISCORD_BOT_TOKEN` |
| **Matrix** | ✅ Ready | E2E encryption, federation | `MATRIX_ACCESS_TOKEN` |
| **Feishu** | ✅ Ready | Cards, rich messages | `FEISHU_APP_ID` + `FEISHU_APP_SECRET` |
| **QQ** | ✅ Ready | Group/private messaging | `QQ_APP_ID` + `QQ_APP_SECRET` |

---

## Quick Start

### Prerequisites

- Node.js 18+
- Cloudflare account (free)
- At least one OpenAI-compatible API key (recommended: Xiaomi MiMo)

### 1. Clone

```bash
git clone https://github.com/muskfeel/tazavesh.git
cd tazavesh
npm install
```

### 2. Login to Cloudflare

```bash
npx wrangler login
```

### 3. Create D1 Database

```bash
npx wrangler d1 create tazavesh-db
# Save the database_id, update wrangler.jsonc
```

### 4. Create KV Namespace

```bash
npx wrangler kv namespace create CACHE
# Save the id, update wrangler.jsonc
```

### 5. Initialize Database

```bash
npx wrangler d1 execute tazavesh-db --file=schema.sql
```

### 6. Set API Keys

```bash
# Recommended: Xiaomi MiMo (generous free tier)
npx wrangler secret put MIMO_API_KEY

# Optional: other providers
npx wrangler secret put SILICON_API_KEY
npx wrangler secret put DEEPSEEK_API_KEY
npx wrangler secret put OPENAI_API_KEY
```

### 7. Deploy

```bash
npm run deploy
# → https://tazavesh.<your-subdomain>.workers.dev/chat
```

### 8. Access

Open the deployment URL → Register → Login → Start chatting!

---

## Local Development

```bash
npm run dev
# → http://localhost:8787/chat
```

Local mode uses Miniflare to simulate the Cloudflare environment. D1 and KV data is stored locally.

### Debug Mode

```bash
npx wrangler dev --log-level debug
```

### View Logs

```bash
npx wrangler tail
```

---

## Configuration Reference

### Environment Variables / Secrets

| Variable | Required | Description |
|----------|----------|-------------|
| `MIMO_API_KEY` | ✅ Recommended | Xiaomi MiMo API Key |
| `SILICON_API_KEY` | Optional | SiliconFlow API Key |
| `DEEPSEEK_API_KEY` | Optional | DeepSeek API Key |
| `OPENAI_API_KEY` | Optional | OpenAI API Key |
| `DASHSCOPE_API_KEY` | Optional | Alibaba DashScope API Key |
| `TELEGRAM_BOT_TOKEN` | Optional | Telegram Bot Token |
| `DISCORD_BOT_TOKEN` | Optional | Discord Bot Token |
| `MATRIX_ACCESS_TOKEN` | Optional | Matrix Access Token |
| `FEISHU_APP_ID` + `FEISHU_APP_SECRET` | Optional | Feishu credentials |
| `QQ_APP_ID` + `QQ_APP_SECRET` | Optional | QQ credentials |

---

## Project Structure

```
tazavesh/
├── src/
│   ├── index.ts                    # Worker entry point
│   ├── core/
│   │   ├── agent.ts                # Agent engine (Agentic Loop)
│   │   ├── agent-core.ts           # Durable Object stateful agent
│   │   ├── memory.ts               # D1 memory system
│   │   ├── skills.ts               # Skill registry & execution
│   │   ├── auth.ts                 # User authentication
│   │   ├── think.ts                # Reasoning engine
│   │   ├── workflows.ts            # Workflow engine
│   │   ├── schedule.ts             # Scheduled tasks
│   │   ├── chat/                   # Chat protocol
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
├── wrangler.jsonc                   # CF Workers config
├── schema.sql                      # D1 database schema
└── package.json
```

---

## Roadmap

- [ ] Streaming responses (SSE)
- [ ] Voice message processing (Whisper)
- [ ] Image generation (DALL-E / Stable Diffusion)
- [ ] File upload & analysis
- [ ] Scheduled tasks & cron jobs
- [ ] Webhook event system
- [ ] Admin dashboard
- [ ] Multi-language agents (EN/CN/JP/KR)
- [ ] RAG knowledge base integration
- [ ] MCP protocol support

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Cloudflare Workers |
| Storage | D1 (SQLite at Edge) + KV |
| State | Durable Objects |
| Language | TypeScript |
| AI | OpenAI-compatible API |
| Auth | HTTP-only Session Cookies |
| Build | Wrangler + esbuild |

---

## License

MIT

---

<p align="center">
  <sub>Your agent. Your data. Your infrastructure. Always online.</sub>
</p>
