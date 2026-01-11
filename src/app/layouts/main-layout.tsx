import { Outlet } from 'react-router-dom';
import { Brain, PanelLeftIcon } from 'lucide-react';

import { AppSidebar } from '@/components/common/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

/**
 * Mobile header with sidebar trigger
 * Only visible on mobile devices
 */
const MobileHeader = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex h-14 items-center gap-3 border-b px-4 md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="size-9"
        aria-label="Open menu"
      >
        <PanelLeftIcon className="size-5" />
      </Button>
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Brain className="size-4" />
        </div>
        <span className="font-semibold">SaphaAI</span>
      </div>
    </header>
  );
};

/**
 * Main content wrapper that includes mobile header
 */
const MainContent = () => {
  return (
    <SidebarInset>
      <MobileHeader />
      <main className="flex-1 w-full h-full p-4">
        <Outlet />
      </main>
    </SidebarInset>
  );
};

/**
 * Main layout component that wraps authenticated pages with sidebar
 */
export const MainLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <MainContent />
    </SidebarProvider>
  );
};
