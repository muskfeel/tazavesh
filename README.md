<p align="center">
  <h1 align="center">Tazavesh 🌀</h1>
  <p align="center"><b>持久化 AI Agent 网关 · 永久在线 · 永久记忆 · 通用接入</b></p>
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

## 什么是 Tazavesh

Tazavesh 是一个基于 **Cloudflare Workers** 构建的生产级、多平台 AI Agent 框架。

**一次部署，永久运行。** 您的 Agent 24/7 在线，拥有持久记忆、可扩展技能和无缝多通道连接。无需服务器，无需运维，零成本启动。

### 核心卖点

<table>
<tr><td><b>⚡ 永久在线</b></td><td>部署在 Cloudflare 全球边缘网络，无需服务器维护。Agent 24/7/365 可用，零 DevOps 开销。</td></tr>
<tr><td><b>🧠 持久记忆</b></td><td>对话历史、用户偏好、上下文全部存储在 D1（边缘 SQLite）。跨会话、跨天、跨月记忆，永不遗忘。</td></tr>
<tr><td><b>🔌 通用模型接入</b></td><td>兼容任何 OpenAI 格式 API。推荐小米 MiMo，也支持 SiliconFlow、DeepSeek、OpenAI、Anthropic 等。</td></tr>
<tr><td><b>🧩 Skill 系统</b></td><td>可扩展的技能注册与执行。内置计算器、搜索、时间查询，支持自定义工具。</td></tr>
<tr><td><b>🌐 全平台覆盖</b></td><td>Web、Telegram、Discord、Matrix、飞书、QQ — 一套代码，全渠道接入。</td></tr>
<tr><td><b>🔐 认证系统</b></td><td>用户注册/登录，Session 隔离，速率限制，防滥用。</td></tr>
<tr><td><b>☁️ 零成本启动</b></td><td>Cloudflare Workers 免费套餐：每天 100K 请求，10GB D1 存储，完全免费。</td></tr>
</table>

### 🚀 在线演示

