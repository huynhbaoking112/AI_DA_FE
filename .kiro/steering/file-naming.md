---
inclusion: manual
---
# 📝 File Naming & Export Conventions

## File Naming

### Sử dụng kebab-case cho tất cả files

```
✅ ĐÚNG
user-profile.tsx
use-auth-store.ts
api-client.ts
chat-message.tsx
socket-events.ts

❌ SAI
UserProfile.tsx
useAuthStore.ts
apiClient.ts
ChatMessage.tsx
```

### Naming Patterns theo loại file

| Loại file | Pattern | Ví dụ |
|-----------|---------|-------|
| Component | `{name}.tsx` | `chat-input.tsx` |
| Hook | `use-{name}.ts` | `use-debounce.ts` |
| Store | `use-{name}-store.ts` | `use-auth-store.ts` |
| Type | `{name}.ts` hoặc `types.ts` | `message.ts`, `types.ts` |
| API | `{action}-{resource}.ts` | `get-conversations.ts` |
| Util | `{name}.ts` | `format-date.ts` |
| Schema | `{name}.schema.ts` | `login.schema.ts` |
| Constant | `constants.ts` | `constants.ts` |

### Index Files (Barrel Exports)

Mỗi feature PHẢI có `index.ts` để export public API:

```typescript
// src/features/chat/index.ts
// Components
export { ChatLayout } from './components/chat-layout';
export { MessageList } from './components/message-list';
export { ChatInput } from './components/chat-input';

// Hooks
export { useChatSocket } from './hooks/use-chat-socket';

// Store
export { useChatStore } from './stores/use-chat-store';

// Types
export type { Message, Conversation } from './types';
```

## Export Rules

### Named Exports ONLY (Không dùng default export)

```typescript
// ✅ ĐÚNG - Named export
export const Button = () => { ... };
export const useAuth = () => { ... };

// ❌ SAI - Default export
export default function Button() { ... }
```

**Lý do:**
- Dễ refactor và rename
- IDE autocomplete tốt hơn
- Consistent import syntax

### Export ngay tại declaration

```typescript
// ✅ ĐÚNG
export const formatDate = (date: Date): string => { ... };

export interface User {
  id: string;
  name: string;
}

// ❌ SAI - Export riêng ở cuối file
const formatDate = (date: Date): string => { ... };
export { formatDate };
```

## Import Rules

### Absolute Imports với Path Alias

```typescript
// ✅ ĐÚNG - Absolute import
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/use-auth-store';
import { apiClient } from '@/lib/api-client';

// ❌ SAI - Relative import dài
import { Button } from '../../../components/ui/button';
```

### Import Order (Auto-sortable)

```typescript
// 1. React & external packages
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 2. Internal absolute imports (@/)
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/use-auth-store';

// 3. Feature imports (from barrel)
import { useChatSocket } from '@/features/chat';

// 4. Relative imports (same feature)
import { MessageItem } from './message-item';

// 5. Type imports
import type { Message } from './types';

// 6. Style imports
import './styles.css';
```

### Type-only Imports

```typescript
// ✅ ĐÚNG - Explicit type import
import type { User, AuthResponse } from './types';
import { loginSchema } from './schemas';

// Hoặc inline
import { loginSchema, type LoginInput } from './schemas';
```

## Folder-specific Rules

### `src/components/ui/` (shadcn)
- File được generate bởi shadcn CLI
- KHÔNG rename, KHÔNG modify structure
- Chỉ customize qua CSS variables hoặc wrapper components

### `src/features/{name}/`
- PHẢI có `index.ts` barrel file
- Components internal KHÔNG được import trực tiếp từ bên ngoài feature
