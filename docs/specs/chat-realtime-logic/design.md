# Chat Realtime Logic (Frontend) - Design

## Overview

This document defines the architecture and interfaces for a **UI-agnostic frontend chat logic layer** that integrates:
- REST calls to send messages and fetch history
- Socket.IO events for streaming assistant updates
- Per-conversation state isolation, including **concurrent streaming across multiple conversations**

Non-goals:
- UI layout (sidebar, widgets, styling)
- Message rendering (markdown, code blocks, etc.)
- Conversation creation UX beyond setting `Active_Conversation_ID` after REST response

## Research Summary

Key findings that inform this design:
- Socket.IO guarantees **message ordering** for events that arrive, but provides **at most once** delivery by default (events can be lost during disconnect).  
  Reference: https://socket.io/docs/v4/delivery-guarantees
- Socket.IO server **does not store messages** by default, so the client must rely on application persistence and refetch strategies.  
  Reference: https://socket.io/docs/v4/faq/
- Socket.IO client supports sending credentials via the `auth` option and allows updating auth on `connect_error`.  
  Reference: https://socket.io/docs/v4/client-options/#auth
- TanStack Query supports atomic cache updates via `queryClient.setQueryData` and targeted invalidation via `queryClient.invalidateQueries`, which is the preferred approach over manual normalized cache maintenance.  
  Reference: https://tanstack.com/query/v5/docs/reference/QueryClient
  Reference: https://tanstack.com/query/v5/docs/react/guides/query-invalidation

Implication:
- The logic layer treats REST as the **source of truth** for message persistence.
- Realtime events update a per-conversation streaming draft and commit the final assistant message on `completed`.
- On failures/reconnect, the design uses **targeted invalidation/refetch** to recover.

## Architecture

```mermaid
flowchart LR
  UI[UI Components\n(not in scope)] -->|hooks + selectors| Logic[Chat_Feature_Logic]

  subgraph Logic[Chat_Feature_Logic]
    Store[Zustand Store\n(activeConversationId,\nstreamByConversationId,\nsendLocks)]
    Queries[TanStack Query\nconversations + messages]
    Runtime[Realtime Runtime\nSocket listeners]
    API[REST API Client]
  end

  Queries <-->|fetch/cache| API
  Runtime -->|events -> store updates| Store
  Runtime -->|commit final message| Queries
  UI -->|send/select actions| Store
  UI -->|send mutation| API
```

## Components and Interfaces

### 1) Feature API Client (`features/chat/api/chat.api.ts`)

Responsibilities:
- Wrap `apiClient` with chat-specific endpoints.
- Provide typed requests/responses.

Public interface:
```ts
export type SendMessageRequest = {
  content: string
  conversation_id?: string | null
}

export type SendMessageResponse = {
  user_message_id: string
  conversation_id: string
}

export type ConversationStatus = "active" | "archived"

export type ConversationSummary = {
  id: string
  title: string
  status: ConversationStatus
  message_count: number
  last_message_at: string | null
  created_at: string
  updated_at: string
}

export type ChatMessageRole = "user" | "assistant"

export type ChatMessage = {
  id: string
  role: ChatMessageRole
  content: string
  created_at: string
  is_complete: boolean
  metadata?: Record<string, unknown> | null
  attachments?: Array<Record<string, unknown>> | null
}

export const listConversations: (params: {
  skip?: number
  limit?: number
  status?: ConversationStatus
  search?: string
}) => Promise<{ items: ConversationSummary[]; total: number; skip: number; limit: number }>

export const getConversationMessages: (conversationId: string) => Promise<{
  conversation_id: string
  messages: ChatMessage[]
}>

export const sendMessage: (req: SendMessageRequest) => Promise<SendMessageResponse>
```

### 2) Store (`features/chat/stores/use-chat-store.ts`)

Responsibilities:
- Hold UI-agnostic chat state:
  - `Active_Conversation_ID` (nullable)
  - per-conversation streaming drafts
  - per-conversation send locks
  - per-conversation running tools list
- Provide deterministic actions (ideal for unit tests).

