/**
 * Model Router - 统一模型路由
 * 
 * 所有模型使用 OpenAI 兼容格式
 * 支持 Fallback 机制
 */

import type { Env } from "../index";

export interface ModelProvider {
  name: string;
  baseURL: string;
  apiKey: string;
  models: string[];
  priority: number;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export class ModelRouter {
  private providers: Map<string, ModelProvider> = new Map();
  private env: Env;
  
  constructor(env: Env) {
    this.env = env;
    this.initProviders();
  }
  
  /**
   * 初始化模型提供商
   */
  private initProviders(): void {
    // MiMo (小米 Token Plan)
    if (this.env.MIMO_API_KEY) {
      this.providers.set("mimo", {
        name: "MiMo",
        baseURL: "https://token-plan-sgp.xiaomimimo.com/v1",
        apiKey: this.env.MIMO_API_KEY,
        models: ["mimo-v2.5-pro", "mimo-v2.5", "mimo-v2-flash"],
        priority: 1,
      });
    }
    
    // 硅基流动
    if (this.env.SILICON_API_KEY) {
      this.providers.set("silicon", {
        name: "SiliconFlow",
        baseURL: "https://api.siliconflow.cn/v1",
        apiKey: this.env.SILICON_API_KEY,
        models: ["Qwen/Qwen2.5-7B-Instruct", "THUDM/glm-4-9b-chat"],
        priority: 2,
      });
    }
    
    // DeepSeek
    if (this.env.DEEPSEEK_API_KEY) {
      this.providers.set("deepseek", {
        name: "DeepSeek",
        baseURL: "https://api.deepseek.com/v1",
        apiKey: this.env.DEEPSEEK_API_KEY,
        models: ["deepseek-chat", "deepseek-coder"],
        priority: 3,
      });
    }
    
    // 阿里百炼
    if (this.env.DASHSCOPE_API_KEY) {
      this.providers.set("dashscope", {
        name: "DashScope",
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        apiKey: this.env.DASHSCOPE_API_KEY,
        models: ["qwen-turbo", "qwen-plus", "qwen-max"],
        priority: 4,
      });
    }
  }
  
  /**
   * 根据模型名选择提供商
   */
  private selectProvider(model: string): ModelProvider | null {
    // 精确匹配
    for (const [_, provider] of this.providers) {
      if (provider.models.includes(model)) {
        return provider;
      }
    }
    
    // 按优先级返回第一个可用的提供商
    const sorted = Array.from(this.providers.values()).sort((a, b) => a.priority - b.priority);
    return sorted[0] || null;
  }
  
  /**
   * 聊天补全（OpenAI 兼容格式）
   */
  async chat(model: string, messages: ChatMessage[], options: ChatOptions = {}): Promise<string> {
    const provider = this.selectProvider(model);
    if (!provider) {
      throw new Error("No model provider available");
    }
    
    const actualModel = provider.models.includes(model) ? model : provider.models[0];
    
    try {
      const response = await fetch(`${provider.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({
          model: actualModel,
          messages,
          max_tokens: options.maxTokens || 4096,
          temperature: options.temperature || 0.7,
          stream: false,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json() as {
        choices: Array<{ message: { content: string } }>;
      };
      
      return data.choices[0]?.message?.content || "";
    } catch (error) {
      console.error(`Model ${model} failed, trying fallback...`, error);
      return this.fallbackChat(messages, options, model);
    }
  }
  
  /**
   * Fallback: 尝试其他提供商
   */
  private async fallbackChat(
    messages: ChatMessage[],
    options: ChatOptions,
    excludeModel: string
  ): Promise<string> {
    const sorted = Array.from(this.providers.values()).sort((a, b) => a.priority - b.priority);
    
    for (const provider of sorted) {
      const model = provider.models[0];
      if (provider.models.includes(excludeModel)) continue;
      
      try {
        const response = await fetch(`${provider.baseURL}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${provider.apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            max_tokens: options.maxTokens || 4096,
            temperature: options.temperature || 0.7,
            stream: false,
          }),
        });
        
        if (response.ok) {
          const data = await response.json() as {
            choices: Array<{ message: { content: string } }>;
          };
          return data.choices[0]?.message?.content || "";
        }
      } catch {
        continue;
      }
    }
    
    throw new Error("All model providers failed");
  }
  
  /**
   * 流式聊天（用于实时响应）
   */
  async *chatStream(
    model: string,
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): AsyncGenerator<string> {
    const provider = this.selectProvider(model);
    if (!provider) {
      throw new Error("No model provider available");
    }
    
    const actualModel = provider.models.includes(model) ? model : provider.models[0];
    
    const response = await fetch(`${provider.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model: actualModel,
        messages,
        max_tokens: options.maxTokens || 4096,
        temperature: options.temperature || 0.7,
        stream: true,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const reader = response.body?.getReader();
    if (!reader) return;
    
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter(line => line.startsWith("data: "));
      
      for (const line of lines) {
        const data = line.slice(6);
        if (data === "[DONE]") return;
        
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {
          continue;
        }
      }
    }
  }
}
