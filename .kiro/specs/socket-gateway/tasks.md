# Implementation Plan: Socket Gateway Infrastructure

## Overview

This implementation plan covers the Socket.IO client gateway infrastructure for the frontend application. The tasks are organized to build incrementally, starting with dependencies, then core modules, and finally integration.

## Tasks

- [ ] 1. Install socket.io-client dependency
  - Run `pnpm add socket.io-client` in ai_frontend_kiro directory
  - Verify package.json is updated
  - _Requirements: 1.1_

- [x] 2. Add VITE_SOCKET_URL environment variable
  - Add `VITE_SOCKET_URL` to `.env` file
  - Add `VITE_SOCKET_URL` to `.env.example` file with placeholder value
  - _Requirements: 1.3_

- [x] 3. Create socket event types
  - [x] 3.1 Create `src/types/socket.types.ts` with all event payload interfaces
    - Define ChatMessageStartedPayload, ChatMessageTokenPayload, ChatMessageToolStartPayload, ChatMessageToolEndPayload, ChatMessageCompletedPayload, ChatMessageFailedPayload
    - Define SheetSyncStartedPayload, SheetSyncCompletedPayload, SheetSyncFailedPayload, SheetSyncProgressPayload
    - Define ServerToClientEvents interface with all event handlers
    - Define ClientToServerEvents interface (empty for now)
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 4. Create socket store
  - [x] 4.1 Create `src/stores/use-socket-store.ts`
    - Define SocketStatus type: 'disconnected' | 'connecting' | 'connected' | 'error'
    - Define SocketState interface with status and error
    - Define SocketActions interface with setConnected, setDisconnected, setError, reset
    - Implement Zustand store with initial state and actions
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 4.2 Write unit tests for socket store
    - Test setConnected updates status to 'connected' and clears error
    - Test setDisconnected updates status to 'disconnected'
    - Test setError updates status to 'error' and stores message
    - Test reset returns to initial state
    - _Requirements: 4.3, 4.4, 4.5, 4.6_

- [-] 5. Create socket client
  - [x] 5.1 Create `src/lib/socket-client.ts`
    - Define TypedSocket type using Socket generic
    - Implement singleton socket variable
    - Implement getSocket() function
    - Implement connectSocket() function with auth token and socket options
    - Implement disconnectSocket() function
    - Implement setupSocketListeners() for connect, disconnect, connect_error events
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4_

  - [ ]* 5.2 Write unit tests for socket client
    - Test getSocket returns null before connection
    - Test connectSocket returns null when no token
    - Test connectSocket with token creates socket with correct options
    - Test disconnectSocket sets socket to null
    - _Requirements: 1.2, 1.4, 1.6_

- [x] 6. Create socket provider
  - [x] 6.1 Create `src/app/providers/socket-provider.tsx`
    - Create SocketProvider component that accepts children
    - Subscribe to isAuthenticated from useAuthStore
    - Call connectSocket when authenticated
    - Call disconnectSocket when not authenticated or on unmount
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 7. Integrate socket provider into app
  - [x] 7.1 Add SocketProvider to app providers hierarchy
    - Import SocketProvider in main app or providers file
    - Wrap application with SocketProvider (inside AuthProvider if exists)
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 8. Checkpoint - Verify socket connection
  - Ensure socket connects when user is authenticated
  - Ensure socket disconnects when user logs out
  - Verify socket store updates correctly on connect/disconnect
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The socket provider should be placed inside any auth provider to ensure token is available
- Property tests are not included as the testable properties are simple enough for unit tests
