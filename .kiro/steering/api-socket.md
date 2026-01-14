---
inclusion: manual
---
# 🔌 API & Socket.IO Rules

## API Client (`src/lib/api-client.ts`)

### Axios Instance với Bearer Token

```typescript
import axios from 'axios';
import { useAuthStore } from '@/stores/use-auth-store';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Attach Token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor - Handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Feature API Files

```typescript
// src/features/chat/api/get-conversations.ts
import { apiClient } from '@/lib/api-client';
import type { Conversation } from '../types';

export const getConversations = async (): Promise<Conversation[]> => {
  const { data } = await apiClient.get('/conversations');
  return data;
};
```

## Socket.IO Client (`src/lib/socket-client.ts`)

### Singleton Pattern

```typescript
import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@/features/chat/types/socket-events';

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: TypedSocket | null = null;

export const getSocket = (): TypedSocket | null => socket;

export const connectSocket = (token: string): TypedSocket => {
  if (socket?.connected) return socket;
  
  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
  
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
```

### Type-Safe Socket Events

```typescript
// src/features/chat/types/socket-events.ts
export interface ServerToClientEvents {
  'ai:response:chunk': (data: { chunk: string; messageId: string }) => void;
  'ai:response:complete': (data: { messageId: string }) => void;
  'ai:response:error': (data: { error: string; messageId: string }) => void;
  'agent:status': (status: 'thinking' | 'tool_calling' | 'idle') => void;
}

export interface ClientToServerEvents {
  'chat:send': (payload: { content: string; conversationId: string }) => void;
  'chat:stop': (payload: { messageId: string }) => void;
}
```

### Socket Hook trong Feature

```typescript
// src/features/chat/hooks/use-chat-socket.ts
import { useEffect, useCallback } from 'react';
import { getSocket } from '@/lib/socket-client';
import { useChatStore } from '../stores/use-chat-store';

export const useChatSocket = () => {
  const appendChunk = useChatStore((s) => s.appendChunk);
  const setAgentStatus = useChatStore((s) => s.setAgentStatus);
  
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    
    const handleChunk = (data: { chunk: string; messageId: string }) => {
      appendChunk(data.messageId, data.chunk);
    };
    
    const handleStatus = (status: 'thinking' | 'idle') => {
      setAgentStatus(status);
    };
    
    socket.on('ai:response:chunk', handleChunk);
    socket.on('agent:status', handleStatus);
    
    // Cleanup listeners on unmount
    return () => {
      socket.off('ai:response:chunk', handleChunk);
      socket.off('agent:status', handleStatus);
    };
  }, [appendChunk, setAgentStatus]);
  
  const sendMessage = useCallback((content: string, conversationId: string) => {
    const socket = getSocket();
    socket?.emit('chat:send', { content, conversationId });
  }, []);
  
  return { sendMessage };
};
```

## React Query Integration

### Query Keys Convention

```typescript
// Sử dụng factory pattern cho query keys
export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...chatKeys.conversations(), id] as const,
  messages: (conversationId: string) => [...chatKeys.conversation(conversationId), 'messages'] as const,
};

// Usage
const { data } = useQuery({
  queryKey: chatKeys.messages(conversationId),
  queryFn: () => getMessages(conversationId),
});
```

### Mutation với Optimistic Updates

```typescript
const sendMessageMutation = useMutation({
  mutationFn: sendMessage,
  onMutate: async (newMessage) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: chatKeys.messages(conversationId) });
    
    // Snapshot previous value
    const previousMessages = queryClient.getQueryData(chatKeys.messages(conversationId));
    
    // Optimistically update
    queryClient.setQueryData(chatKeys.messages(conversationId), (old) => [
      ...old,
      { ...newMessage, status: 'pending' }
    ]);
    
    return { previousMessages };
  },
  onError: (err, newMessage, context) => {
    // Rollback on error
    queryClient.setQueryData(chatKeys.messages(conversationId), context?.previousMessages);
  },
});
```