State model:
```ts
export type StreamStatus = "idle" | "streaming" | "failed"

export type ToolRun = {
  tool_call_id: string
  tool_name: string
  status: "running" | "done"
}

export type StreamState = {
  status: StreamStatus
  draftAssistantText: string
  runningTools: ToolRun[]
  lastError: string | null
  lastUpdatedAt: number
}

export type ChatStoreState = {
  activeConversationId: string | null
  // sendLocks cover both "existing conversation send" and
  // "new conversation send" while activeConversationId is null.
  sendLockByConversationId: Record<string, boolean>
  sendLockForNullConversation: boolean
  streamByConversationId: Record<string, StreamState>
}

export type ChatStoreActions = {
  setActiveConversationId: (conversationId: string | null) => void

  // Send locking
  lockSendForConversation: (conversationId: string) => void
  unlockSendForConversation: (conversationId: string) => void
  lockSendForNullConversation: () => void
  transferNullSendLockToConversation: (conversationId: string) => void

  // Stream updates (note: stream "starts" only when server emits started)
  ensureStreamState: (conversationId: string) => void
  markStreamStarted: (conversationId: string) => void
  appendToken: (conversationId: string, token: string) => void
  addToolStart: (conversationId: string, tool: { tool_call_id: string; tool_name: string }) => void
  markToolEnd: (conversationId: string, tool_call_id: string) => void
  finalizeCompleted: (conversationId: string, content: string) => void
  markFailed: (conversationId: string, error: string) => void
  clearFailure: (conversationId: string) => void
}
```

Behavioral notes:
- `Stream_State` SHALL NOT transition to `streaming` until `chat:message:started` is received.
- `Send_Lock` is set immediately on send initiation and cleared on `completed` or `failed`.
- Concurrent streaming is achieved by indexing all streaming state and send locks by `conversationId`.

### 3) Query hooks (`features/chat/hooks/use-chat-queries.ts`)

Responsibilities:
- Expose consistent query keys for:
  - conversations list
  - messages for a specific conversation
- Provide a send mutation that updates store and cache appropriately.

Interfaces:
```ts
export const conversationsKey = (params: {
  skip?: number
  limit?: number
  status?: ConversationStatus
  search?: string
}) => ["chat", "conversations", params] as const

export const messagesKey = (conversationId: string) =>
  ["chat", "messages", conversationId] as const

export const useConversationsQuery: (params: {
  skip?: number
  limit?: number
  status?: ConversationStatus
  search?: string
}) => unknown

export const useMessagesQuery: (conversationId: string | null) => unknown

export const useSendMessageMutation: () => unknown
```

Design constraints for `useMessagesQuery`:
- It uses `enabled: conversationId !== null` (Requirement 3.3).

Send mutation sequencing:
1) If `activeConversationId === null`:
   - lock `sendLockForNullConversation`
   - call REST `sendMessage({ content, conversation_id: null })`
   - on success: set `activeConversationId = returnedConversationId` and transfer lock to `sendLockByConversationId[returnedConversationId]=true`
2) Else:
   - lock `sendLockByConversationId[activeConversationId]=true`
   - call REST `sendMessage({ content, conversation_id: activeConversationId })`
3) Invalidate conversations list on success (Requirement 4.4).

### 4) Realtime runtime (`features/chat/hooks/use-chat-realtime-runtime.ts`)

Responsibilities:
- Subscribe to Socket.IO events once per app/session.
- Route events by `conversation_id` and update store + query cache.

Event contracts (must match backend payloads):
```ts
export type ChatMessageStartedEvent = { conversation_id: string }
export type ChatMessageTokenEvent = { conversation_id: string; token: string }
export type ChatMessageToolStartEvent = {
  conversation_id: string
  tool_name: string
  tool_call_id: string
}
export type ChatMessageToolEndEvent = {
  conversation_id: string
  tool_call_id: string
}
export type ChatMessageCompletedEvent = {
  conversation_id: string
  message_id: string
  content: string
  metadata?: unknown
}
export type ChatMessageFailedEvent = { conversation_id: string; error: string }
```

Routing rules:
- `started`:
  - ensure stream state exists
  - set stream status `streaming`
  - clear prior `draftAssistantText` and `runningTools` for that conversation (fresh response)
- `token`:
  - append to `draftAssistantText`
  - (design choice) ignore tokens for unknown conversation stream state to align with user requirement (“no token-before-start handling”)
