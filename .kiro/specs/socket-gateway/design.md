# Design Document

## Overview

This document describes the technical design for the Socket.IO client gateway infrastructure. The gateway provides a singleton socket client, global connection state management, and type-safe event definitions for real-time communication with the backend server.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Application                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────────┐                      │
│  │ Auth Store   │────▶│ Socket Provider  │                      │
│  │ (token)      │     │ (auto connect)   │                      │
│  └──────────────┘     └────────┬─────────┘                      │
│                                │                                 │
│                                ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    src/lib/socket-client.ts               │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │  Singleton Socket Instance                          │ │   │
│  │  │  - connectSocket(token)                             │ │   │
│  │  │  - disconnectSocket()                               │ │   │
│  │  │  - getSocket()                                      │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                │                                 │
│                                ▼                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              src/stores/use-socket-store.ts               │   │
│  │  - status: 'disconnected' | 'connecting' | 'connected'   │   │
│  │  - error: string | null                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                src/types/socket.types.ts                  │   │
│  │  - ServerToClientEvents                                   │   │
│  │  - ClientToServerEvents                                   │   │
│  │  - Event Payload Interfaces                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ WebSocket (Socket.IO)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Backend Socket Server                        │
│  - JWT Authentication via auth: { token }                        │
│  - Auto-join user to room "user:{user_id}"                      │
│  - Emit events to user rooms                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Socket Client (`src/lib/socket-client.ts`)

The core singleton module that manages the Socket.IO connection.

```typescript
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/use-auth-store';
import { useSocketStore } from '@/stores/use-socket-store';
import type { ServerToClientEvents, ClientToServerEvents } from '@/types/socket.types';

// Typed socket instance
type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// Singleton instance
let socket: TypedSocket | null = null;

/**
 * Get the current socket instance
 * @returns Socket instance or null if not connected
 */
export const getSocket = (): TypedSocket | null => socket;

/**
 * Connect to the socket server with JWT authentication
 * @returns Socket instance or null if no token available
 */
export const connectSocket = (): TypedSocket | null => {
  const token = useAuthStore.getState().token;
  
  if (!token) {
    console.warn('[Socket] Cannot connect: No auth token');
    return null;
  }

  // Return existing connected socket
  if (socket?.connected) {
    return socket;
  }

  // Disconnect existing socket if any
  if (socket) {
    socket.disconnect();
  }

  // Create new socket connection
  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  // Setup connection lifecycle handlers
  setupSocketListeners(socket);

  return socket;
};

/**
 * Disconnect and cleanup socket
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    useSocketStore.getState().setDisconnected('manual');
  }
};

/**
 * Setup socket event listeners for connection lifecycle
 */
const setupSocketListeners = (socket: TypedSocket): void => {
  socket.on('connect', () => {
    useSocketStore.getState().setConnected();
  });

  socket.on('disconnect', (reason) => {
    useSocketStore.getState().setDisconnected(reason);
  });

  socket.on('connect_error', (error) => {
    useSocketStore.getState().setError(error.message);
    
    // Handle auth rejection
    if (error.message === 'Unauthorized') {
      useAuthStore.getState().logout();
      disconnectSocket();
    }
  });
};
```

### 2. Socket Store (`src/stores/use-socket-store.ts`)

Zustand store for global socket connection state.

```typescript
import { create } from 'zustand';

type SocketStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface SocketState {
  status: SocketStatus;
  error: string | null;
}

interface SocketActions {
  setConnected: () => void;
  setDisconnected: (reason?: string) => void;
  setError: (error: string) => void;
  reset: () => void;
}

const initialState: SocketState = {
  status: 'disconnected',
  error: null,
};

export const useSocketStore = create<SocketState & SocketActions>()((set) => ({
  ...initialState,

  setConnected: () => set({ status: 'connected', error: null }),
  
  setDisconnected: (reason) => set({ 
    status: 'disconnected', 
    error: reason === 'io server disconnect' ? 'Server disconnected' : null 
  }),
  
  setError: (error) => set({ status: 'error', error }),
  
  reset: () => set(initialState),
}));
```

### 3. Socket Provider (`src/app/providers/socket-provider.tsx`)

React component that manages socket lifecycle based on auth state.

```typescript
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/use-auth-store';
import { connectSocket, disconnectSocket } from '@/lib/socket-client';

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated]);

  return <>{children}</>;
};
```

## Data Models

### Event Payload Types (`src/types/socket.types.ts`)

```typescript
// ============================================
// Chat Events Payloads
// ============================================
export interface ChatMessageStartedPayload {
  message_id: string;
  conversation_id: string;
}

export interface ChatMessageTokenPayload {
  message_id: string;
  token: string;
}

export interface ChatMessageToolStartPayload {
  message_id: string;
  tool_name: string;
  tool_input: Record<string, unknown>;
}

export interface ChatMessageToolEndPayload {
  message_id: string;
  tool_name: string;
  tool_output: string;
}

export interface ChatMessageCompletedPayload {
  message_id: string;
  content: string;
}

export interface ChatMessageFailedPayload {
  message_id: string;
  error: string;
}

// ============================================
// Sheet Sync Events Payloads
// ============================================
export interface SheetSyncStartedPayload {
  connection_id: string;
}

export interface SheetSyncCompletedPayload {
  connection_id: string;
  total_rows: number;
}

export interface SheetSyncFailedPayload {
  connection_id: string;
  error: string;
}

export interface SheetSyncProgressPayload {
  connection_id: string;
  progress: number;
}

// ============================================
// Socket Event Interfaces
// ============================================
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

export interface ClientToServerEvents {
  // Reserved for future client-to-server events
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Connect Idempotence

*For any* socket client state where the socket is already connected, calling `connectSocket()` multiple times SHALL return the same socket instance without creating new connections.

**Validates: Requirements 1.5**

### Property 2: Store Reset Round-Trip

*For any* socket store state (with any status and error values), calling `reset()` SHALL return the store to its initial state with status 'disconnected' and error null.

**Validates: Requirements 4.6**

## Error Handling

### Connection Errors

| Error Type | Handling |
|------------|----------|
| No auth token | Return null, log warning, do not attempt connection |
| Server unauthorized | Trigger logout, disconnect socket, update store to error |
| Network error | Socket.IO auto-reconnect handles this |
| Reconnection failed | Update store status to 'error' with message |

### Store Error States

The socket store tracks errors with the following behavior:
- `setConnected()`: Clears any existing error
- `setDisconnected(reason)`: Sets error only if server-initiated disconnect
- `setError(message)`: Sets status to 'error' and stores message
- `reset()`: Clears all state including errors

## Testing Strategy

### Unit Tests

Unit tests will verify specific behaviors:

1. **Socket Client Tests**
   - `getSocket()` returns null before connection
   - `connectSocket()` returns null when no token
   - `disconnectSocket()` sets socket to null

2. **Socket Store Tests**
   - `setConnected()` updates status and clears error
   - `setDisconnected()` updates status correctly
   - `setError()` updates status and error message
   - `reset()` returns to initial state

### Property-Based Tests

Property tests will use a testing library (e.g., fast-check) to verify:

1. **Connect Idempotence**: Multiple connect calls return same instance
2. **Store Reset**: Any state resets to initial state

### Integration Considerations

- Socket connection tests require mocking `socket.io-client`
- Auth integration tests require mocking `useAuthStore`
- Full E2E tests would require running backend socket server
