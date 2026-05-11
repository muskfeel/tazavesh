# Tazavesh 🌀

**跨维度智慧枢纽** — 跨平台 AI Agent Gateway，运行在 Cloudflare Workers 上。

灵感来自《魔兽世界》中的 **塔扎维什 (Tazavesh)**：一个跨维度的隐藏市场，不同世界的商人们在此交汇、交易、互通有无。正如塔扎维什连接着无数维度，Tazavesh 连接着你的所有平台，让 AI Agent 在其中自由穿梭。

## ✨ Features

- 🌐 **多平台接入** — Telegram、Discord、Matrix、飞书、QQ、Web
- 🧠 **持久记忆** — D1 数据库存储对话历史，支持长期记忆
- 🔧 **工具系统** — 计算器、搜索、时间查询、网页抓取
- 📦 **Skill 系统** — 可扩展的技能注册与执行
- 🤖 **多模型路由** — MiMo、SiliconFlow、DeepSeek、DashScope
- 🔐 **用户认证** — 注册/登录，防止滥用
- ☁️ **免费部署** — Cloudflare Workers 免费套餐

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📦 Deploy

```bash
npm run deploy
```

## 🔑 Environment Variables

通过 `wrangler secret put` 或 `.dev.vars` 设置：

| 变量 | 必填 | 说明 |
|------|------|------|
| `MIMO_API_KEY` | ✅ | 小米 MiMo API Key |
| `SILICON_API_KEY` | 可选 | SiliconFlow API Key |
| `DEEPSEEK_API_KEY` | 可选 | DeepSeek API Key |
| `DASHSCOPE_API_KEY` | 可选 | 阿里通义千问 API Key |
| `TELEGRAM_BOT_TOKEN` | 可选 | Telegram Bot Token |
| `DISCORD_BOT_TOKEN` | 可选 | Discord Bot Token |
| `MATRIX_ACCESS_TOKEN` | 可选 | Matrix Access Token |
| `FEISHU_APP_ID` / `FEISHU_APP_SECRET` | 可选 | 飞书应用凭证 |
| `QQ_APP_ID` / `QQ_APP_SECRET` | 可选 | QQ 应用凭证 |

## 🏗️ Architecture

```
Tazavesh (CF Worker)
├── Web Chat (SPA + Auth)
├── Telegram Bot
├── Discord Bot
├── Matrix Bot
├── Feishu Bot
├── QQ Bot
└── Core
    ├── Agent (Agentic Loop)
    ├── Memory (D1)
    ├── Skills (Tool Registry)
    └── Auth (D1 + Sessions)
```

## 📂 Project Structure

```
src/
├── index.ts              # Worker 入口
├── core/
│   ├── agent.ts          # Agent 核心（记忆 + 工具调用）
│   ├── memory.ts         # D1 记忆系统
│   ├── skills.ts         # Skill/工具注册
│   ├── auth.ts           # 用户认证
│   ├── agent-core.ts     # Durable Object Agent
│   ├── think.ts          # 推理引擎
│   ├── workflows.ts      # 工作流
│   ├── schedule.ts       # 定时任务
│   └── chat/             # 聊天协议与工具
├── channels/
│   ├── webchat.ts        # Web 聊天界面
│   ├── telegram.ts       # Telegram 适配器
│   ├── discord.ts        # Discord 适配器
│   ├── matrix.ts         # Matrix 适配器
│   ├── feishu.ts         # 飞书适配器
│   └── qq.ts             # QQ 适配器
├── models/
│   └── router.ts         # 多模型路由
└── tools/
    └── registry.ts       # 工具注册
```

## 📜 License

MIT
