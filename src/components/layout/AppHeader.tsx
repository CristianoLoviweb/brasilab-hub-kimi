import { useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Search, User } from "lucide-react";
import { toast } from "sonner";

import { AppBreadcrumb } from "@/components/layout/AppBreadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    toast.success("Sessão encerrada");
    navigate({ to: "/entrar", replace: true });
  }

  return (
    <header className="bg-background/85 sticky top-0 z-30 border-b backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-3 sm:px-6">
        <SidebarTrigger className="shrink-0" />
        <Separator orientation="vertical" className="hidden h-6 sm:block" />
        <div className="hidden min-w-0 flex-1 sm:block">
          <AppBreadcrumb />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <div className="relative hidden lg:block">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar na plataforma"
              className="h-9 w-64 pl-8"
              aria-label="Pesquisar na plataforma"
            />
          </div>

          <Button variant="ghost" size="icon" aria-label="Notificações" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-1.5 sm:px-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-gradient-brand text-xs text-brand-foreground">
                    {user?.initials ?? "BL"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-[10rem] truncate text-sm font-medium sm:inline">
                  {user?.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="truncate">
                {user?.email}
                <span className="block text-xs font-normal text-muted-foreground">
                  {user?.role}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <User className="mr-2 h-4 w-4" />
                Meu perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => void handleLogout()}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="border-t px-3 py-2 sm:hidden">
        <AppBreadcrumb />
      </div>
    </header>
  );
}
