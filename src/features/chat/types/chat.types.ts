/**
 * Chat Feature REST Types
 * Based on chat-realtime-logic spec design.
 */

export type ConversationStatus = 'active' | 'archived';

export interface ConversationSummary {
  id: string;
  title: string;
  status: ConversationStatus;
  message_count: number;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ChatMessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  created_at: string;
  is_complete: boolean;
  metadata?: Record<string, unknown> | null;
  attachments?: Array<Record<string, unknown>> | null;
}

export interface SendMessageRequest {
  content: string;
  conversation_id?: string | null;
}

export interface SendMessageResponse {
  user_message_id: string;
  conversation_id: string;
}

export interface ListConversationsParams {
  skip?: number;
  limit?: number;
  status?: ConversationStatus;
  search?: string;
}

export interface ListConversationsResponse {
  items: ConversationSummary[];
  total: number;
  skip: number;
  limit: number;
}

export interface GetConversationMessagesResponse {
  conversation_id: string;
  messages: ChatMessage[];
}
