/**
 * Chat Feature Realtime Event Types
 * Based on chat-realtime-logic spec design.
 */

export interface ChatMessageStartedEvent {
  conversation_id: string;
}

export interface ChatMessageTokenEvent {
  conversation_id: string;
  token: string;
}

export interface ChatMessageToolStartEvent {
  conversation_id: string;
  tool_name: string;
  tool_call_id: string;
}

export interface ChatMessageToolEndEvent {
  conversation_id: string;
  tool_call_id: string;
}

export interface ChatMessageCompletedEvent {
  conversation_id: string;
  message_id: string;
  content: string;
  metadata?: unknown;
}

export interface ChatMessageFailedEvent {
  conversation_id: string;
  error: string;
}
