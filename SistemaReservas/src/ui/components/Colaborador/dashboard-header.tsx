"use client";

import { Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  user: { username: string; name: string } | null;
  onLogout: () => void;
}

export function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  return (
    <header
      className="border-b px-6 py-4"
      style={{ backgroundColor: "#3A4A5C", borderColor: "#4A5A6C" }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Dashboard RCD Hotels
          </h1>
          <p className="text-sm text-gray-300">Panel de Colaboradores</p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:bg-white/10"
          >
            <Bell className="h-5 w-5" />
            <span
              className="absolute -top-1 -right-1 h-3 w-3 rounded-full"
              style={{ backgroundColor: "#FF8C00" }}
            ></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-white hover:bg-white/10"
              >
                <User className="h-5 w-5" />
                <div className="text-left">
                  <span className="block text-sm font-medium">
                    {user?.name || "Usuario"}
                  </span>
                  <span className="block text-xs text-gray-300">
                    @{user?.username}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
