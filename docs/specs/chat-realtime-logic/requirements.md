# Requirements Document

## Introduction

This document specifies the requirements for a **frontend chat logic layer** that enables a UI to:
- List and select conversations
- Send messages via REST
- Receive assistant streaming updates via Socket.IO
- Support **concurrent streaming across multiple conversations**

This specification focuses on **UI-agnostic** behavior (state + events + API interactions), not UI layout or styling.

## Glossary

- **Chat_Feature_Logic**: The frontend logic module (hooks + store + query integration) that exposes chat state and actions to the UI.
- **AI_Chat_API**: The backend HTTP API that provides chat endpoints (send message, list conversations, list messages).
- **AI_Chat_Realtime**: The backend Socket.IO server that emits chat events to authenticated clients.
- **Conversation_ID**: The unique identifier of a conversation returned by AI_Chat_API and referenced by AI_Chat_Realtime payloads.
- **Active_Conversation**: The conversation currently selected by the UI, represented by `Active_Conversation_ID` which may be null.
- **Stream_State**: The per-conversation streaming status exposed by Chat_Feature_Logic (`idle`, `streaming`, `failed`).
- **Send_Lock**: A per-conversation flag that prevents sending a new message in a conversation while an earlier message in that conversation is in-flight or streaming.
- **Draft_Assistant_Text**: The per-conversation in-progress assistant response text constructed by concatenating streaming tokens.
- **Running_Tools**: A per-conversation ordered list of tool executions as observed from realtime events. Each item includes `tool_call_id`, `tool_name`, and a completion status.

## Requirements

### Requirement 1: Active Conversation Selection

**User Story:** As a UI developer, I want Chat_Feature_Logic to manage the selected conversation, so that the UI can render either an empty state or a conversation thread.

#### Acceptance Criteria

1.1 THE Chat_Feature_Logic SHALL expose `Active_Conversation_ID` which MAY be null.

1.2 WHEN `Active_Conversation_ID` is null, THE Chat_Feature_Logic SHALL provide an explicit empty-state indicator to the UI (e.g., `hasActiveConversation=false`).

1.3 WHEN the UI selects a Conversation_ID, THE Chat_Feature_Logic SHALL set `Active_Conversation_ID` to the selected Conversation_ID.

### Requirement 2: Conversation Listing

**User Story:** As a UI developer, I want a cached conversations list, so that users can quickly switch between past conversations.

#### Acceptance Criteria

2.1 WHEN the UI requests the conversations list, THE Chat_Feature_Logic SHALL fetch conversations from AI_Chat_API and cache the result.

2.2 WHEN the cached conversations list is invalidated, THE Chat_Feature_Logic SHALL refetch the conversations list from AI_Chat_API.

### Requirement 3: Message History Fetching

**User Story:** As a UI developer, I want message history to load on selection, so that the chat thread can be rendered from backend truth.

#### Acceptance Criteria

3.1 WHEN `Active_Conversation_ID` is a Conversation_ID, THE Chat_Feature_Logic SHALL fetch the messages for `Active_Conversation_ID` from AI_Chat_API.

3.2 WHEN `Active_Conversation_ID` changes from one Conversation_ID to another Conversation_ID, THE Chat_Feature_Logic SHALL fetch messages for the new `Active_Conversation_ID`.

3.3 WHILE `Active_Conversation_ID` is null, THE Chat_Feature_Logic SHALL NOT attempt to fetch conversation messages from AI_Chat_API.

### Requirement 4: Sending Messages via REST

**User Story:** As a UI developer, I want a single send action that works for both new and existing conversations, so that the UI can always call “send”.

#### Acceptance Criteria

4.1 WHEN the UI sends a message while `Active_Conversation_ID` is null, THE Chat_Feature_Logic SHALL call AI_Chat_API to create a new conversation and return a Conversation_ID.

4.2 WHEN the UI sends a message while `Active_Conversation_ID` is a Conversation_ID, THE Chat_Feature_Logic SHALL call AI_Chat_API using `Active_Conversation_ID`.

