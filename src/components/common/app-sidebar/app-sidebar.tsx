import {
  BarChart3,
  Bot,
  Brain,
  LayoutDashboard,
  MessageSquare,
  PanelLeftIcon,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain, type NavItem } from "./nav-main";
import { NavUser } from "./nav-user";
import { cn } from "@/lib/utils";

/**
 * Navigation items configuration for SaphaAI sidebar
 */
const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/app",
    icon: LayoutDashboard,
  },
  {
    title: "Conversations",
    url: "/app/conversations",
    icon: MessageSquare,
    items: [
      { title: "All Chats", url: "/app/conversations" },
      { title: "Archived", url: "/app/conversations/archived" },
    ],
  },
  {
    title: "Agents",
    url: "/app/agents",
    icon: Bot,
    items: [
      { title: "My Agents", url: "/app/agents" },
      { title: "Marketplace", url: "/app/agents/marketplace" },
    ],
  },
  {
    title: "Analytics",
    url: "/app/analytics",
    icon: BarChart3,
    items: [
      { title: "Overview", url: "/app/analytics" },
      { title: "Orders", url: "/app/analytics/orders" },
      { title: "Order Items", url: "/app/analytics/order-items" },
      { title: "Customers", url: "/app/analytics/customers" },
      { title: "Products", url: "/app/analytics/products" },
      { title: "Reports", url: "/app/analytics/reports" },
    ],
  },
  {
    title: "Settings",
    url: "/app/settings",
    icon: Settings,
    items: [
      { title: "General", url: "/app/settings" },
      { title: "API Keys", url: "/app/settings/api-keys" },
      { title: "Integrations", url: "/app/settings/integrations" },
    ],
  },
];

/**
 * Logo header component with toggle functionality
 * - Desktop expanded: Shows logo + app name + toggle icon on right
 * - Desktop collapsed: Shows logo, hover shows toggle icon
 * - Mobile: Shows logo + app name only (toggle via MobileHeader)
 */
const SidebarLogoHeader = () => {
  const { toggleSidebar, state, isMobile } = useSidebar();

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem className='flex justify-center items-center h-[70px]'>
          <SidebarMenuButton
            size="lg"
            onClick={isMobile ? undefined : toggleSidebar}
            tooltip={isMobile ? undefined : "Toggle Sidebar (Ctrl+B)"}
            className={cn(
              "group/logo  data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
              !isMobile && "cursor-pointer"
            )}
          >
            <div
              className={cn(
                "relative flex aspect-square size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground",
                state === "collapsed" && !isMobile && "size-8!"
              )}
            >
              {/* Logo icon - hidden on hover when collapsed (desktop only) */}
              <Brain
                className={cn(
                  "size-6! transition-opacity duration-200",
                  state === "collapsed" && !isMobile
                    ? "group-hover/logo:opacity-0"
                    : "opacity-100"
                )}
              />
              {/* Panel icon - shown on hover when collapsed (desktop only) */}
              {!isMobile && (
                <PanelLeftIcon
                  className={cn(
                    "absolute size-6 transition-opacity duration-200",
                    state === "collapsed"
                      ? "opacity-0 group-hover/logo:opacity-100"
                      : "hidden"
                  )}
                />
              )}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-lg">SaphaAI</span>
              <span className="truncate text-sm text-muted-foreground">
                AI Platform
              </span>
            </div>
            {/* Toggle icon on right - desktop expanded only */}
            {!isMobile && (
              <PanelLeftIcon
                className={cn(
                  "size-6! transition-opacity duration-200",
                  state === "collapsed"
                    ? "group-hover/logo:opacity-0"
                    : "opacity-100"
                )}
              />
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

export const AppSidebar = (props: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarLogoHeader />

      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
