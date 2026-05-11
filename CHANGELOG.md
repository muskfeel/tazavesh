# Changelog

All notable changes to Tazavesh will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-05-12

### 🚀 Initial Release

#### Core
- Cloudflare Workers deployment with Durable Objects
- D1 persistent memory system (conversation history, user profiles)
- OpenAI-compatible model router (MiMo, SiliconFlow, DeepSeek, OpenAI, Anthropic)
- Extensible skill/tool system
- User authentication (register/login with session cookies)

#### Channels
- Web Chat (built-in SPA with auth)
- Telegram Bot adapter
- Discord Bot adapter
- Matrix Bot adapter
- Feishu (飞书) adapter
- QQ adapter

#### Features
- Multi-turn conversation with context persistence
- Cross-session memory (agent remembers users across days)
- Tool detection and execution (calculator, web search, time, URL fetch)
- Per-user data isolation
- Rate limiting and abuse prevention

#### Infrastructure
- Cloudflare Workers free tier (100K req/day, 10GB D1)
- D1 database with auto-migration
- KV namespace for session caching
- Wrangler-based deployment

#### Documentation
- Trilingual README (中文 / English / Deutsch)
- Architecture diagrams
- Deployment guide
- Configuration reference
