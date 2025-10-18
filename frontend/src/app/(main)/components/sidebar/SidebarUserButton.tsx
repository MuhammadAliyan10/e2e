"use client";

import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Settings,
  User,
  CreditCard,
  ChevronDown,
  Check,
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
          className={`w-full justify-start gap-3 px-3 py-2 h-auto ${
            collapsed ? "justify-center px-2" : ""
          }`}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.imageUrl} alt={user.username || "User"} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-1 items-center justify-between overflow-hidden">
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-sm font-medium truncate w-full">
                  {user.fullName || user.username}
                </span>
                <span className="text-xs text-muted-foreground truncate w-full">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-56"
        side={collapsed ? "right" : "top"}
      >
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.fullName || user.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/dashboard/billing")}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
