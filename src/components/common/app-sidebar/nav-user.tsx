import { useCallback } from 'react';
import { LogOut } from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/stores/use-auth-store';

export const NavUser = () => {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <SidebarMenu>
      <SidebarMenuItem className='flex justify-center items-center'>
        <SidebarMenuButton
          tooltip="Logout"
          onClick={handleLogout}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className={"w-5! h-5!"} />
          <span className="text-lg font-normal">Logout</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
