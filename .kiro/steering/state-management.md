---
inclusion: manual
---
# 🗄️ State Management Rules (Zustand)

## Store Structure

### Global Stores (`src/stores/`)
- `use-auth-store.ts` - User authentication, token, permissions
- `use-app-store.ts` - UI state (sidebar, theme, modals)
- `use-socket-store.ts` - Socket connection status

### Feature Stores (`src/features/{name}/stores/`)
- Mỗi feature có thể có store riêng
- Chỉ chứa state liên quan đến feature đó

## Zustand Best Practices

### Store Template

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      
      // Actions
      login: (token, user) => set({ 
        token, 
        user, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        token: null, 
        user: null, 
        isAuthenticated: false 
      }),
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ token: state.token }), // Only persist token
    }
  )
);
```

### Selectors để tránh re-render

```typescript
// ✅ ĐÚNG - Chỉ subscribe vào những gì cần
const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

// ❌ SAI - Subscribe toàn bộ store
const { user, isAuthenticated, token, login, logout } = useAuthStore();
```

### Shallow Compare cho multiple selectors

```typescript
import { useShallow } from 'zustand/react/shallow';

// ✅ ĐÚNG - Shallow compare để tránh re-render
const { user, isAuthenticated } = useAuthStore(
  useShallow((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }))
);
```

### Actions ngoài React

```typescript
// Gọi action từ bên ngoài React component (VD: trong API interceptor)
import { useAuthStore } from '@/stores/use-auth-store';

// Trong api-client.ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout(); // ✅ Gọi action trực tiếp
    }
    return Promise.reject(error);
  }
);
```

## State Categories

### Server State (React Query)
- Data từ API (users, messages, agents)
- Caching, refetching, optimistic updates
- KHÔNG lưu trong Zustand

### Client State (Zustand)
- UI state (sidebar open, selected tab)
- Auth state (token, current user)
- Socket state (connection status)

```typescript
// ❌ SAI - Lưu server data trong Zustand
const useChatStore = create((set) => ({
  messages: [], // Không nên!
  fetchMessages: async () => {...}
}));

// ✅ ĐÚNG - Dùng React Query cho server state
const { data: messages } = useQuery({
  queryKey: ['messages', conversationId],
  queryFn: () => fetchMessages(conversationId),
});

// ✅ ĐÚNG - Zustand cho UI state
const useChatStore = create((set) => ({
  selectedConversationId: null,
  isInputFocused: false,
}));
```

## Naming Convention

- File: `use-{name}-store.ts` (kebab-case với prefix use-)
- Hook: `use{Name}Store` (camelCase)
- Actions: verb + noun (`login`, `logout`, `updateUser`, `setTheme`)
