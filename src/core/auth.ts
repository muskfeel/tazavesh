/**
 * Auth System - 注册/登录/会话管理
 * 
 * 简单的用户名+密码认证系统
 * 密码使用 SHA-256 哈希存储
 */

export interface User {
  id: string;
  username: string;
  password_hash: string;
  created_at: number;
}

export interface Session {
  token: string;
  user_id: string;
  username: string;
  expires_at: number;
}

export class AuthSystem {
  private db: D1Database;
  private sessionExpiry: number; // 7 days

  constructor(db: D1Database) {
    this.db = db;
    this.sessionExpiry = 7 * 24 * 60 * 60 * 1000;
  }

  /**
   * 初始化数据库表
   */
  async initialize(): Promise<void> {
    const stmts = [
      "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at INTEGER NOT NULL DEFAULT (unixepoch()))",
      "CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id TEXT NOT NULL, username TEXT NOT NULL, expires_at INTEGER NOT NULL)",
    ];
    for (const sql of stmts) {
      try { await this.db.prepare(sql).run(); } catch {}
    }
  }

  /**
   * SHA-256 哈希
   */
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "agent_gateway_salt_2026");
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * 注册
   */
  async register(username: string, password: string): Promise<{ success: boolean; error?: string; token?: string }> {
    await this.initialize();
    
    // 检查用户名是否已存在
    const existing = await this.db.prepare(
      "SELECT id FROM users WHERE username = ?"
    ).bind(username).first();
    
    if (existing) {
      return { success: false, error: "用户名已存在" };
    }
    
    // 验证输入
    if (!username || username.length < 3) {
      return { success: false, error: "用户名至少3个字符" };
    }
    if (!password || password.length < 6) {
      return { success: false, error: "密码至少6个字符" };
    }
    
    // 创建用户
    const id = `user:${Date.now()}:${Math.random().toString(36).slice(2)}`;
    const passwordHash = await this.hashPassword(password);
    
    await this.db.prepare(
      "INSERT INTO users (id, username, password_hash, created_at) VALUES (?, ?, ?, unixepoch())"
    ).bind(id, username, passwordHash).run();
    
    // 自动登录，创建会话
    const token = await this.createSession(id, username);
    
    return { success: true, token };
  }

  /**
   * 登录
   */
  async login(username: string, password: string): Promise<{ success: boolean; error?: string; token?: string }> {
    await this.initialize();
    
    // 查找用户
    const user = await this.db.prepare(
      "SELECT id, username, password_hash FROM users WHERE username = ?"
    ).bind(username).first() as User | null;
    
    if (!user) {
      return { success: false, error: "用户名或密码错误" };
    }
    
    // 验证密码
    const passwordHash = await this.hashPassword(password);
    if (user.password_hash !== passwordHash) {
      return { success: false, error: "用户名或密码错误" };
    }
    
    // 创建会话
    const token = await this.createSession(user.id, user.username);
    
    return { success: true, token };
  }

  /**
   * 创建会话
   */
  private async createSession(userId: string, username: string): Promise<string> {
    const token = `sess:${Date.now()}:${Math.random().toString(36).slice(2)}`;
    const expiresAt = Date.now() + this.sessionExpiry;
    
    await this.db.prepare(
      "INSERT INTO sessions (token, user_id, username, expires_at) VALUES (?, ?, ?, ?)"
    ).bind(token, userId, username, expiresAt).run();
    
    return token;
  }

  /**
   * 验证会话
   */
  async validateSession(token: string): Promise<Session | null> {
    if (!token) return null;
    
    const session = await this.db.prepare(
      "SELECT token, user_id, username, expires_at FROM sessions WHERE token = ?"
    ).bind(token).first() as Session | null;
    
    if (!session) return null;
    
    // 检查过期
    if (session.expires_at < Date.now()) {
      await this.db.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
      return null;
    }
    
    return session;
  }

  /**
   * 登出
   */
  async logout(token: string): Promise<void> {
    await this.db.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
  }
}
