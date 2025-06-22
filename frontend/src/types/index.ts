export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export interface ChatResponse {
  reply: string;
}

export interface ErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}