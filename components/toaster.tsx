"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider, // This is the Radix UI ToastProvider
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast" // This is your custom useToast hook

export function Toaster() {
  const { toasts } = useToast() // Get the toasts managed by your custom hook

  return (
    <ToastProvider>
      {" "}
      {/* Use the Radix UI ToastProvider */}
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport /> {/* Use the Radix UI ToastViewport */}
    </ToastProvider>
  )
}
