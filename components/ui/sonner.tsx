"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      richColors
      expand
      visibleToasts={4}
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-primary" />
        ),
        info: (
          <InfoIcon className="size-4 text-primary" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-yellow-500" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-destructive" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-primary" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast group border border-border/90 bg-card/95 text-foreground shadow-[6px_6px_0px_0px_hsl(var(--muted))] rounded-none data-[mounted=true]:animate-in data-[mounted=true]:fade-in data-[mounted=true]:slide-in-from-right-4 data-[mounted=false]:animate-out data-[mounted=false]:fade-out data-[mounted=false]:slide-out-to-right-4",
          title: "text-xs uppercase tracking-wide",
          description: "text-xs text-muted-foreground",
          actionButton:
            "rounded-none border border-primary/50 bg-primary/10 text-xs uppercase hover:bg-primary/20",
          cancelButton:
            "rounded-none border border-border bg-background text-xs uppercase hover:bg-muted",
          closeButton:
            "rounded-none border border-border/70 bg-background text-muted-foreground hover:text-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
