export interface ChatMessage {
  id: string;
  text: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface ChatSession {
  id: string;
  roomNumber: string | null;
  startedAt: number;
  lastMessageAt: number;
  messages: ChatMessage[];
  status: 'active' | 'ended';
} 