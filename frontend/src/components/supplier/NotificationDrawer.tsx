"use client"

import * as React from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

/* eslint-disable @typescript-eslint/no-explicit-any */

export function NotificationDrawer({ notifications }: { notifications: any[] }) {
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Sheet>
      <SheetTrigger 
        render={<Button variant="ghost" size="icon" className="relative" />}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            You have {unreadCount} unread messages.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-120px)] pr-4">
          {notifications.map((notif, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border ${notif.read ? "bg-white" : "bg-blue-50/50 border-blue-100"}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm">{notif.title}</h4>
                <span className="text-xs text-muted-foreground">{new Date(notif.date).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-slate-600">{notif.message}</p>
              {!notif.read && (
                <div className="mt-3 flex justify-end">
                  <Button variant="link" size="sm" className="h-auto p-0 text-blue-600">Mark as read</Button>
                </div>
              )}
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="text-center text-muted-foreground mt-10">
              No notifications yet.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
