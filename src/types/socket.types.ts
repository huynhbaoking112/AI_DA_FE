/**
 * Socket Types - Type definitions for Socket.IO events and payloads
 */

// ============================================
// Chat Events Payloads
// ============================================

/**
 * Payload for chat:message:started event
 * Emitted when a new chat message processing begins
 */
export interface ChatMessageStartedPayload {
  message_id: string;
  conversation_id: string;
}

/**
 * Payload for chat:message:token event
 * Emitted for each token during streaming response
 */
export interface ChatMessageTokenPayload {
  message_id: string;
  token: string;
}

/**
 * Payload for chat:message:tool_start event
 * Emitted when an AI tool execution begins
 */
export interface ChatMessageToolStartPayload {
  message_id: string;
  tool_name: string;
  tool_input: Record<string, unknown>;
}

/**
 * Payload for chat:message:tool_end event
 * Emitted when an AI tool execution completes
 */
export interface ChatMessageToolEndPayload {
  message_id: string;
  tool_name: string;
  tool_output: string;
}

/**
 * Payload for chat:message:completed event
 * Emitted when chat message processing completes successfully
 */
export interface ChatMessageCompletedPayload {
  message_id: string;
  content: string;
}

/**
 * Payload for chat:message:failed event
 * Emitted when chat message processing fails
 */
export interface ChatMessageFailedPayload {
  message_id: string;
  error: string;
}

// ============================================
// Sheet Sync Events Payloads
// ============================================

/**
 * Payload for sheet:sync:started event
 * Emitted when sheet synchronization begins
 */
export interface SheetSyncStartedPayload {
  connection_id: string;
}

/**
 * Payload for sheet:sync:completed event
 * Emitted when sheet synchronization completes successfully
 */
export interface SheetSyncCompletedPayload {
  connection_id: string;
  total_rows: number;
}

/**
 * Payload for sheet:sync:failed event
 * Emitted when sheet synchronization fails
 */
export interface SheetSyncFailedPayload {
  connection_id: string;
  error: string;
}

/**
 * Payload for sheet:sync:progress event
 * Emitted during sheet synchronization to report progress
 */
export interface SheetSyncProgressPayload {
  connection_id: string;
  progress: number;
}

// ============================================
// Socket Event Interfaces
// ============================================

/**
 * Server-to-client events interface
 * Defines all events the server can emit to the client
 */
export interface ServerToClientEvents {
  // Chat events
  'chat:message:started': (data: ChatMessageStartedPayload) => void;
  'chat:message:token': (data: ChatMessageTokenPayload) => void;
  'chat:message:tool_start': (data: ChatMessageToolStartPayload) => void;
  'chat:message:tool_end': (data: ChatMessageToolEndPayload) => void;
  'chat:message:completed': (data: ChatMessageCompletedPayload) => void;
  'chat:message:failed': (data: ChatMessageFailedPayload) => void;

  // Sheet sync events
  'sheet:sync:started': (data: SheetSyncStartedPayload) => void;
  'sheet:sync:completed': (data: SheetSyncCompletedPayload) => void;
  'sheet:sync:failed': (data: SheetSyncFailedPayload) => void;
  'sheet:sync:progress': (data: SheetSyncProgressPayload) => void;
}

/**
 * Client-to-server events interface
 * Reserved for future client-to-server events
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ClientToServerEvents {
  // Reserved for future client-to-server events
}