- `tool_start`:
  - append to `runningTools` with status `running`
- `tool_end`:
  - mark matching tool run `done`
- `completed`:
  - commit assistant message to TanStack Query cache for that conversation
  - set stream status `idle`, clear draft and running tools
  - unlock send for that conversation
- `failed`:
  - set stream status `failed` and `lastError`
  - unlock send for that conversation

## Data Models

Canonical types used by the logic layer (feature-local, UI-agnostic):
```ts
type ConversationId = string

type StreamStatus = "idle" | "streaming" | "failed"

type ToolRun = {
  tool_call_id: string
  tool_name: string
  status: "running" | "done"
}

type StreamState = {
  status: StreamStatus
  draftAssistantText: string
  runningTools: ToolRun[]
  lastError: string | null
  lastUpdatedAt: number
}
```

## Acceptance Criteria Testing Prework

### 1.1 Expose nullable active conversation
**Thoughts:** Verify store initializes with `activeConversationId=null` and selector reflects null. Deterministic state invariant.
**Testable:** yes - example

### 1.2 Empty-state indicator when active is null
**Thoughts:** Derived selector (`hasActiveConversation`) should be false when `activeConversationId=null`.
**Testable:** yes - property

### 1.3 Selecting a conversation sets active id
**Thoughts:** Action should set active id for all valid ids.
**Testable:** yes - property

### 2.1 Conversations list fetch + cache
**Thoughts:** Integration behavior with TanStack Query; can be tested with query client + mocked fetch.
**Testable:** yes - example

### 2.2 Invalidate triggers refetch
**Thoughts:** Query invalidation behavior is integration-level; verify invalidate causes refetch when active.
**Testable:** yes - example

### 3.1 Fetch messages when active is set
**Thoughts:** Query enabled flag should be true for any non-null id; verify fetch invoked.
**Testable:** yes - property

### 3.2 Active changes triggers messages fetch for new id
**Thoughts:** Switching ids should change query key and trigger fetch.
**Testable:** yes - example

### 3.3 No messages fetch while active is null
**Thoughts:** Query must be disabled when id is null.
**Testable:** yes - property

### 4.1 Send with null active creates conversation id
**Thoughts:** Mutation calls REST with `conversation_id:null` and sets returned id as active.
**Testable:** yes - example

### 4.2 Send with non-null active uses active id
**Thoughts:** Mutation uses current active id for all sends.
**Testable:** yes - property

### 4.3 Set active to new id returned by API
**Thoughts:** For any send response, active id equals response conversation id.
**Testable:** yes - property

### 4.4 Invalidate conversations on send success
**Thoughts:** Ensure invalidate called after success.
**Testable:** yes - example

### 4.5 Surface error state on send failure
**Thoughts:** Error mapping to per-conversation state; verify lastError set and send lock not stuck.
**Testable:** yes - example

### 5.1 Set send lock on send initiation
**Thoughts:** For any send action, corresponding lock becomes true.
**Testable:** yes - property

### 5.2 While locked, sending disabled for that conversation
**Thoughts:** Derived boolean `isSendDisabled(conversationId)` depends on lock.
**Testable:** yes - property

### 5.3 Stream state becomes streaming on started event
**Thoughts:** Event-driven transition; verify status only changes on started.
**Testable:** yes - property

### 5.4 Unlock on completed
**Thoughts:** For any completed event, lock becomes false.
**Testable:** yes - property

### 5.5 Unlock on failed
**Thoughts:** For any failed event, lock becomes false.
**Testable:** yes - property

### 5.6 Temporary lock for null conversation transferred to returned id
**Thoughts:** Two-phase state transition; verify transfer semantics and no deadlock.
**Testable:** yes - example

### 6.1 Track independent state for multiple conversations
**Thoughts:** For any sequence of events keyed by conversation id, updates are isolated to that id.
**Testable:** yes - property

### 6.2 Allow send in B while A locked
**Thoughts:** Send disabled decision is per id; verify independence.
**Testable:** yes - property

### 7.1 Token appends to draft
**Thoughts:** For any token sequence after started, concatenation should match draft.
**Testable:** yes - property

### 7.2 Completed finalizes using completed content
**Thoughts:** Completed content is source of truth; verify commit uses completed payload.
**Testable:** yes - property

