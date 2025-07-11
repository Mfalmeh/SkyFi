"use client"

import { Button } from "@/components/ui/button"
import LoadingSpinner from "@/components/loading-spinner"
import { motion } from "framer-motion"
import type { ButtonProps } from "@/components/ui/button"

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
  loadingText?: string
}

export default function LoadingButton({
  children,
  loading = false,
  loadingText,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <motion.div whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}>
      <Button disabled={disabled || loading} {...props}>
        {loading && <LoadingSpinner size="sm" className="mr-2" />}
        {loading ? loadingText || "Loading..." : children}
      </Button>
    </motion.div>
  )
}
