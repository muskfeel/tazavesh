/**
 * Memory System - D1-backed conversation memory
 * 
 * Based on Cloudflare Agents SDK patterns:
 * - Conversation history with token counting
 * - Context window management (truncation + summarization)
 * - User preferences (long-term memory)
 * - User facts (extracted knowledge)
 */

export interface MemoryMessage {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  token_count: number;
  created_at: number;
}

export interface ConversationSummary {
  id: string;
  summary: string;
  message_range_start: string;
  message_range_end: string;
  token_count: number;
}

export class MemorySystem {
  private db: D1Database;
  private maxContextTokens: number;
  private maxRecentMessages: number;

  constructor(db: D1Database, options?: { maxContextTokens?: number; maxRecentMessages?: number }) {
    this.db = db;
    this.maxContextTokens = options?.maxContextTokens || 8000;
    this.maxRecentMessages = options?.maxRecentMessages || 50;
  }

  /**
   * 初始化数据库表
   */
  async initialize(): Promise<void> {
    const stmts = [
      "CREATE TABLE IF NOT EXISTS conversations (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT, created_at INTEGER NOT NULL DEFAULT (unixepoch()), updated_at INTEGER NOT NULL DEFAULT (unixepoch()))",
      "CREATE INDEX IF NOT EXISTS idx_conv_user ON conversations(user_id)",
      "CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL, role TEXT NOT NULL, content TEXT NOT NULL, token_count INTEGER DEFAULT 0, created_at INTEGER NOT NULL DEFAULT (unixepoch()))",
      "CREATE INDEX IF NOT EXISTS idx_msg_conv ON messages(conversation_id, created_at)",
      "CREATE TABLE IF NOT EXISTS summaries (id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL, summary TEXT NOT NULL, message_range_start TEXT, message_range_end TEXT, token_count INTEGER DEFAULT 0, created_at INTEGER NOT NULL DEFAULT (unixepoch()))",
      "CREATE TABLE IF NOT EXISTS user_preferences (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL, updated_at INTEGER NOT NULL DEFAULT (unixepoch()))",
      "CREATE UNIQUE INDEX IF NOT EXISTS idx_pref_key ON user_preferences(user_id, key)",
      "CREATE TABLE IF NOT EXISTS user_facts (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, fact TEXT NOT NULL, confidence REAL DEFAULT 1.0, source TEXT, created_at INTEGER NOT NULL DEFAULT (unixepoch()))",
    ];
    for (const sql of stmts) {
      try { await this.db.prepare(sql).run(); } catch {}
    }

  }

  /**
   * 简单 token 计数（近似值）
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 3); // 中文约 3 字符 1 token
  }

  /**
   * 获取或创建会话
   */
  async getOrCreateConversation(userId: string, conversationId?: string): Promise<string> {
    // If specific conversation requested, use it
    if (conversationId) {
      const existing = await this.db.prepare(
        "SELECT id FROM conversations WHERE id = ?"
      ).bind(conversationId).first();
      if (existing) return conversationId;
    }
    
    // Find most recent conversation for this user
    const recent = await this.db.prepare(
      "SELECT id FROM conversations WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1"
    ).bind(userId).first();
    
    if (recent) return recent.id as string;
    
    // Create new conversation
    const newId = `conv:${userId}:${Date.now()}`;
    await this.db.prepare(
      "INSERT INTO conversations (id, user_id, created_at, updated_at) VALUES (?, ?, unixepoch(), unixepoch())"
    ).bind(newId, userId).run();
    return newId;
  }

  /**
   * 添加消息到会话
   */
  async addMessage(
    conversationId: string,
    role: "user" | "assistant" | "system",
    content: string
  ): Promise<MemoryMessage> {
    const id = `msg:${Date.now()}:${Math.random().toString(36).slice(2)}`;
    const tokenCount = this.estimateTokens(content);
    
    await this.db.prepare(
      "INSERT INTO messages (id, conversation_id, role, content, token_count, created_at) VALUES (?, ?, ?, ?, ?, unixepoch())"
    ).bind(id, conversationId, role, content, tokenCount).run();
    
    // 更新会话时间
    await this.db.prepare(
      "UPDATE conversations SET updated_at = unixepoch() WHERE id = ?"
    ).bind(conversationId).run();
    
    return { id, role, content, token_count: tokenCount, created_at: Date.now() };
  }

