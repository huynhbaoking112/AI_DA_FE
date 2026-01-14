# Requirements Document

## Introduction

This document defines the requirements for implementing a Socket.IO client gateway infrastructure in the frontend application. The gateway will establish real-time bidirectional communication with the backend Socket.IO server, enabling features like chat streaming, sheet sync progress, and other real-time notifications.

## Glossary

- **Socket_Client**: The singleton Socket.IO client instance that manages the WebSocket connection to the server
- **Socket_Store**: Zustand store that tracks the global socket connection state (status, errors)
- **Server_To_Client_Events**: TypeScript interface defining all events the server can emit to the client
- **Client_To_Server_Events**: TypeScript interface defining all events the client can emit to the server
- **Auth_Token**: JWT token used to authenticate the socket connection with the server

## Requirements

### Requirement 1: Socket Client Singleton

**User Story:** As a developer, I want a singleton Socket.IO client instance, so that all features share the same connection and avoid multiple connections.

#### Acceptance Criteria

1. THE Socket_Client SHALL be implemented as a singleton pattern with a single shared instance
2. WHEN `getSocket()` is called, THE Socket_Client SHALL return the current socket instance or null if not connected
3. WHEN `connectSocket()` is called with a valid Auth_Token, THE Socket_Client SHALL establish a connection to the server URL from environment variable `VITE_SOCKET_URL`
4. WHEN `connectSocket()` is called without an Auth_Token, THE Socket_Client SHALL return null and log a warning
5. WHEN `connectSocket()` is called while already connected, THE Socket_Client SHALL return the existing socket instance without creating a new connection
6. WHEN `disconnectSocket()` is called, THE Socket_Client SHALL disconnect the socket and set the instance to null

### Requirement 2: Socket Authentication

**User Story:** As a user, I want the socket connection to be authenticated with my JWT token, so that I only receive events intended for me.

#### Acceptance Criteria

1. WHEN connecting to the server, THE Socket_Client SHALL pass the Auth_Token via the `auth` option as `{ token: string }`
2. WHEN the server rejects the connection with "Unauthorized", THE Socket_Client SHALL trigger logout via useAuthStore and disconnect
3. THE Socket_Client SHALL retrieve the Auth_Token from useAuthStore.getState().token

### Requirement 3: Socket Reconnection

**User Story:** As a user, I want the socket to automatically reconnect if the connection is lost, so that I don't miss real-time updates.

#### Acceptance Criteria

1. THE Socket_Client SHALL enable automatic reconnection with `reconnection: true`
2. THE Socket_Client SHALL attempt reconnection up to 5 times with `reconnectionAttempts: 5`
3. THE Socket_Client SHALL use exponential backoff starting at 1000ms with `reconnectionDelay: 1000`
4. THE Socket_Client SHALL cap reconnection delay at 5000ms with `reconnectionDelayMax: 5000`

### Requirement 4: Socket Connection State Store

**User Story:** As a developer, I want to access the socket connection state from any component, so that I can show connection status and handle disconnections.

#### Acceptance Criteria

1. THE Socket_Store SHALL track connection status as one of: 'disconnected', 'connecting', 'connected', 'error'
2. THE Socket_Store SHALL track the last error message as a nullable string
3. WHEN the socket connects successfully, THE Socket_Store SHALL update status to 'connected' and clear any error
4. WHEN the socket disconnects, THE Socket_Store SHALL update status to 'disconnected'
5. WHEN a connection error occurs, THE Socket_Store SHALL update status to 'error' and store the error message
6. THE Socket_Store SHALL provide a `reset()` action to clear all state

### Requirement 5: Type-Safe Socket Events

**User Story:** As a developer, I want TypeScript interfaces for all socket events, so that I get compile-time type checking when handling events.

#### Acceptance Criteria

1. THE Server_To_Client_Events interface SHALL define all chat events: `chat:message:started`, `chat:message:token`, `chat:message:tool_start`, `chat:message:tool_end`, `chat:message:completed`, `chat:message:failed`
2. THE Server_To_Client_Events interface SHALL define all sheet sync events: `sheet:sync:started`, `sheet:sync:completed`, `sheet:sync:failed`, `sheet:sync:progress`
3. WHEN creating the socket instance, THE Socket_Client SHALL use typed Socket generic `Socket<ServerToClientEvents, ClientToServerEvents>`
4. THE payload interfaces SHALL match the backend event data structures

### Requirement 6: Auto Connect/Disconnect on Auth State Change

**User Story:** As a user, I want the socket to automatically connect when I log in and disconnect when I log out, so that I don't need to manually manage the connection.

#### Acceptance Criteria

1. WHEN user authentication state changes to authenticated, THE application SHALL call `connectSocket()`
2. WHEN user authentication state changes to unauthenticated, THE application SHALL call `disconnectSocket()`
3. WHEN the application mounts and user is already authenticated, THE application SHALL call `connectSocket()`