**[👉 立即体验 Tazavesh](https://tazavesh.agent-gateway.workers.dev/chat)**

无需安装，直接访问即可对话。基于 Cloudflare Workers AI (Llama 3.1)，完全免费。

---

## ⭐ 推荐模型：小米 MiMo

<table>
<tr>
<td width="120" align="center">
  <img src="https://img.shields.io/badge/Xiaomi-MiMo-FF6900?style=for-the-badge&logo=xiaomi&logoColor=white" alt="MiMo">
</td>
<td>
  <b>MiMo-V2.5-Pro</b> — 小米自研旗舰推理模型<br>
  ✅ 免费额度慷慨（申请即送大量 Token）<br>
  ✅ 推理能力强，延迟低<br>
  ✅ 完全兼容 OpenAI API 格式<br>
  ✅ 申请地址：<a href="https://100t.xiaomimimo.com">100t.xiaomimimo.com</a>
</td>
</tr>
</table>

> 💡 **为什么推荐 MiMo？** 小米为开发者提供慷慨的免费 Token 额度（100万亿 Token 池），MiMo-V2.5-Pro 在推理任务上表现优异，且 API 完全兼容 OpenAI 格式，接入成本为零。

### 支持的模型提供商

| 提供商 | 模型 | 端点 | 推荐度 |
|--------|------|------|--------|
| **小米 MiMo** | MiMo-V2.5-Pro, MiMo-V2.5-Lite | `api.xiaomimimo.com` | ⭐⭐⭐⭐⭐ |
| **SiliconFlow** | DeepSeek-R1, Qwen3-235B, GLM-4 | `api.siliconflow.cn` | ⭐⭐⭐⭐ |
| **DeepSeek** | DeepSeek-V3, DeepSeek-R1 | `api.deepseek.com` | ⭐⭐⭐⭐ |
| **DashScope** | Qwen-Max, Qwen-Plus | `dashscope.aliyuncs.com` | ⭐⭐⭐⭐ |
| **OpenAI** | GPT-4o, GPT-4.1, o4-mini | `api.openai.com` | ⭐⭐⭐ |
| **Anthropic** | Claude Sonnet 4, Claude Opus 4 | `api.anthropic.com` | ⭐⭐⭐ |
| **任何 OpenAI 兼容** | 自定义端点 | 您自己的 URL | — |

---

## 技术架构

### 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    用户设备（任意平台）                       │
│  Web · Telegram · Discord · Matrix · 飞书 · QQ             │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS / WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Cloudflare 边缘网络                        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Workers   │  │     D1      │  │     KV      │        │
│  │  (无服务器) │  │ (边缘SQLite)│  │  (键值缓存) │        │
│  │  全球自动   │  │  零延迟读写 │  │  会话/配置  │        │
│  │  扩缩容     │  │  持久存储   │  │  高速缓存   │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                 │
│  ┌──────┴────────────────┴────────────────┴──────┐         │
│  │              Durable Objects                   │         │
│  │         （有状态 Agent 实例）                   │         │
│  │    WebSocket 支持 · 会话状态 · 并发控制         │         │
│  └───────────────────────────────────────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  AI 模型 API（任选其一）                     │
│  MiMo · SiliconFlow · DeepSeek · OpenAI · Anthropic ...    │
└─────────────────────────────────────────────────────────────┘
```

### 核心模块

| 模块 | 文件 | 职责 |
|------|------|------|
| **Worker 入口** | `src/index.ts` | 路由分发，平台适配 |
| **Agent 引擎** | `src/core/agent.ts` | Agentic Loop，模型调用，系统提示构建 |
| **Durable Object** | `src/core/agent-core.ts` | 有状态 Agent 实例，并发控制 |
| **记忆系统** | `src/core/memory.ts` | D1 对话存储，历史加载，用户画像提取 |
| **技能系统** | `src/core/skills.ts` | 工具注册，执行引擎，技能列表 |
| **认证系统** | `src/core/auth.ts` | 用户注册/登录，Session 管理 |
| **模型路由** | `src/models/router.ts` | 多提供商切换，负载均衡 |
| **聊天协议** | `src/core/chat/` | 流式响应，消息构建，工具状态 |
| **扩展系统** | `src/core/extensions/` | 插件架构，钩子代理 |

### 数据流

```
用户消息 → 平台适配器 → Agent 引擎
  ├── 加载记忆（D1 历史查询）
  ├── 构建上下文（系统提示 + 历史 + 用户画像）
  ├── 检测工具调用（关键词匹配 / LLM function calling）
  │   ├── Calculator → 数学计算
  │   ├── Web Search → 搜索结果
  │   └── Fetch URL → 网页内容
  ├── 调用模型 API（OpenAI 兼容格式）
  ├── 保存响应（D1 写入）
  └── 返回用户（原平台）
```

---

## 功能详解

### 🧠 持久记忆系统

```
用户：我叫张三，我喜欢用 Python，我在做量化交易
Agent：你好张三！Python 做量化交易很棒，推荐你用 ccxt 库。
--- 三天后 ---
用户：帮我写个抓取 BTC 行情的脚本
Agent：好的张三，我帮你用 Python + ccxt 写一个 BTC 行情抓取脚本...
```

**技术实现：**

- 对话历史存储在 D1 `messages` 表，按 `conversation_id` 索引
- 每次对话自动加载最近 N 条历史，注入 LLM 上下文
- `user_preferences` 表存储用户画像（事实提取 + 偏好记录）
- 每个用户独立 `user_id`，数据完全隔离

**数据库 Schema：**

```sql
-- 对话与消息
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  created_at DATETIME
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id TEXT,
  role TEXT,          -- system | user | assistant
  content TEXT,
  created_at DATETIME
);

-- 用户系统
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  password_hash TEXT,
  created_at DATETIME
);

CREATE TABLE sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT,
  expires_at DATETIME
);

-- 用户画像
CREATE TABLE user_preferences (
  user_id TEXT PRIMARY KEY,
  facts TEXT,         -- JSON 格式的用户事实
  updated_at DATETIME
);
```

### 🔌 通用模型路由器

兼容**任何 OpenAI 兼容 API**，配置一次，随时切换。

**接入方式（以 MiMo 为例）：**

```bash
# 设置 API Key（通过 Cloudflare Secret）
wrangler secret put MIMO_API_KEY
# 输入你的 MiMo API Key
```

**添加自定义提供商：**

编辑 `src/models/router.ts`：

```typescript
// 在 models 数组中添加新提供商
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

**模型调用方式：**

所有模型均使用 OpenAI Chat Completions 格式：

```typescript
const response = await fetch(`${baseUrl}/chat/completions`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: modelName,
    messages: chatMessages,
    max_tokens: 4096,
    temperature: 0.7,
  }),
});
```

### 🧩 可扩展技能系统

注册自定义工具，让 Agent 在对话中自动调用：

