<p align="center">
  <h1 align="center">Tazavesh 🌀</h1>
  <p align="center"><b>Persistenter AI-Agent-Gateway · Immer Online · Immer Erinnernd · Universeller Zugang</b></p>
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

## Was ist Tazavesh

Tazavesh ist eine produktionsreife, plattformübergreifende AI-Agent-Plattform, die auf **Cloudflare Workers** aufgebaut ist.

**Einmal deployen, für immer bestehen.** Ihr Agent bleibt 24/7 online mit dauerhaftem Speicher, erweiterbaren Skills und nahtloser Multi-Channel-Konnektivität. Keine Server, kein DevOps, null Kosten zum Starten.

### Kernmerkmale

<table>
<tr><td><b>⚡ Immer Online</b></td><td>Läuft auf Cloudflares globalem Edge-Netzwerk. Keine Server zu warten. 24/7/365 Verfügbarkeit ohne DevOps-Aufwand.</td></tr>
<tr><td><b>🧠 Dauerhafter Speicher</b></td><td>Gesprächsverlauf, Benutzerpräferenzen und Kontext in D1 (Edge SQLite) gespeichert. Über Sitzungen, Tage und Monate hinweg — vergisst nie.</td></tr>
<tr><td><b>🔌 Universeller Modellzugang</b></td><td>Kompatibel mit jeder OpenAI-kompatiblen API. Empfohlen: Xiaomi MiMo. Unterstützt auch SiliconFlow, DeepSeek, OpenAI, Anthropic u.v.m.</td></tr>
<tr><td><b>🧩 Skill-System</b></td><td>Erweiterbare Skill-Registrierung und -Ausführung. Eingebaute Taschenrechner, Suche, Zeitabfragen. Eigene Tools sind eine Funktion entfernt.</td></tr>
<tr><td><b>🌐 Multi-Plattform</b></td><td>Web, Telegram, Discord, Matrix, Feishu, QQ — eine Codebasis, alle Kanäle.</td></tr>
<tr><td><b>🔐 Authentifizierung</b></td><td>Benutzer-Registrierung/Login, Sitzungs-Isolation, Rate-Limiting, Missbrauchsprävention.</td></tr>
<tr><td><b>☁️ Null Kosten</b></td><td>Cloudflare Workers Free Tier: 100K Anfragen/Tag, 10GB D1-Speicher — komplett kostenlos.</td></tr>
</table>

### 🚀 Live-Demo

