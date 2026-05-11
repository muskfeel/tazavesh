# Tazavesh

**Persistent AI Agent Gateway · Always Online · Always Remembering**

[English](#english) · [中文](#中文) · [Deutsch](#deutsch)

---

<a name="english"></a>
## 🇬🇧 English

A production-grade, multi-platform AI agent framework built on Cloudflare Workers. Deploy once, persist forever — your agent stays online 24/7 with durable memory, extensible skills, and seamless multi-channel connectivity.

### Why Tazavesh

Most AI agents are stateless. They forget everything between sessions, go offline when you close the tab, and require separate integrations for every platform. Tazavesh solves all three problems in a single, lightweight deployment:

- **Always Online** — Runs on Cloudflare Workers globally. No servers to maintain. Your agent is available 24/7/365 with zero DevOps overhead.
- **Persistent Memory** — Every conversation, every user fact, every context is stored in D1 (SQLite at the edge). Your agent remembers across sessions, days, and months.
- **Universal Model Access** — Compatible with any OpenAI-format API. Swap between providers without changing a single line of code.
- **One Agent, All Platforms** — Telegram, Discord, Matrix, Feishu, QQ, Web — one codebase, one deployment, all channels.

### Features

#### 🧠 Durable Memory System

```
User: My name is Alice, I prefer Python
Agent: Hi Alice! Python is a great language.
--- Three days later ---
User: Write me a script
Agent: Sure Alice, I'll write it in Python for you...
```

- Conversation history stored in D1 (Cloudflare's edge SQLite)
- Automatic context loading — previous messages injected into every prompt
- User profile extraction — preferences, facts, and identity persisted across sessions
- Per-user isolation — each user gets their own memory space

#### 🔌 Universal Model Router

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

> **Recommended:** [Xiaomi MiMo](https://mimo.xiaomi.com/) offers generous free-tier tokens for developers.

#### 🧩 Extensible Skill System

Register custom tools that your agent can invoke during conversations:

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
└── 🔗 API Connector   — Third-party integrations
```

#### 🌐 Multi-Platform Channels

| Platform | Status | Features |
|----------|--------|----------|
| **Web Chat** | ✅ Built-in | Auth, chat history, responsive UI |
| **Telegram** | ✅ Ready | Bot API, inline keyboards, media |
| **Discord** | ✅ Ready | Slash commands, threads, embeds |
| **Matrix** | ✅ Ready | E2E encryption, federation |
| **Feishu (飞书)** | ✅ Ready | Cards, rich messages |
| **QQ** | ✅ Ready | Group/private messaging |

#### 🔐 Authentication & Access Control

- User registration and login system
- Session-based authentication with HTTP-only cookies
- Per-user conversation isolation
- Rate limiting and abuse prevention

#### ☁️ Cloudflare-Native Architecture

```
┌─────────────────────────────────────────────┐
│              Cloudflare Edge                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Workers  │  │    D1    │  │    KV    │  │
│  │ (Compute)│  │ (SQLite) │  │ (Cache)  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│  ┌────┴──────────────┴──────────────┴────┐  │
│  │         Durable Objects               │  │
│  │    (Stateful Agent Instances)         │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

- **Workers** — Serverless compute, auto-scales globally
- **D1** — SQLite at the edge, zero-latency reads
- **KV** — Key-value cache for sessions and config
- **Durable Objects** — Stateful agent instances with WebSocket support
- **Free Tier** — 100K requests/day, 10GB D1 storage, zero cost

### Quick Start

```bash
# Prerequisites: Node.js 18+, Cloudflare account, one OpenAI-compatible API key

git clone https://github.com/muskfeel/tazavesh.git
cd tazavesh
npm install

# Configure
wrangler secret put MIMO_API_KEY        # Xiaomi MiMo (recommended)
wrangler secret put SILICON_API_KEY     # SiliconFlow
wrangler secret put DEEPSEEK_API_KEY    # DeepSeek

# Deploy
npm run deploy

# Access
# → https://tazavesh.<your-subdomain>.workers.dev/chat
```

### Local Development

```bash
npm run dev
# → http://localhost:8787/chat
```

### Configuration

#### Add a Custom Model Provider

Edit `src/models/router.ts`:

```typescript
{
  id: "my-provider",
  name: "My Custom API",
  baseUrl: "https://my-api.com/v1",
  model: "my-model",
  apiKey: env.MY_API_KEY,
  maxTokens: 4096,
}
```

#### Enable Platform Channels

| Variable | Platform |
|----------|----------|
| `TELEGRAM_BOT_TOKEN` | Telegram |
| `DISCORD_BOT_TOKEN` | Discord |
| `MATRIX_ACCESS_TOKEN` | Matrix |
| `FEISHU_APP_ID` + `FEISHU_APP_SECRET` | Feishu |
| `QQ_APP_ID` + `QQ_APP_SECRET` | QQ |

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Cloudflare Workers |
| Storage | D1 (SQLite) + KV |
| State | Durable Objects |
| Language | TypeScript |
| AI | OpenAI-compatible API |
| Auth | HTTP-only session cookies |

### Roadmap

- [ ] Streaming response support (SSE)
- [ ] Voice message processing (Whisper integration)
- [ ] Image generation tool (DALL-E / Stable Diffusion)
- [ ] File upload and analysis
- [ ] Scheduled tasks and cron jobs
- [ ] Webhook event system
- [ ] Admin dashboard

### License

MIT

> *Your agent. Your data. Your infrastructure. Always online.*

---

<a name="中文"></a>
## 🇨🇳 中文

**持久化 AI Agent 网关 · 永久在线 · 永久记忆**

基于 Cloudflare Workers 构建的生产级多平台 AI Agent 框架。一次部署，永久运行 — 您的 Agent 24/7 在线，拥有持久记忆、可扩展技能和无缝多通道连接。

### 为什么选择 Tazavesh

大多数 AI Agent 是无状态的。它们在会话之间遗忘一切，关闭标签页就离线，每个平台都需要单独集成。Tazavesh 在一次轻量部署中解决这三个问题：

- **永久在线** — 运行在全球 Cloudflare Workers 上，无需维护服务器。您的 Agent 24/7/365 可用，零运维开销。
- **持久记忆** — 每次对话、每个用户信息、每个上下文都存储在 D1（边缘 SQLite）中。您的 Agent 跨会话、跨天、跨月记忆。
- **通用模型接入** — 兼容任何 OpenAI 格式 API。无需修改一行代码即可切换提供商。
- **一个 Agent，所有平台** — Telegram、Discord、Matrix、飞书、QQ、Web — 一套代码，一次部署，全渠道覆盖。

### 功能特性

#### 🧠 持久记忆系统

```
用户：我叫张三，我喜欢用 Python
Agent：你好张三！Python 是很棒的语言。
--- 三天后 ---
用户：帮我写个脚本
Agent：好的张三，我帮你用 Python 写一个...
```

- 对话历史存储在 D1（Cloudflare 边缘 SQLite）
- 自动上下文加载 — 之前的对话自动注入每次提示
- 用户画像提取 — 偏好、事实和身份跨会话持久化
- 用户隔离 — 每个用户拥有独立记忆空间

#### 🔌 通用模型路由器

兼容**任何 OpenAI 兼容 API**，配置一次，随时切换。

| 提供商 | 模型 | 端点 |
|--------|------|------|
| **小米 MiMo** ⭐ | MiMo-V2.5-Pro, MiMo-V2.5-Lite | `api.xiaomimimo.com` |
| **SiliconFlow** | DeepSeek-R1, Qwen3-235B, GLM-4 | `api.siliconflow.cn` |
| **DeepSeek** | DeepSeek-V3, DeepSeek-R1 | `api.deepseek.com` |
| **DashScope** | Qwen-Max, Qwen-Plus | `dashscope.aliyuncs.com` |
| **OpenAI** | GPT-4o, GPT-4.1, o4-mini | `api.openai.com` |
| **Anthropic** | Claude Sonnet 4, Claude Opus 4 | `api.anthropic.com` |
| **任何 OpenAI 兼容** | 自定义端点 | 您自己的 URL |

> **推荐：** [小米 MiMo](https://mimo.xiaomi.com/) 为开发者提供慷慨的免费 Token 额度。

#### 🧩 可扩展技能系统

注册自定义工具，让您的 Agent 在对话中调用：

```
内置技能：
├── 🔢 计算器      — 数学表达式计算
├── ⏰ 当前时间    — 时区感知的日期时间
├── 🔍 网络搜索    — 互联网搜索
├── 🌐 获取 URL   — 网页内容抓取
├── 💻 代码执行    — 沙箱代码运行器
└── 📝 文本处理    — 字符串操作

自定义技能：
├── 📊 数据分析    — 您的数据管道
├── 🗄️ 数据库查询  — 直接 D1 接口
└── 🔗 API 连接器  — 第三方集成
```

#### 🌐 多平台通道

| 平台 | 状态 | 功能 |
|------|------|------|
| **Web 聊天** | ✅ 内置 | 认证、聊天记录、响应式 UI |
| **Telegram** | ✅ 就绪 | Bot API、内联键盘、媒体 |
| **Discord** | ✅ 就绪 | 斜杠命令、线程、嵌入 |
| **Matrix** | ✅ 就绪 | 端到端加密、联邦 |
| **飞书** | ✅ 就绪 | 卡片、富文本消息 |
| **QQ** | ✅ 就绪 | 群聊/私聊 |

#### 🔐 认证与访问控制

- 用户注册和登录系统
- 基于 Session 的 HTTP-only Cookie 认证
- 用户级对话隔离
- 速率限制与滥用防护

#### ☁️ Cloudflare 原生架构

```
┌─────────────────────────────────────────────┐
│              Cloudflare 边缘                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Workers  │  │    D1    │  │    KV    │  │
│  │ (计算)   │  │ (SQLite) │  │ (缓存)   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│  ┌────┴──────────────┴──────────────┴────┐  │
│  │         Durable Objects               │  │
│  │      (有状态 Agent 实例)              │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

- **Workers** — 无服务器计算，全球自动扩缩
- **D1** — 边缘 SQLite，零延迟读取
- **KV** — 会话和配置的键值缓存
- **Durable Objects** — 有状态 Agent 实例，支持 WebSocket
- **免费套餐** — 每天 100K 请求，10GB D1 存储，零成本

### 快速开始

```bash
# 前置条件：Node.js 18+、Cloudflare 账户、一个 OpenAI 兼容 API Key

git clone https://github.com/muskfeel/tazavesh.git
cd tazavesh
npm install

# 配置
wrangler secret put MIMO_API_KEY        # 小米 MiMo（推荐）
wrangler secret put SILICON_API_KEY     # SiliconFlow
wrangler secret put DEEPSEEK_API_KEY    # DeepSeek

# 部署
npm run deploy

# 访问
# → https://tazavesh.<your-subdomain>.workers.dev/chat
```

### 本地开发

```bash
npm run dev
# → http://localhost:8787/chat
```

### 配置

#### 添加自定义模型提供商

编辑 `src/models/router.ts`：

```typescript
{
  id: "my-provider",
  name: "My Custom API",
  baseUrl: "https://my-api.com/v1",
  model: "my-model",
  apiKey: env.MY_API_KEY,
  maxTokens: 4096,
}
```

#### 启用平台通道

| 变量 | 平台 |
|------|------|
| `TELEGRAM_BOT_TOKEN` | Telegram |
| `DISCORD_BOT_TOKEN` | Discord |
| `MATRIX_ACCESS_TOKEN` | Matrix |
| `FEISHU_APP_ID` + `FEISHU_APP_SECRET` | 飞书 |
| `QQ_APP_ID` + `QQ_APP_SECRET` | QQ |

### 技术栈

| 层级 | 技术 |
|------|------|
| 运行时 | Cloudflare Workers |
| 存储 | D1 (SQLite) + KV |
| 状态 | Durable Objects |
| 语言 | TypeScript |
| AI | OpenAI 兼容 API |
| 认证 | HTTP-only Session Cookie |

### 路线图

- [ ] 流式响应支持 (SSE)
- [ ] 语音消息处理 (Whisper 集成)
- [ ] 图片生成工具 (DALL-E / Stable Diffusion)
- [ ] 文件上传与分析
- [ ] 定时任务与 Cron
- [ ] Webhook 事件系统
- [ ] 管理后台

### 许可证

MIT

> *您的 Agent。您的数据。您的基础设施。永久在线。*

---

<a name="deutsch"></a>
## 🇩🇪 Deutsch

**Persistenter AI-Agent-Gateway · Immer Online · Immer Erinnernd**

Eine produktionsreife, plattformübergreifende AI-Agent-Plattform, die auf Cloudflare Workers aufgebaut ist. Einmal deployen, für immer bestehen — Ihr Agent bleibt 24/7 online mit dauerhaftem Speicher, erweiterbaren Skills und nahtloser Multi-Channel-Konnektivität.

### Warum Tazavesh

Die meisten AI-Agents sind zustandslos. Sie vergessen alles zwischen Sitzungen, gehen offline, wenn Sie den Tab schließen, und erfordern separate Integrationen für jede Plattform. Tazavesh löst alle drei Probleme in einem einzigen, leichtgewichtigen Deployment:

- **Immer Online** — Läuft weltweit auf Cloudflare Workers. Keine Server zu warten. Ihr Agent ist 24/7/365 verfügbar, ohne DevOps-Aufwand.
- **Dauerhafter Speicher** — Jedes Gespräch, jede Benutzerinformation, jeder Kontext wird in D1 (SQLite am Edge) gespeichert. Ihr Agent erinnert sich über Sitzungen, Tage und Monate hinweg.
- **Universeller Modellzugang** — Kompatibel mit jeder OpenAI-kompatiblen API. Wechseln Sie zwischen Anbietern, ohne eine Zeile Code zu ändern.
- **Ein Agent, alle Plattformen** — Telegram, Discord, Matrix, Feishu, QQ, Web — eine Codebasis, ein Deployment, alle Kanäle.

### Funktionen

#### 🧠 Dauerhaftes Speichersystem

```
Benutzer: Ich heiße Hans, ich bevorzuge Python
Agent: Hallo Hans! Python ist eine großartige Sprache.
--- Drei Tage später ---
Agent: Natürlich Hans, ich schreibe es dir in Python...
```

- Gesprächsverlauf in D1 (Cloudflare Edge SQLite) gespeichert
- Automatisches Kontext-Loading — vorherige Nachrichten werden in jeden Prompt injiziert
- Benutzerprofil-Extraktion — Vorlieben, Fakten und Identität werden über Sitzungen hinweg gespeichert
- Benutzer-Isolation — jeder Benutzer hat seinen eigenen Speicherbereich

#### 🔌 Universeller Modell-Router

Funktioniert mit **jeder OpenAI-kompatiblen API**. Einmal konfigurieren, jederzeit wechseln.

| Anbieter | Modelle | Endpoint |
|----------|---------|----------|
| **Xiaomi MiMo** ⭐ | MiMo-V2.5-Pro, MiMo-V2.5-Lite | `api.xiaomimimo.com` |
| **SiliconFlow** | DeepSeek-R1, Qwen3-235B, GLM-4 | `api.siliconflow.cn` |
| **DeepSeek** | DeepSeek-V3, DeepSeek-R1 | `api.deepseek.com` |
| **DashScope** | Qwen-Max, Qwen-Plus | `dashscope.aliyuncs.com` |
| **OpenAI** | GPT-4o, GPT-4.1, o4-mini | `api.openai.com` |
| **Anthropic** | Claude Sonnet 4, Claude Opus 4 | `api.anthropic.com` |
| **Jeder OpenAI-kompatible** | Eigene Endpunkte | Ihre eigene URL |

> **Empfehlung:** [Xiaomi MiMo](https://mimo.xiaomi.com/) bietet Entwicklern großzügige kostenlose Token-Guthaben.

#### 🧩 Erweiterbares Skill-System

Registrieren Sie benutzerdefinierte Tools, die Ihr Agent during Gesprächen aufrufen kann:

```
Eingebaute Skills:
├── 🔢 Taschenrechner  — Mathematische Ausdrücke
├── ⏰ Aktuelle Zeit   — Zeitzonen-aware Datum/Zeit
├── 🔍 Websuche        — Internetsuche
├── 🌐 URL abrufen     — Webseiteninhalt abrufen
├── 💻 Code-Ausführung — Sandboxed Code-Runner
└── 📝 Textverarbeitung — String-Operationen

Benutzerdefinierte Skills:
├── 📊 Datenanalyse    — Ihr eigenes Pipeline
├── 🗄️ Datenbank-Query — Direkte D1-Schnittstelle
└── 🔗 API-Connector   — Drittanbieter-Integrationen
```

#### 🌐 Multi-Plattform-Kanäle

| Plattform | Status | Funktionen |
|-----------|--------|------------|
| **Web-Chat** | ✅ Eingebaut | Auth, Chat-Verlauf, responsive UI |
| **Telegram** | ✅ Bereit | Bot API, Inline-Keyboards, Medien |
| **Discord** | ✅ Bereit | Slash-Commands, Threads, Embeds |
| **Matrix** | ✅ Bereit | E2E-Verschlüsselung, Föderation |
| **Feishu (飞书)** | ✅ Bereit | Cards, Rich Messages |
| **QQ** | ✅ Bereit | Gruppen-/Privatnachrichten |

#### 🔐 Authentifizierung & Zugriffskontrolle

- Benutzer-Registrierungs- und Login-System
- Session-basierte Authentifizierung mit HTTP-only Cookies
- Benutzer-Isolation der Gespräche
- Rate-Limiting und Missbrauchsprävention

#### ☁️ Cloudflare-Native Architektur

```
┌─────────────────────────────────────────────┐
│              Cloudflare Edge                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Workers  │  │    D1    │  │    KV    │  │
│  │(Berechn.)│  │ (SQLite) │  │ (Cache)  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│  ┌────┴──────────────┴──────────────┴────┐  │
│  │         Durable Objects               │  │
│  │    (Zustandsbehaftete Agent-Instanzen)│  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

- **Workers** — Serverlose Berechnung, weltweit automatische Skalierung
- **D1** — SQLite am Edge, null-Latenz-Lesevorgänge
- **KV** — Schlüssel-Wert-Cache für Sitzungen und Konfiguration
- **Durable Objects** — Zustandsbehaftete Agent-Instanzen mit WebSocket-Unterstützung
- **Kostenloses Tarif** — 100K Anfragen/Tag, 10GB D1-Speicher, null Kosten

### Schnellstart

```bash
# Voraussetzungen: Node.js 18+, Cloudflare-Konto, ein OpenAI-kompatibler API-Key

git clone https://github.com/muskfeel/tazavesh.git
cd tazavesh
npm install

# Konfigurieren
wrangler secret put MIMO_API_KEY        # Xiaomi MiMo (empfohlen)
wrangler secret put SILICON_API_KEY     # SiliconFlow
wrangler secret put DEEPSEEK_API_KEY    # DeepSeek

# Deployen
npm run deploy

# Zugreifen
# → https://tazavesh.<your-subdomain>.workers.dev/chat
```

### Lokale Entwicklung

```bash
npm run dev
# → http://localhost:8787/chat
```

### Konfiguration

#### Benutzerdefinierten Modellanbieter hinzufügen

Bearbeiten Sie `src/models/router.ts`:

```typescript
{
  id: "my-provider",
  name: "My Custom API",
  baseUrl: "https://my-api.com/v1",
  model: "my-model",
  apiKey: env.MY_API_KEY,
  maxTokens: 4096,
}
```

#### Plattform-Kanäle aktivieren

| Variable | Plattform |
|----------|-----------|
| `TELEGRAM_BOT_TOKEN` | Telegram |
| `DISCORD_BOT_TOKEN` | Discord |
| `MATRIX_ACCESS_TOKEN` | Matrix |
| `FEISHU_APP_ID` + `FEISHU_APP_SECRET` | Feishu |
| `QQ_APP_ID` + `QQ_APP_SECRET` | QQ |

### Tech-Stack

| Schicht | Technologie |
|---------|------------|
| Laufzeit | Cloudflare Workers |
| Speicher | D1 (SQLite) + KV |
| Zustand | Durable Objects |
| Sprache | TypeScript |
| KI | OpenAI-kompatible API |
| Auth | HTTP-only Session Cookies |

### Roadmap

- [ ] Streaming-Antworten (SSE)
- [ ] Sprachnachrichten-Verarbeitung (Whisper-Integration)
- [ ] Bildgenerierung (DALL-E / Stable Diffusion)
- [ ] Datei-Upload und Analyse
- [ ] Geplante Aufgaben und Cron-Jobs
- [ ] Webhook-Ereignissystem
- [ ] Admin-Dashboard

### Lizenz

MIT

> *Ihr Agent. Ihre Daten. Ihre Infrastruktur. Immer online.*

---

<p align="center">
  <sub>Built with ☁️ by <a href="https://github.com/muskfeel">muskfeel</a></sub>
</p>