4.3 WHEN AI_Chat_API returns a new Conversation_ID for a send request, THE Chat_Feature_Logic SHALL set `Active_Conversation_ID` to the returned Conversation_ID.

4.4 WHEN a send request succeeds, THE Chat_Feature_Logic SHALL invalidate the cached conversations list.

4.5 IF a send request fails, THEN THE Chat_Feature_Logic SHALL surface an error state to the UI for the targeted conversation.

### Requirement 5: Per-Conversation Send Locking

**User Story:** As an end user, I want to be prevented from sending multiple messages at once in the same conversation, so that assistant streaming stays consistent.

#### Acceptance Criteria

5.1 WHEN the UI initiates a send request for a Conversation_ID, THE Chat_Feature_Logic SHALL set `Send_Lock` for that Conversation_ID.

5.2 WHILE `Send_Lock` is set for a Conversation_ID, THE Chat_Feature_Logic SHALL indicate to the UI that sending is disabled for that Conversation_ID.

5.3 WHEN AI_Chat_Realtime emits `chat:message:started` for a Conversation_ID, THE Chat_Feature_Logic SHALL set `Stream_State` to `streaming` for that Conversation_ID.

5.4 WHEN AI_Chat_Realtime emits `chat:message:completed` for a Conversation_ID, THE Chat_Feature_Logic SHALL clear `Send_Lock` for that Conversation_ID.

5.5 WHEN AI_Chat_Realtime emits `chat:message:failed` for a Conversation_ID, THE Chat_Feature_Logic SHALL clear `Send_Lock` for that Conversation_ID.

5.6 WHERE the UI initiates a send request while `Active_Conversation_ID` is null, THE Chat_Feature_Logic SHALL set a temporary Send_Lock until AI_Chat_API returns a Conversation_ID, and THE Chat_Feature_Logic SHALL transfer the Send_Lock to the returned Conversation_ID.

### Requirement 6: Concurrent Streaming Across Conversations

**User Story:** As an end user, I want to be able to switch to a different conversation and send a message there while the previous conversation is still streaming, so that I can multitask.

#### Acceptance Criteria

6.1 WHEN AI_Chat_Realtime emits streaming events for multiple Conversation_ID values, THE Chat_Feature_Logic SHALL track independent `Stream_State` and `Send_Lock` values per Conversation_ID.

6.2 WHILE Conversation_A has `Send_Lock` set, THE Chat_Feature_Logic SHALL allow the UI to send messages in Conversation_B if Conversation_B does not have `Send_Lock` set.

### Requirement 7: Streaming Token Aggregation

**User Story:** As an end user, I want to see the assistant message appear incrementally, so that I can read the response as it is generated.

#### Acceptance Criteria

7.1 WHEN AI_Chat_Realtime emits `chat:message:token` for a Conversation_ID, THE Chat_Feature_Logic SHALL append the token to the current draft assistant text for that Conversation_ID.

7.2 WHEN AI_Chat_Realtime emits `chat:message:completed` for a Conversation_ID, THE Chat_Feature_Logic SHALL finalize the assistant message content for that Conversation_ID using the completed payload content.

7.3 WHEN AI_Chat_Realtime emits `chat:message:failed` for a Conversation_ID, THE Chat_Feature_Logic SHALL preserve the current draft assistant text for that Conversation_ID and SHALL surface the error to the UI.

### Requirement 8: Tool Execution Tracking (Name Only)

**User Story:** As an end user, I want to know which tool is running during the assistant response, so that I understand what the assistant is doing.

#### Acceptance Criteria

8.1 WHEN AI_Chat_Realtime emits `chat:message:tool_start` for a Conversation_ID, THE Chat_Feature_Logic SHALL append an entry to `Running_Tools` for that Conversation_ID including `tool_call_id` and `tool_name`.

8.2 WHEN AI_Chat_Realtime emits `chat:message:tool_end` for a Conversation_ID, THE Chat_Feature_Logic SHALL mark the matching `Running_Tools` entry as completed using `tool_call_id`.

8.3 THE Chat_Feature_Logic SHALL expose `Running_Tools` to the UI for each Conversation_ID.
