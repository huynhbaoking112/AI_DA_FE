# Chat Realtime Logic (Frontend) - Tasks

- [x] 1. Create chat feature module scaffolding
  - [x] 1.1 Add feature folder structure under `src/features/chat/`
    - References Requirements 1.1, 2.1, 3.1
    - Create `api/`, `hooks/`, `stores/`, `types/`, `index.ts`
  - [x] 1.2 Define feature-local REST and realtime types
    - References Requirements 1.1, 2.1, 3.1, 7.1, 8.1
    - Create `src/features/chat/types/chat.types.ts` and `src/features/chat/types/chat.realtime.ts`

- [ ] 2. Implement REST API client for chat
  - [ ] 2.1 Implement `src/features/chat/api/chat.api.ts` using `src/lib/api-client.ts`
    - References Requirements 2.1, 3.1, 4.1, 4.2
    - Export `listConversations`, `getConversationMessages`, `sendMessage`
  - [ ] 2.2 Ensure API client uses correct base paths (`/chat/messages`, `/chat/conversations`, `/chat/conversations/{id}/messages`)
    - References Requirements 4.1, 4.2, 3.1

- [ ] 3. Implement chat logic store (Zustand)
  - [ ] 3.1 Implement `src/features/chat/stores/use-chat-store.ts` state + actions
    - References Requirements 1.1, 5.1, 5.2, 6.1, 7.1, 8.1
    - Include `activeConversationId`, `sendLockByConversationId`, `sendLockForNullConversation`, `streamByConversationId`
  - [ ] 3.2 Implement selectors/helpers for UI to consume (pure functions or store selectors)
    - References Requirements 1.2, 5.2
    - Examples: `hasActiveConversation`, `isSendDisabled(conversationId|null)`, `getStreamState(conversationId)`
  - [ ] 3.3 Ensure stream state transitions to `streaming` only on server `started`
    - References Requirements 5.3

- [ ] 4. Implement TanStack Query hooks (cache + mutation)
  - [ ] 4.1 Add query keys and query hooks in `src/features/chat/hooks/use-chat-queries.ts`
    - References Requirements 2.1, 3.1, 3.3
    - Implement `conversationsKey`, `messagesKey`, `useConversationsQuery`, `useMessagesQuery`
  - [ ] 4.2 Implement send mutation `useSendMessageMutation`
    - References Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.6
    - On send start: lock send for null or active conversation as appropriate
    - On REST success: set `activeConversationId` to returned id and transfer null lock if needed
    - Invalidate conversations list after success
    - On REST error: surface error and clear any temporary null-conversation lock

- [ ] 5. Implement Socket.IO realtime runtime (event wiring)
  - [ ] 5.1 Implement `src/features/chat/hooks/use-chat-realtime-runtime.ts`
    - References Requirements 5.3, 5.4, 5.5, 6.1, 7.1, 7.2, 7.3, 8.1, 8.2, 8.3
    - Subscribe to `chat:message:*` events using `getSocket()` from `src/lib/socket-client.ts`
    - Route all updates by `conversation_id`
  - [ ] 5.2 Implement “commit on completed” behavior via `queryClient.setQueryData(messagesKey(conversationId), ...)`
    - References Requirements 7.2, 5.4
  - [ ] 5.3 Ensure send locks are released on `completed` and `failed` events
    - References Requirements 5.4, 5.5
  - [ ] 5.4 Ignore `chat:message:token` events until `chat:message:started` exists for the conversation
    - References Requirements 5.3, 7.1

- [ ] 6. Align global Socket.IO event typings with backend payloads
  - [ ] 6.1 Update `src/types/socket.types.ts` chat payloads to use `conversation_id`-based contracts
    - References Requirements 5.3, 7.1, 8.1
    - Keep event names identical; update payload shapes to match backend emits
  - [ ] 6.2 Ensure typed socket usage in `src/lib/socket-client.ts` remains valid after the type update
    - References Requirements 6.1

- [ ] 7. Wire feature exports (no UI implementation)
  - [ ] 7.1 Add `src/features/chat/index.ts` barrel exports for hooks + store + types
    - References Requirements 1.1, 2.1, 3.1, 7.1
  - [ ] 7.2 Add a small integration entrypoint (hook or provider) that an eventual UI can mount once
    - References Requirements 5.3, 6.1
    - Example: export `useChatRealtimeRuntime()` for mounting in a future Chat page/component

- [ ] 8. Checkpoint
  - Ensure TypeScript builds and lint passes, ask the user if questions arise.

- [ ] 9. Tests (optional)
  - [ ] 9.1* Add a test runner and property testing library (e.g., Vitest + fast-check)
    - Validates Design Testing Strategy
  - [ ] 9.2* Write unit tests for `use-chat-store` action semantics (locks, started/completed/failed, tool list)
    - Validates Requirements 5.1, 5.4, 5.5, 8.1, 8.2
  - [ ] 9.3* Write property-based test for Design Property 1: Per-Conversation Isolation
    - Validates Requirements 6.1, Design Property 1
    - Minimum 100 iterations
  - [ ] 9.4* Write property-based test for Design Property 3: Stream Starts Only On Server `started`
    - Validates Requirements 5.3, Design Property 3
    - Minimum 100 iterations
  - [ ] 9.5* Write property-based test for Design Property 4: Token Aggregation Forms Draft Assistant Text
    - Validates Requirements 7.1, Design Property 4
    - Minimum 100 iterations (generate only sequences that include `started`)
  - [ ] 9.6* Write property-based test for Design Property 6: Tool Runs Tracked By `tool_call_id`
    - Validates Requirements 8.1, 8.2, Design Property 6
    - Minimum 100 iterations