**[👉 Tazavesh jetzt ausprobieren](https://tazavesh.agent-gateway.workers.dev/chat)**

Keine Installation erforderlich. Einfach besuchen und losschatten. Betrieben von Cloudflare Workers AI (Llama 3.1) — komplett kostenlos.

---

## ⭐ Empfohlen: Xiaomi MiMo

<table>
<tr>
<td width="120" align="center">
  <img src="https://img.shields.io/badge/Xiaomi-MiMo-FF6900?style=for-the-badge&logo=xiaomi&logoColor=white" alt="MiMo">
</td>
<td>
  <b>MiMo-V2.5-Pro</b> — Xiaomis Flaggschiff-Reasoning-Modell<br>
  ✅ Großzügiges Free Tier (beantragen Sie riesige Token-Guthaben)<br>
  ✅ Starke Reasoning-Fähigkeiten, niedrige Latenz<br>
  ✅ Vollständig kompatibel mit OpenAI API<br>
  ✅ Beantragen unter: <a href="https://100t.xiaomimimo.com">100t.xiaomimimo.com</a>
</td>
</tr>
</table>

> 💡 **Warum MiMo?** Xiaomi bietet Entwicklern großzügige kostenlose Token-Guthaben (100-Billionen-Token-Pool). MiMo-V2.5-Pro überzeugt bei Reasoning-Aufgaben mit null Integrationskosten — einfach den API-Key tauschen.

### Unterstützte Anbieter

| Anbieter | Modelle | Endpoint | Bewertung |
|----------|---------|----------|-----------|
| **Xiaomi MiMo** | MiMo-V2.5-Pro, MiMo-V2.5-Lite | `api.xiaomimimo.com` | ⭐⭐⭐⭐⭐ |
| **SiliconFlow** | DeepSeek-R1, Qwen3-235B, GLM-4 | `api.siliconflow.cn` | ⭐⭐⭐⭐ |
| **DeepSeek** | DeepSeek-V3, DeepSeek-R1 | `api.deepseek.com` | ⭐⭐⭐⭐ |
| **DashScope** | Qwen-Max, Qwen-Plus | `dashscope.aliyuncs.com` | ⭐⭐⭐⭐ |
| **OpenAI** | GPT-4o, GPT-4.1, o4-mini | `api.openai.com` | ⭐⭐⭐ |
| **Anthropic** | Claude Sonnet 4, Claude Opus 4 | `api.anthropic.com` | ⭐⭐⭐ |
| **Jeder OpenAI-kompatible** | Eigene Endpunkte | Ihre eigene URL | — |

---

## Architektur

### Systemdiagramm

```
┌─────────────────────────────────────────────────────────────┐
│              Benutzergeräte (Jede Plattform)                │
│  Web · Telegram · Discord · Matrix · Feishu · QQ           │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS / WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 Cloudflare Edge-Netzwerk                    │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Workers   │  │     D1      │  │     KV      │        │
│  │(Serverlos)  │  │(Edge SQLite)│  │(Schlüssel-  │        │
│  │  Global     │  │  Null-Latenz│  │  Wert-Cache)│        │
│  │  Auto-Scale │  │  Persistent │  │  Sitzung    │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                 │
│  ┌──────┴────────────────┴────────────────┴──────┐         │
│  │              Durable Objects                   │         │
│  │      (Zustandsbehaftete Agent-Instanzen)      │         │
│  │    WebSocket · Sitzungszustand · Parallelität  │         │
│  └───────────────────────────────────────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                KI-Modell-APIs (Jeder Anbieter)             │
│  MiMo · SiliconFlow · DeepSeek · OpenAI · Anthropic ...    │
└─────────────────────────────────────────────────────────────┘
```

### Kernmodule

| Modul | Datei | Aufgabe |
|-------|-------|---------|
| **Worker-Einstieg** | `src/index.ts` | Routing, Plattform-Dispatch |
| **Agent-Engine** | `src/core/agent.ts` | Agentic Loop, Modellaufrufe |
| **Durable Object** | `src/core/agent-core.ts` | Zustandsbehafter Agent |
| **Speichersystem** | `src/core/memory.ts` | D1 Gesprächsspeicher |
| **Skill-System** | `src/core/skills.ts` | Tool-Registrierung |
| **Auth-System** | `src/core/auth.ts` | Benutzer-Authentifizierung |
| **Modell-Router** | `src/models/router.ts` | Multi-Anbieter-Routing |
| **Chat-Protokoll** | `src/core/chat/` | Streaming, Nachrichtenaufbau |
| **Erweiterungen** | `src/core/extensions/` | Plugin-Architektur |

---

## Funktionen im Detail

### 🧠 Dauerhaftes Speichersystem

```
Benutzer: Ich heiße Hans, ich bevorzuge Python, ich arbeite im Finanzbereich
Agent: Hallo Hans! Python ist großartig für Finanzen — ich empfehle ccxt für Trading-APIs.
--- Drei Tage später ---
Agent: Natürlich Hans, ich schreibe dir einen BTC-Preis-Scraper mit Python + ccxt...
```

**Technische Umsetzung:**

- Gesprächsverlauf in D1 `messages` Tabelle, indiziert nach `conversation_id`
- Automatisches Kontext-Loading: letzte N Nachrichten werden in den LLM-Kontext injiziert
- `user_preferences` Tabelle speichert Benutzerprofile (Fakten-Extraktion + Präferenz-Tracking)
- Benutzer-Isolation: jeder Benutzer hat seine eigene `user_id` mit vollständig getrennten Daten

### 🔌 Universeller Modell-Router

Funktioniert mit **jeder OpenAI-kompatiblen API**. Einmal konfigurieren, jederzeit wechseln.

**Schnellstart (MiMo-Beispiel):**

```bash
npx wrangler secret put MIMO_API_KEY
# Geben Sie Ihren MiMo API-Key ein
```

**Benutzerdefinierten Anbieter hinzufügen:**

Bearbeiten Sie `src/models/router.ts`:

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

### 🧩 Erweiterbares Skill-System

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
├── 🔗 API-Connector   — Drittanbieter-Integrationen
└── 🤖 Auto-Antwort    — Automatisierte Antwortregeln
```

### 🌐 Multi-Plattform-Kanäle

| Plattform | Status | Funktionen | Konfiguration |
|-----------|--------|------------|---------------|
| **Web-Chat** | ✅ Eingebaut | Auth, Verlauf, responsive UI | Keine |
| **Telegram** | ✅ Bereit | Bot API, Inline-Keyboards, Medien | `TELEGRAM_BOT_TOKEN` |
| **Discord** | ✅ Bereit | Slash-Commands, Threads, Embeds | `DISCORD_BOT_TOKEN` |
| **Matrix** | ✅ Bereit | E2E-Verschlüsselung, Föderation | `MATRIX_ACCESS_TOKEN` |
| **Feishu** | ✅ Bereit | Cards, Rich Messages | `FEISHU_APP_ID` + `FEISHU_APP_SECRET` |
| **QQ** | ✅ Bereit | Gruppen-/Privatnachrichten | `QQ_APP_ID` + `QQ_APP_SECRET` |

---

## Schnellstart

### Voraussetzungen

- Node.js 18+
- Cloudflare-Konto (kostenlos)
- Mindestens ein OpenAI-kompatibler API-Key (empfohlen: Xiaomi MiMo)

### 1. Klonen

```bash
git clone https://github.com/muskfeel/tazavesh.git
cd tazavesh
npm install
```

### 2. Bei Cloudflare anmelden

```bash
npx wrangler login
```

### 3. D1-Datenbank erstellen

```bash
npx wrangler d1 create tazavesh-db
# Speichern Sie die database_id, aktualisieren Sie wrangler.jsonc
```

### 4. KV-Namespace erstellen

```bash
npx wrangler kv namespace create CACHE
# Speichern Sie die id, aktualisieren Sie wrangler.jsonc
```

### 5. Datenbank initialisieren

```bash
npx wrangler d1 execute tazavesh-db --file=schema.sql
```

### 6. API-Keys setzen

```bash
# Empfohlen: Xiaomi MiMo (großzügiges Free Tier)
npx wrangler secret put MIMO_API_KEY

# Optional: andere Anbieter
npx wrangler secret put SILICON_API_KEY
npx wrangler secret put DEEPSEEK_API_KEY
npx wrangler secret put OPENAI_API_KEY
```

### 7. Deployen

```bash
npm run deploy
# → https://tazavesh.<your-subdomain>.workers.dev/chat
```

### 8. Zugreifen

Deployment-URL öffnen → Registrieren → Anmelden → Loschatten!

---

## Lokale Entwicklung

```bash
npm run dev
# → http://localhost:8787/chat
```

Der lokale Modus verwendet Miniflare zur Simulation der Cloudflare-Umgebung. D1- und KV-Daten werden lokal gespeichert.

### Debug-Modus

```bash
npx wrangler dev --log-level debug
```

### Logs anzeigen

```bash
npx wrangler tail
```

---

## Konfigurationsreferenz

### Umgebungsvariablen / Secrets

| Variable | Erforderlich | Beschreibung |
|----------|-------------|-------------|
| `MIMO_API_KEY` | ✅ Empfohlen | Xiaomi MiMo API Key |
| `SILICON_API_KEY` | Optional | SiliconFlow API Key |
| `DEEPSEEK_API_KEY` | Optional | DeepSeek API Key |
| `OPENAI_API_KEY` | Optional | OpenAI API Key |
| `DASHSCOPE_API_KEY` | Optional | Alibaba DashScope API Key |
| `TELEGRAM_BOT_TOKEN` | Optional | Telegram Bot Token |
| `DISCORD_BOT_TOKEN` | Optional | Discord Bot Token |
| `MATRIX_ACCESS_TOKEN` | Optional | Matrix Access Token |
| `FEISHU_APP_ID` + `FEISHU_APP_SECRET` | Optional | Feishu Anmeldeinformationen |
| `QQ_APP_ID` + `QQ_APP_SECRET` | Optional | QQ Anmeldeinformationen |

---

## Projektstruktur

```
tazavesh/
├── src/
│   ├── index.ts                    # Worker-Einstiegspunkt
│   ├── core/
│   │   ├── agent.ts                # Agent-Engine (Agentic Loop)
│   │   ├── agent-core.ts           # Durable Object Agent
│   │   ├── memory.ts               # D1-Speichersystem
│   │   ├── skills.ts               # Skill-Registrierung
│   │   ├── auth.ts                 # Benutzer-Authentifizierung
│   │   ├── think.ts                # Reasoning-Engine
│   │   ├── workflows.ts            # Workflow-Engine
│   │   ├── schedule.ts             # Geplante Aufgaben
│   │   ├── chat/                   # Chat-Protokoll
│   │   └── extensions/             # Plugin-System
│   ├── channels/
│   │   ├── webchat.ts              # Web-UI (SPA + Auth)
│   │   ├── telegram.ts             # Telegram-Adapter
│   │   ├── discord.ts              # Discord-Adapter
│   │   ├── matrix.ts               # Matrix-Adapter
│   │   ├── feishu.ts               # Feishu-Adapter
│   │   └── qq.ts                   # QQ-Adapter
│   ├── models/
│   │   └── router.ts               # Multi-Modell-Routing
│   └── tools/
│       └── registry.ts             # Tool-Definitionen
├── wrangler.jsonc                   # CF Workers Konfiguration
├── schema.sql                      # D1-Datenbankschema
└── package.json
```

---

## Roadmap

- [ ] Streaming-Antworten (SSE)
- [ ] Sprachnachrichten-Verarbeitung (Whisper)
- [ ] Bildgenerierung (DALL-E / Stable Diffusion)
- [ ] Datei-Upload & Analyse
- [ ] Geplante Aufgaben & Cron-Jobs
- [ ] Webhook-Ereignissystem
- [ ] Admin-Dashboard
- [ ] Mehrsprachige Agenten (EN/CN/JP/KR)
- [ ] RAG-Wissensbasis-Integration
- [ ] MCP-Protokoll-Unterstützung

---

## Tech-Stack

| Schicht | Technologie |
|---------|------------|
| Laufzeit | Cloudflare Workers |
| Speicher | D1 (SQLite am Edge) + KV |
| Zustand | Durable Objects |
| Sprache | TypeScript |
| KI | OpenAI-kompatible API |
| Auth | HTTP-only Session Cookies |
| Build | Wrangler + esbuild |

---

## Lizenz

MIT

---

<p align="center">
  <sub>Ihr Agent. Ihre Daten. Ihre Infrastruktur. Immer online.</sub>
</p>