```
内置技能：
├── 🔢 Calculator      — 数学表达式计算
├── ⏰ Current Time    — 时区感知的日期时间
├── 🔍 Web Search      — 互联网搜索
├── 🌐 Fetch URL       — 网页内容抓取
├── 💻 Code Execution  — 沙箱代码运行器
└── 📝 Text Processing — 字符串操作

自定义技能示例：
├── 📊 Data Analysis   — 您的数据管道
├── 🗄️ Database Query  — 直接 D1 接口
├── 🔗 API Connector   — 第三方 API 集成
└── 🤖 Auto Reply      — 自动回复规则
```

**注册新技能：**

```typescript
// src/core/skills.ts
this.registerSkill({
  name: "my_skill",
  description: "我的自定义技能",
  execute: async (params) => {
    // 实现逻辑
    return "执行结果";
  },
});
```

### 🌐 多平台通道

| 平台 | 状态 | 功能 | 配置变量 |
|------|------|------|----------|
| **Web 聊天** | ✅ 内置 | 认证、聊天记录、响应式 UI | 无需配置 |
| **Telegram** | ✅ 就绪 | Bot API、内联键盘、媒体 | `TELEGRAM_BOT_TOKEN` |
| **Discord** | ✅ 就绪 | 斜杠命令、线程、嵌入 | `DISCORD_BOT_TOKEN` |
| **Matrix** | ✅ 就绪 | 端到端加密、联邦 | `MATRIX_ACCESS_TOKEN` |
| **飞书** | ✅ 就绪 | 卡片、富文本消息 | `FEISHU_APP_ID` + `FEISHU_APP_SECRET` |
| **QQ** | ✅ 就绪 | 群聊/私聊 | `QQ_APP_ID` + `QQ_APP_SECRET` |

### 🔐 认证与访问控制

- 用户注册和登录系统（D1 存储）
- 基于 Session 的 HTTP-only Cookie 认证
- 用户级对话隔离（每个用户独立记忆空间）
- 速率限制与滥用防护

---

## 快速开始

### 前置条件

- Node.js 18+
- Cloudflare 账户（免费）
- 至少一个 OpenAI 兼容 API Key（推荐小米 MiMo）

### 1. 克隆项目

```bash
git clone https://github.com/muskfeel/tazavesh.git
cd tazavesh
npm install
```

### 2. 登录 Cloudflare

```bash
npx wrangler login
```

### 3. 创建 D1 数据库

```bash
npx wrangler d1 create tazavesh-db
# 记下输出的 database_id，更新到 wrangler.jsonc
```

### 4. 创建 KV 命名空间

```bash
npx wrangler kv namespace create CACHE
# 记下输出的 id，更新到 wrangler.jsonc
```

### 5. 初始化数据库

```bash
npx wrangler d1 execute tazavesh-db --file=schema.sql
```

### 6. 设置 API Key

```bash
# 推荐：小米 MiMo（免费额度慷慨）
npx wrangler secret put MIMO_API_KEY

# 可选：其他提供商
npx wrangler secret put SILICON_API_KEY
npx wrangler secret put DEEPSEEK_API_KEY
npx wrangler secret put OPENAI_API_KEY
```

### 7. 部署

```bash
npm run deploy
# → https://tazavesh.<your-subdomain>.workers.dev/chat
```

### 8. 访问

打开部署地址 → 注册账号 → 登录 → 开始对话！

---

## 本地开发

```bash
npm run dev
# → http://localhost:8787/chat
```

本地开发模式使用 Miniflare 模拟 Cloudflare 环境，D1 和 KV 数据存储在本地。

### 调试模式

```bash
npx wrangler dev --log-level debug
```

### 查看日志

```bash
npx wrangler tail
```

---

## 配置参考

### wrangler.jsonc

```jsonc
{
  "name": "tazavesh",
  "main": "src/index.ts",
  "compatibility_date": "2026-01-28",
  "compatibility_flags": ["nodejs_compat"],

  "durable_objects": {
    "bindings": [{ "name": "AGENT", "class_name": "AgentDO" }]
  },

  "migrations": [{
    "tag": "v1",
    "new_sqlite_classes": ["AgentDO"]
  }],

  "kv_namespaces": [{
    "binding": "KV",
    "id": "your-kv-namespace-id"
  }],

  "d1_databases": [{
    "binding": "DB",
    "database_name": "tazavesh-db",
    "database_id": "your-d1-database-id"
  }],

  "ai": { "binding": "AI" },

  "vars": { "ENVIRONMENT": "production" }
}
```