### 7.3 Failed preserves draft and surfaces error
**Thoughts:** Ensure draft not cleared on failed; error set.
**Testable:** yes - example

### 8.1 Tool start appends running tool entry
**Thoughts:** For any tool_start, entry added with `running` status.
**Testable:** yes - property

### 8.2 Tool end marks matching tool entry done
**Thoughts:** Match by tool_call_id; tool_name display comes from start entries.
**Testable:** yes - property

### 8.3 Expose running tools to UI per conversation
**Thoughts:** Selector returns list for requested id.
**Testable:** yes - example

### Property Reflection
- Many criteria are integration examples (queries + invalidation). Keep a small number of core properties for invariants:
  - per-conversation isolation
  - send lock lifecycle
  - stream transitions only on `started`
  - token aggregation + completed override
  - tool tracking by `tool_call_id`

## Correctness Properties

### Property 1: Per-Conversation Isolation
**Validates: Requirements 6.1, 6.2**

For all sequences of realtime events where each event includes a `conversation_id`, the Chat_Feature_Logic state updates MUST only affect `streamByConversationId[event.conversation_id]` and MUST NOT mutate stream state of any other conversation id.

### Property 2: Send Lock Is Per Conversation
**Validates: Requirements 5.1, 5.2, 6.2**

For all conversations A and B where A ≠ B, if `Send_Lock` is set for A, then `Send_Lock` for B MUST remain unchanged unless a send action or a completion/failure event for B occurs.

### Property 3: Stream Starts Only On Server `started`
**Validates: Requirements 5.3**

For all conversations, `Stream_State` MUST transition to `streaming` if and only if a `chat:message:started` event is observed for that conversation.

### Property 4: Token Aggregation Forms Draft Assistant Text
**Validates: Requirements 7.1**

For all conversations and all sequences of `chat:message:token` events observed after a `chat:message:started` event for that conversation, `Draft_Assistant_Text` MUST equal the concatenation of the received tokens in order.

### Property 5: Completed Content Is Source of Truth
**Validates: Requirements 7.2, 5.4**

For all conversations, when a `chat:message:completed` event is observed, the committed assistant message content MUST equal the `content` value of the completed event, and `Send_Lock` MUST be cleared for that conversation.

### Property 6: Tool Runs Are Tracked By `tool_call_id`
**Validates: Requirements 8.1, 8.2, 8.3**

For all conversations, for every `chat:message:tool_start` event with `tool_call_id = X`, `Running_Tools` MUST contain exactly one entry keyed by X with `tool_name` equal to the event tool name, and after the corresponding `chat:message:tool_end` event with `tool_call_id = X`, that entry MUST be marked `done`.

## Error Handling

- **Send REST failure**: set per-conversation error state and clear any temporary null-conversation lock.
- **Socket disconnect / reconnect**: because delivery is at-most-once and the server does not store messages by default, the logic should invalidate:
  - conversations list
  - messages for `Active_Conversation_ID` (if non-null)
- **Missing `started` event**: this design does not implement a client-side fallback for token-before-start; tokens for unknown stream state may be ignored. Recovery relies on final `completed` plus REST refetch.
- **Out-of-sync stream state**: on `completed` or `failed`, invalidate messages query for that conversation to reconcile with server persistence if needed.
- **Unauthorized socket**: existing socket client already logs out on `connect_error: Unauthorized`; chat runtime must tolerate socket being null/disconnected.

## Testing Strategy

### Unit tests (examples + edge cases)
- Store action tests (pure state transitions):
  - lock/unlock and null-lock transfer semantics
  - `started`/`completed`/`failed` transitions
  - tool start/end list updates by `tool_call_id`

### Property-based tests (minimum 100 iterations each)
Using a generator of event sequences:
- Property 1: per-conversation isolation
- Property 3: stream starts only on `started`
- Property 4: token aggregation equals concatenation (for sequences that include `started`)
- Property 6: tool tracking by `tool_call_id`

### Integration tests
With a mocked Socket.IO client and a TanStack QueryClient:
- Verify `completed` commits assistant message via `setQueryData`
- Verify `invalidateQueries` calls happen on send success and reconnect scenarios

