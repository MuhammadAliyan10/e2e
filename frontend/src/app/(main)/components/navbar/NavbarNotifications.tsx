"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Circle,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  type: "success" | "error" | "info" | "warning";
}

export function NavbarNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Workflow completed",
      description: "Amazon Product Scraper finished successfully",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      type: "success",
    },
    {
      id: "2",
      title: "Execution failed",
      description: "LinkedIn Profile Scraper encountered an error",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      type: "error",
    },
    {
      id: "3",
      title: "New site discovered",
      description: "Successfully analyzed stripe.com",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      type: "info",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      default:
        return "text-blue-500";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold animate-pulse"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 pb-2">
          <h3 className="font-semibold text-lg">Notifications</h3>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={markAllAsRead}
                title="Mark all as read"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Notification settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Separator />
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-muted/50 transition-colors group relative",
                    !notification.read && "bg-primary/5"
                  )}
                >
                  <div className="flex gap-3">
                    <div className="mt-1">
                      <Circle
                        className={cn(
                          "h-2 w-2 fill-current",
                          getTypeColor(notification.type)
                        )}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-none">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <Badge
                            variant="secondary"
                            className="h-5 px-1.5 text-xs shrink-0"
                          >
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        {formatDistanceToNow(notification.timestamp, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => markAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => deleteNotification(notification.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <Separator />
        <div className="p-2">
          <Button variant="ghost" className="w-full justify-center text-sm">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
