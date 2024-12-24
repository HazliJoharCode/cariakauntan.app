export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  error?: string;
  metadata?: {
    model?: string;
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
    };
  };
}

export interface ChatContext {
  availableAccountants: Array<{
    name: string;
    company: string;
    services: string[];
    phone: string;
  }>;
  userContext: {
    industry?: string;
    size?: string;
    problem?: string;
    location?: string;
  };
  previousMessages: ChatMessage[];
  userProfile?: any;
}