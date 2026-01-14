---
inclusion: manual
---
# 📂 Project Structure Rules - Feature-First Architecture

## Tổng quan cấu trúc thư mục

```
src/
├── app/                    # Application Layer (routing, providers, layouts)
├── assets/                 # Static files (fonts, images, styles)
├── components/             # GLOBAL Shared Components
├── config/                 # Environment & Constants
├── features/               # ⚡ CORE BUSINESS LOGIC (Feature modules)
├── hooks/                  # Global custom hooks
├── lib/                    # Infrastructure (API client, Socket, utilities)
├── stores/                 # Global Zustand stores
└── types/                  # Global TypeScript definitions
```

## Quy tắc đặt file theo thư mục

### `src/app/` - Application Layer
- `layouts/` - Layout components (MainLayout, AuthLayout)
- `providers/` - Context Providers (ThemeProvider, QueryClientProvider)
- `router.tsx` - Route definitions với Protected Routes

### `src/components/` - Shared Components
- `ui/` - shadcn/ui primitives ONLY (Button, Input, Card...)
- `common/` - App-specific shared (LoadingSpinner, ErrorBoundary, Logo)
- `icons/` - Custom SVG icon components
- `form/` - Form wrappers (React Hook Form + Zod integration)

### `src/features/` - Business Logic Modules
Mỗi feature là một module độc lập với cấu trúc:
```
features/{feature-name}/
├── api/            # REST API calls cho feature
├── components/     # UI components CHỈ dùng trong feature này
├── hooks/          # Custom hooks cho feature
├── stores/         # Zustand slice cho feature
├── types/          # TypeScript interfaces cho feature
├── schemas/        # Zod validation schemas (optional)
└── index.ts        # Barrel export (public API)
```

### `src/lib/` - Infrastructure
- `api-client.ts` - Axios instance với Bearer Token interceptor
- `socket-client.ts` - Socket.IO singleton instance
- `storage.ts` - Typed localStorage wrapper
- `utils.ts` - Helper functions (cn, formatters)

### `src/stores/` - Global State
- `use-auth-store.ts` - Authentication state
- `use-app-store.ts` - UI state (sidebar, theme)
- `use-socket-store.ts` - Socket connection status

## Quy tắc Colocation (Đặt file gần nhau)

1. **Component chỉ dùng trong 1 feature** → Đặt trong `features/{name}/components/`
2. **Component dùng ở 2+ features** → Đặt trong `src/components/common/`
3. **Hook chỉ dùng trong 1 feature** → Đặt trong `features/{name}/hooks/`
4. **Hook dùng ở nhiều nơi** → Đặt trong `src/hooks/`

## Quy tắc Import

```typescript
// ✅ ĐÚNG - Import từ barrel file
import { ChatInput, MessageList } from '@/features/chat';

// ❌ SAI - Import trực tiếp vào internal
import { ChatInput } from '@/features/chat/components/chat-input';
```
