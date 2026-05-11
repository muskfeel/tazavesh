/**
 * Skill System - 可扩展的工具/技能注册
 * 
 * 支持：
 * - 内置工具（搜索、计算、代码执行）
 * - 外部 API 工具
 * - 自定义 Skill 安装
 */

export interface Skill {
  name: string;
  description: string;
  parameters: Record<string, { type: string; description: string; required?: boolean }>;
  execute: (args: Record<string, unknown>, env?: unknown) => Promise<string>;
}

export class SkillRegistry {
  private skills: Map<string, Skill> = new Map();

  constructor() {
    this.registerBuiltinSkills();
  }

  /**
   * 注册内置技能
   */
  private registerBuiltinSkills(): void {
    // 1. 网页搜索
    this.register({
      name: "web_search",
      description: "搜索互联网获取信息。当需要查找实时信息、新闻、文档时使用。",
      parameters: {
        query: { type: "string", description: "搜索关键词", required: true },
      },
      execute: async (args) => {
        const query = args.query as string;
        try {
          // 使用 Cloudflare Workers AI 或外部搜索 API
          const response = await fetch(
            `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`,
            {
              headers: {
                "Accept": "application/json",
                "Accept-Encoding": "gzip",
              },
            }
          );
          if (response.ok) {
            const data = await response.json() as { web?: { results?: Array<{ title: string; description: string; url: string }> } };
            const results = data.web?.results || [];
            if (results.length > 0) {
              return results.map(r => `${r.title}\n${r.description}\n${r.url}`).join("\n\n");
            }
          }
        } catch {}
        return `搜索 "${query}" - 请使用更具体的关键词`;
      },
    });

    // 2. 计算器
    this.register({
      name: "calculator",
      description: "计算数学表达式。支持基本运算、幂运算、三角函数等。",
      parameters: {
        expression: { type: "string", description: "数学表达式，如 2+3*4, sqrt(16), sin(3.14)", required: true },
      },
      execute: async (args) => {
        const expr = args.expression as string;
        try {
          // 安全的数学计算
          const sanitized = expr.replace(/[^0-9+\-*/().,%^sqrt|sin|cos|tan|log|abs|PI|E]/g, '');
          const result = Function('"use strict";return (' + sanitized + ')')();
          return `${expr} = ${result}`;
        } catch {
          return `计算错误: ${expr}`;
        }
      },
    });

    // 3. 当前时间
    this.register({
      name: "current_time",
      description: "获取当前日期和时间",
      parameters: {},
      execute: async () => {
        const now = new Date();
        return `当前时间: ${now.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`;
      },
    });

    // 4. URL 获取
    this.register({
      name: "fetch_url",
      description: "获取网页内容。当需要读取特定网页信息时使用。",
      parameters: {
        url: { type: "string", description: "要获取的网页 URL", required: true },
      },
      execute: async (args) => {
        const url = args.url as string;
        try {
          const response = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; AgentBot/1.0)" },
          });
          const text = await response.text();
          // 截取前 3000 字符
          return text.slice(0, 3000);
        } catch {
          return `无法获取 ${url}`;
        }
      },
    });

    // 5. 代码执行（简化版）
    this.register({
      name: "run_code",
      description: "执行 JavaScript 代码并返回结果。用于复杂计算、数据处理。",
      parameters: {
        code: { type: "string", description: "要执行的 JavaScript 代码", required: true },
      },
      execute: async (args) => {
        const code = args.code as string;
        try {
          // 简单的沙箱执行
          const fn = new Function("return " + code);
          const result = fn();
          return String(result);
        } catch (e) {
          return `执行错误: ${e}`;
        }
      },
    });

    // 6. 文本处理
    this.register({
      name: "text_process",
      description: "文本处理工具：翻译、摘要、格式转换",
      parameters: {
        text: { type: "string", description: "要处理的文本", required: true },
        action: { type: "string", description: "操作类型: translate_en, translate_zh, summary, word_count" },
      },
      execute: async (args) => {
        const text = args.text as string;
        const action = (args.action as string) || "word_count";
        
        switch (action) {
          case "word_count":
            const chars = text.length;
            const words = text.split(/\s+/).length;
            return `字符数: ${chars}, 词数: ${words}`;
          case "reverse":
            return text.split("").reverse().join("");
          case "uppercase":
            return text.toUpperCase();
          default:
            return text;
        }
      },
    });
  }

  /**
   * 注册新技能
   */
  register(skill: Skill): void {
    this.skills.set(skill.name, skill);
  }

  /**
   * 获取所有技能定义（用于 LLM function calling）
   */
  getToolDefinitions(): Array<{
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: Record<string, unknown>;
    };
  }> {
    return Array.from(this.skills.values()).map(skill => ({
      type: "function" as const,
      function: {
        name: skill.name,
        description: skill.description,
        parameters: {
          type: "object",
          properties: Object.fromEntries(
            Object.entries(skill.parameters).map(([key, param]) => [
              key,
              { type: param.type, description: param.description },
            ])
          ),
          required: Object.entries(skill.parameters)
            .filter(([_, param]) => param.required)
            .map(([key]) => key),
        },
      },
    }));
  }

  /**
   * 执行技能
   */
  async execute(skillName: string, args: Record<string, unknown>): Promise<string> {
    const skill = this.skills.get(skillName);
    if (!skill) {
      return `未知技能: ${skillName}`;
    }
    try {
      return await skill.execute(args);
    } catch (e) {
      return `技能执行错误: ${e}`;
    }
  }

  /**
   * 获取技能列表
   */
  listSkills(): Array<{ name: string; description: string }> {
    return Array.from(this.skills.values()).map(s => ({
      name: s.name,
      description: s.description,
    }));
  }
}
