import { Link, useRouterState } from "@tanstack/react-router";

import { BrasilabLogo } from "@/components/brand/BrasilabLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NAVIGATION_GROUPS } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (router) => router.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="border-sidebar-border border-b px-3 py-4">
        <Link
          to="/dashboard"
          className={cn(
            "flex items-center gap-2 overflow-hidden",
            collapsed && "justify-center px-0 py-1",
          )}
          aria-label="Brasilab Intranet Lab"
        >
          <BrasilabLogo
            variant={collapsed ? "symbol-white" : "white"}
            className={collapsed ? "h-8 w-8 shrink-0" : "h-7"}
          />
          {!collapsed ? (
            <span className="text-sidebar-foreground/70 truncate text-[11px] font-medium tracking-[0.18em] uppercase">
              Intranet Lab
            </span>
          ) : null}
        </Link>
      </SidebarHeader>


      <SidebarContent className="scrollbar-brand">
        {NAVIGATION_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const to = item.path ?? `/${item.slug}`;
                  const isActive = pathname === to;
                  const hasChildren = Boolean(item.children?.length);
                  const isSectionActive = pathname.startsWith(`${to}/`) || isActive;

                  return (
                    <SidebarMenuItem key={item.slug}>
                      <SidebarMenuButton
                        asChild
                        isActive={hasChildren ? isSectionActive : isActive}
                        tooltip={item.label}
                      >
                        <Link to={to} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                          {!item.available && !collapsed ? (
                            <span
                              className={cn(
                                "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                                "bg-sidebar-accent text-sidebar-accent-foreground/80",
                              )}
                            >
                              em breve
                            </span>
                          ) : null}
                        </Link>
                      </SidebarMenuButton>

                      {hasChildren && !collapsed && isSectionActive ? (
                        <SidebarMenuSub>
                          {item.children?.map((child) => {
                            const childTo = child.path ?? `/${item.slug}/${child.slug}`;
                            return (
                              <SidebarMenuSubItem key={child.slug}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname.startsWith(childTo)}
                                >
                                  <Link to={childTo}>
                                    <span className="truncate">{child.label}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      ) : null}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border text-sidebar-foreground/60 border-t px-3 py-3 text-[11px]">
        {collapsed ? "v1.0" : "Brasilab Intranet Lab · v1.0"}
      </SidebarFooter>
    </Sidebar>
  );
}
