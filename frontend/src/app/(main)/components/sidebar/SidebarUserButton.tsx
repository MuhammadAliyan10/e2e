"use client";

import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Settings,
  User,
  CreditCard,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarUserButtonProps {
  collapsed?: boolean;
}

export function SidebarUserButton({
  collapsed = false,
}: SidebarUserButtonProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : user?.username?.[0]?.toUpperCase() || "U";

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full gap-3 px-2 py-2 h-auto hover:bg-accent/10",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <Avatar className="h-9 w-9 ring-2 ring-primary/20">
            <AvatarImage src={user.imageUrl} alt={user.username || "User"} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-1 items-center justify-between overflow-hidden">
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-sm font-semibold truncate w-full text-foreground">
                  {user.fullName || user.username}
                </span>
              </div>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-[#1a1a1a] border-border"
        side={collapsed ? "right" : "top"}
        sideOffset={8}
      >
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none text-foreground">
              {user.fullName || user.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/profile")}
          className="hover:bg-accent/10"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/settings")}
          className="hover:bg-accent/10"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/billing")}
          className="hover:bg-accent/10"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-destructive focus:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
