---
inclusion: manual
---
# 📘 TypeScript & React Coding Standards

## TypeScript Rules

### Strict Typing
- LUÔN bật `strict: true` trong tsconfig
- KHÔNG sử dụng `any` - dùng `unknown` nếu cần type không xác định
- LUÔN định nghĩa return type cho functions

```typescript
// ✅ ĐÚNG
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ SAI
function calculateTotal(items: any) {
  return items.reduce((sum: any, item: any) => sum + item.price, 0);
}
```

### Interface vs Type
- Dùng `interface` cho object shapes (có thể extend)
- Dùng `type` cho unions, tuples, primitives

```typescript
// ✅ Interface cho objects
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Type cho unions
type MessageStatus = 'pending' | 'sent' | 'delivered' | 'error';
```

### Naming Conventions
- `PascalCase` - Components, Interfaces, Types, Classes
- `camelCase` - variables, functions, hooks
- `SCREAMING_SNAKE_CASE` - constants
- `kebab-case` - file names

```typescript
// Files
user-profile.tsx
use-auth.ts
api-client.ts

// Code
const MAX_RETRY_COUNT = 3;
interface UserProfile { ... }
function getUserById() { ... }
const useAuth = () => { ... }
```

## React Rules

### Functional Components Only
- KHÔNG sử dụng Class Components
- Sử dụng arrow function với explicit typing

```typescript
// ✅ ĐÚNG
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button onClick={onClick} className={variant}>
      {label}
    </button>
  );
};
```

### Hooks Rules
- Custom hooks PHẢI bắt đầu bằng `use`
- Đặt hooks ở đầu component
- Không gọi hooks trong conditions hoặc loops

```typescript
// ✅ ĐÚNG
const useUserData = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);
  
  return { user, loading };
};
```

### Props Destructuring
- LUÔN destructure props trong function signature
- Định nghĩa default values trong destructuring

```typescript
// ✅ ĐÚNG
const Card = ({ 
  title, 
  description, 
  variant = 'default',
  className = '' 
}: CardProps) => { ... }

// ❌ SAI
const Card = (props: CardProps) => {
  const title = props.title;
  ...
}
```

### Event Handlers
- Prefix với `handle` cho internal handlers
- Prefix với `on` cho props callbacks

```typescript
interface InputProps {
  onChange: (value: string) => void;  // prop callback
}

const Input = ({ onChange }: InputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);  // internal handler
  };
  
  return <input onChange={handleChange} />;
};
```

## Import Order

```typescript
// 1. React và external libraries
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal absolute imports
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/use-auth-store';

// 3. Relative imports
import { MessageItem } from './message-item';
import type { Message } from './types';

// 4. Styles
import './styles.css';
```
