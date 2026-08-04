import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusVariant = "success" | "warning" | "destructive" | "default" | "outline" | "secondary" | "info"

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: string
  variant?: StatusVariant
}

export function StatusBadge({ status, className, variant, ...props }: StatusBadgeProps) {
  let mappedVariant = variant
  let customClass = ""

  if (!mappedVariant) {
    const lower = status.toLowerCase()
    if (lower === "active" || lower === "completed" || lower === "accepted" || lower === "ready for dispatch") {
      mappedVariant = "success"
      customClass = "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200"
    } else if (lower === "pending" || lower === "preparing" || lower === "draft") {
      mappedVariant = "warning"
      customClass = "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"
    } else if (lower === "out of stock" || lower === "cancelled" || lower === "rejected") {
      mappedVariant = "destructive"
    } else {
      mappedVariant = "secondary"
    }
  }

  return (
    <Badge 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      variant={mappedVariant as any} 
      className={cn("whitespace-nowrap font-medium", customClass, className)} 
      {...props}
    >
      {status}
    </Badge>
  )
}
