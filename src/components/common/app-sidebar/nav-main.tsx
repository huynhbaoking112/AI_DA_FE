import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, type LucideIcon } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export interface NavSubItem {
  title: string;
  url: string;
}

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: NavSubItem[];
}

interface NavMainProps {
  items: NavItem[];
}

export const NavMain = ({ items }: NavMainProps) => {
  const location = useLocation();
  const isActiveItem = useCallback(
    (item: NavItem) => {
      // Check if current path matches item url or any sub-item url
      if (location.pathname === item.url) return true;
      if (item.items?.some((sub) => location.pathname === sub.url)) return true;
      // Check if current path starts with item url (for nested routes)
      if (item.url !== '/' && location.pathname.startsWith(item.url))
        return true;
      return false;
    },
    [location.pathname]
  );

  const isActiveSubItem = useCallback(
    (url: string) => location.pathname === url,
    [location.pathname]
  );

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel className="text-sm font-medium">Platform</SidebarGroupLabel> */}
      <SidebarMenu className="gap-3">
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;
          const isActive = isActiveItem(item);

          if (!hasSubItems) {
            // Simple menu item without sub-items
            return (
              <SidebarMenuItem key={item.title} className='flex justify-center items-center'>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                >
                  <Link to={item.url}>
                    <item.icon className={"w-5! h-5!"}/>
                    <span className="text-lg font-normal">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // Collapsible menu item with sub-items
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem >
                <CollapsibleTrigger className='mx-auto' asChild>
                  <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                    <item.icon className={"w-5! h-5!"} />
                    <span className="text-lg font-normal">{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="gap-3 py-3">
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActiveSubItem(subItem.url)}
                        >
                          <Link to={subItem.url}>
                            <span className="text-lg font-normal">{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
