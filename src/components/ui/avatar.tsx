// src/components/ui/avatar.tsx
"use client"
import * as React from "react"
import { cn } from "@/lib/utils" // optional, if you have a cn utility

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number
}

export function Avatar({ size = 40, className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative rounded-full bg-gray-200 flex items-center justify-center overflow-hidden",
        className
      )}
      style={{ width: size, height: size }}
    >
      {props.src ? <AvatarImage {...props} /> : <AvatarFallback />}
    </div>
  )
}

export function AvatarImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img {...props} className="w-full h-full object-cover" />
}

export function AvatarFallback({ children = "U" }: { children?: React.ReactNode }) {
  return <span className="text-gray-600 font-medium">{children}</span>
}
