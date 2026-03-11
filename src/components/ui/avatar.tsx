// src/components/ui/avatar.tsx
"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Avatar({ className, children, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function AvatarImage({
  className,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      alt={alt}
      className={cn("w-full h-full object-cover", className)}
      {...props}
    />
  )
}

export function AvatarFallback({
  children = "U",
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <span className={cn("text-muted-foreground font-medium", className)}>
      {children}
    </span>
  )
}