### 环境变量 / Secrets

| 变量 | 必填 | 说明 |
|------|------|------|
| `MIMO_API_KEY` | ✅ 推荐 | 小米 MiMo API Key |
| `SILICON_API_KEY` | 可选 | SiliconFlow API Key |
| `DEEPSEEK_API_KEY` | 可选 | DeepSeek API Key |
| `OPENAI_API_KEY` | 可选 | OpenAI API Key |
| `DASHSCOPE_API_KEY` | 可选 | 阿里通义千问 API Key |
| `TELEGRAM_BOT_TOKEN` | 可选 | Telegram Bot Token |
| `DISCORD_BOT_TOKEN` | 可选 | Discord Bot Token |
| `MATRIX_ACCESS_TOKEN` | 可选 | Matrix Access Token |
| `FEISHU_APP_ID` + `FEISHU_APP_SECRET` | 可选 | 飞书应用凭证 |
| `QQ_APP_ID` + `QQ_APP_SECRET` | 可选 | QQ 应用凭证 |

---

## 项目结构

```
tazavesh/
├── src/
│   ├── index.ts                    # Worker 入口，路由分发
│   ├── core/
│   │   ├── agent.ts                # Agent 引擎（Agentic Loop）
│   │   ├── agent-core.ts           # Durable Object 有状态 Agent
│   │   ├── memory.ts               # D1 记忆系统
│   │   ├── skills.ts               # Skill 注册与执行
│   │   ├── auth.ts                 # 用户认证
│   │   ├── think.ts                # 推理引擎
│   │   ├── workflows.ts            # 工作流引擎
│   │   ├── schedule.ts             # 定时任务
│   │   ├── types.ts                # 类型定义
│   │   ├── utils.ts                # 工具函数
│   │   ├── chat/                   # 聊天协议
│   │   │   ├── index.ts            # 聊天主入口
│   │   │   ├── protocol.ts         # 消息协议
│   │   │   ├── lifecycle.ts        # 生命周期管理
│   │   │   ├── message-builder.ts  # 消息构建
│   │   │   ├── stream-accumulator.ts # 流式累积
│   │   │   ├── tool-state.ts       # 工具状态
│   │   │   └── ...
│   │   └── extensions/             # 扩展系统
│   │       ├── index.ts            # 扩展入口
│   │       ├── manager.ts          # 扩展管理器
│   │       ├── types.ts            # 扩展类型
│   │       ├── host-bridge.ts      # 主机桥接
│   │       └── hook-proxy.ts       # 钩子代理
│   ├── channels/
│   │   ├── webchat.ts              # Web 聊天（SPA + 认证）
│   │   ├── telegram.ts             # Telegram 适配器
│   │   ├── discord.ts              # Discord 适配器
│   │   ├── matrix.ts               # Matrix 适配器
│   │   ├── feishu.ts               # 飞书适配器
│   │   └── qq.ts                   # QQ 适配器
│   ├── models/
│   │   └── router.ts               # 多模型路由
│   └── tools/
│       └── registry.ts             # 工具注册
├── wrangler.jsonc                   # Cloudflare Workers 配置
├── schema.sql                      # D1 数据库 Schema
├── package.json
├── tsconfig.json
├── README.md                       # 中文文档（默认）
├── README_EN.md                    # English 文档
└── README_DE.md                    # Deutsch 文档
```

---

## 路线图

- [ ] 流式响应支持 (SSE)
- [ ] 语音消息处理 (Whisper 集成)
- [ ] 图片生成工具 (DALL-E / Stable Diffusion)
- [ ] 文件上传与分析
- [ ] 定时任务与 Cron 调度
- [ ] Webhook 事件系统
- [ ] 管理后台 Dashboard
- [ ] 多语言 Agent（中/英/日/韩）
- [ ] RAG 知识库集成
- [ ] MCP 协议支持

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 运行时 | Cloudflare Workers |
| 存储 | D1 (SQLite at Edge) + KV |
| 状态 | Durable Objects |
| 语言 | TypeScript |
| AI | OpenAI 兼容 API |
| 认证 | HTTP-only Session Cookies |
| 构建 | Wrangler + esbuild |

---

## 许可证

MIT

---

<p align="center">
  <sub>您的 Agent。您的数据。您的基础设施。永久在线。</sub>
</p>
