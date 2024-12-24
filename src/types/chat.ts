import { Accountant } from '@/data/accountants';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface BusinessContext {
  industry?: string;
  size?: string;
  problem?: string;
  location?: string;
}

export interface ChatContext {
  availableAccountants: Accountant[];
  userContext: BusinessContext;
  previousMessages: Message[];
  userProfile?: any;
}