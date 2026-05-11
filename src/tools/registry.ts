/**
 * Tools Registry - 工具注册表
 */
export interface Tool {
  name: string;
  description: string;
  execute: (args: Record<string, unknown>) => Promise<string>;
}

export function createTools(): Record<string, Tool> {
  return {
    web_search: {
      name: "web_search",
      description: "Search the web for information",
      execute: async (args) => {
        const query = args.query as string;
        // Placeholder - implement actual search
        return `Search results for: ${query}`;
      },
    },
    calculator: {
      name: "calculator",
      description: "Calculate a math expression",
      execute: async (args) => {
        const expr = args.expression as string;
        try {
          // Safe eval for math only
          const result = Function("'use strict';return (" + expr + ")")();
          return String(result);
        } catch {
          return "Error: Invalid expression";
        }
      },
    },
  };
}