  /**
   * 获取会话历史（带上下文管理）
   */
  async getConversationHistory(conversationId: string): Promise<MemoryMessage[]> {
    // 获取所有消息
    const allMessages = await this.db.prepare(
      "SELECT id, role, content, token_count, created_at FROM messages WHERE conversation_id = ? ORDER BY created_at ASC"
    ).bind(conversationId).all();
    
    const messages = allMessages.results as unknown as MemoryMessage[];
    
    // 获取摘要
    const summaries = await this.db.prepare(
      "SELECT summary, token_count FROM summaries WHERE conversation_id = ? ORDER BY created_at ASC"
    ).bind(conversationId).all();
    
    let totalTokens = 0;
    const result: MemoryMessage[] = [];
    
    // 先加摘要
    for (const s of summaries.results) {
      totalTokens += (s.token_count as number) || 0;
      result.push({
        id: "summary",
        role: "system",
        content: `[之前的对话摘要]\n${s.summary}`,
        token_count: s.token_count as number,
        created_at: 0,
      });
    }
    
    // 然后加最近的消息（倒序取，保证最新的在）
    const recentMessages = messages.slice(-this.maxRecentMessages);
    for (const msg of recentMessages) {
      totalTokens += msg.token_count;
      result.push(msg);
    }
    
    // 如果超过 token 限制，截断旧消息
    while (totalTokens > this.maxContextTokens && result.length > 1) {
      const removed = result.shift();
      if (removed) totalTokens -= removed.token_count;
    }
    
    return result;
  }

  /**
   * 保存摘要
   */
  async saveSummary(
    conversationId: string,
    summary: string,
    messageRangeStart: string,
    messageRangeEnd: string
  ): Promise<void> {
    const id = `sum:${Date.now()}`;
    const tokenCount = this.estimateTokens(summary);
    
    await this.db.prepare(
      "INSERT INTO summaries (id, conversation_id, summary, message_range_start, message_range_end, token_count) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(id, conversationId, summary, messageRangeStart, messageRangeEnd, tokenCount).run();
  }

  /**
   * 设置用户偏好
   */
  async setPreference(userId: string, key: string, value: string): Promise<void> {
    const id = `pref:${userId}:${key}`;
    await this.db.prepare(
      "INSERT OR REPLACE INTO user_preferences (id, user_id, key, value, updated_at) VALUES (?, ?, ?, ?, unixepoch())"
    ).bind(id, userId, key, value).run();
  }

  /**
   * 获取用户偏好
   */
  async getPreference(userId: string, key: string): Promise<string | null> {
    const result = await this.db.prepare(
      "SELECT value FROM user_preferences WHERE user_id = ? AND key = ?"
    ).bind(userId, key).first();
    return result?.value as string || null;
  }

  /**
   * 添加用户事实
   */
  async addUserFact(userId: string, fact: string, confidence: number = 1.0): Promise<void> {
    const id = `fact:${Date.now()}:${Math.random().toString(36).slice(2)}`;
    await this.db.prepare(
      "INSERT INTO user_facts (id, user_id, fact, confidence, created_at) VALUES (?, ?, ?, ?, unixepoch())"
    ).bind(id, userId, fact, confidence).run();
  }

  /**
   * 获取用户所有事实
   */
  async getUserFacts(userId: string): Promise<string[]> {
    const results = await this.db.prepare(
      "SELECT fact FROM user_facts WHERE user_id = ? ORDER BY confidence DESC LIMIT 20"
    ).bind(userId).all();
    return results.results.map(r => r.fact as string);
  }
}
