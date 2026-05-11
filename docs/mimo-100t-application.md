# MiMo 100T Token 申请材料

> 申请地址：https://100t.xiaomimimo.com
> 项目：Tazavesh — 持久化 AI Agent 网关

---

## 一、基本信息

| 字段 | 填写内容 |
|------|---------|
| **申请人类别** | 个人开发者 |
| **项目名称** | Tazavesh — Persistent AI Agent Gateway |
| **项目链接** | https://github.com/muskfeel/tazavesh |
| **在线演示** | https://tazavesh.agent-gateway.workers.dev/chat |

---

## 二、项目描述（中文，建议 300-500 字）

Tazavesh 是一个基于 Cloudflare Workers 构建的生产级、多平台 AI Agent 框架。项目目标是让每个人都能拥有一个永久在线、拥有持久记忆、可跨平台使用的智能助手。

**核心特性：**

1. **永久在线**：部署在 Cloudflare 全球边缘网络，无需服务器维护，24/7 可用，零运维成本。

2. **持久记忆**：基于 D1（边缘 SQLite）存储对话历史、用户偏好和上下文。Agent 能跨会话、跨天、跨月记住用户信息，实现真正的长期记忆。

3. **通用模型接入**：兼容任何 OpenAI 格式 API，支持在不同模型提供商之间无缝切换。计划将小米 MiMo-V2.5-Pro 作为核心推理模型，利用其强大的推理能力和免费 Token 额度。

4. **多平台覆盖**：一套代码支持 Web、Telegram、Discord、Matrix、飞书、QQ 六大平台，用户可以在任何地方与 Agent 对话。

5. **可扩展 Skill 系统**：内置计算器、搜索、时间查询等工具，支持自定义技能注册，让 Agent 具备执行实际任务的能力。

6. **用户认证**：完整的注册/登录系统，Session 隔离，速率限制，防止滥用。

**技术架构：**

- 运行时：Cloudflare Workers（TypeScript）
- 存储：D1（SQLite at Edge）+ KV（键值缓存）
- 状态：Durable Objects（有状态 Agent 实例）
- AI：OpenAI 兼容 API 格式

**使用场景：**

- 个人 AI 助手（跨平台记忆同步）
- 智能客服系统（多渠道接入）
- 开发者工具集成（代码辅助、信息检索）
- 团队协作助手（共享知识库）

**当前状态：**

项目已部署并在线运行，支持完整的对话、记忆、工具调用和用户认证功能。目前正在从 Cloudflare Workers AI（免费但能力有限）迁移到 MiMo-V2.5-Pro，以获得更强的推理能力和更好的中文支持。

---

## 三、项目描述（English）

Tazavesh is a production-grade, multi-platform AI agent framework built on Cloudflare Workers. It enables anyone to have a permanently online, memory-capable, cross-platform intelligent assistant.

**Key Features:**

1. **Always Online**: Deployed on Cloudflare's global edge network. Zero server maintenance, 24/7 availability, zero DevOps cost.

2. **Persistent Memory**: D1 (edge SQLite) stores conversation history, user preferences, and context. The agent remembers across sessions, days, and months.

3. **Universal Model Access**: Compatible with any OpenAI-format API. Seamless switching between providers. Planning to adopt Xiaomi MiMo-V2.5-Pro as the core reasoning model.

4. **Multi-Platform**: One codebase supports Web, Telegram, Discord, Matrix, Feishu, and QQ.

5. **Extensible Skill System**: Built-in tools (calculator, search, time) with custom skill registration.

6. **Authentication**: Full user registration/login, session isolation, rate limiting.

**Tech Stack**: TypeScript / Cloudflare Workers / D1 / Durable Objects / OpenAI-compatible API

**Status**: Deployed and running. Migrating from Cloudflare Workers AI to MiMo-V2.5-Pro for enhanced reasoning.

---

## 四、使用 MiMo 的计划

### 短期（1-3 个月）

| 目标 | 说明 |
|------|------|
| 核心模型替换 | 将默认模型从 Llama 3.1 切换为 MiMo-V2.5-Pro |
| 推理能力提升 | 利用 MiMo 的强推理能力处理复杂任务 |
| 中文优化 | MiMo 对中文的支持优于 Llama 系列 |

### 中期（3-6 个月）

| 目标 | 说明 |
|------|------|
| 多模型路由 | 根据任务复杂度自动选择 MiMo-V2.5-Pro 或 MiMo-V2.5-Lite |
| Function Calling | 利用 MiMo 的函数调用能力实现原生工具调用 |
| 流式响应 | 实现 SSE 流式输出，提升用户体验 |

### 长期（6-12 个月）

| 目标 | 说明 |
|------|------|
| RAG 集成 | 结合 MiMo 实现知识库问答 |
| 多模态支持 | 图片理解、语音交互 |
| 开源社区 | 推动 MiMo 生态发展 |

---

## 五、预估用量

| 指标 | 预估值 |
|------|--------|
| 日均 API 调用 | 5,000 - 10,000 次 |
| 平均每次 Token 消耗 | 输入 ~500 + 输出 ~800 |
| 日均 Token 消耗 | ~6.5M - 13M tokens |
| 月均 Token 消耗 | ~200M - 400M tokens |
| 主要使用场景 | 对话、推理、代码辅助 |

---

## 六、项目亮点

1. **零成本运行**：Cloudflare Workers 免费套餐 + MiMo 免费 Token = 完全免费的 AI Agent
2. **隐私优先**：数据存储在用户自己的 Cloudflare 账户，不经过第三方
3. **开箱即用**：一条命令部署，5 分钟上线
4. **多语言文档**：中/英/德三语 README，国际化友好
5. **开源 MIT**：完全开源，社区驱动

---

## 七、联系方式

| 渠道 | 信息 |
|------|------|
| GitHub | https://github.com/muskfeel |
| 项目仓库 | https://github.com/muskfeel/tazavesh |
| 演示地址 | https://tazavesh.agent-gateway.workers.dev/chat |

---

## 八、申请 CheckList

- [ ] 复制「项目描述（中文）」到申请表
- [ ] 填写基本信息
- [ ] 填写使用计划
- [ ] 填写预估用量
- [ ] 提交申请
- [ ] 等待 3 个工作日审核

---

> 💡 提示：填写表单时，内容越详细通过率和获得的额度越高。建议把上面的材料完整填写。
