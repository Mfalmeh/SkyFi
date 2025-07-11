"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface SkyFiLogoProps {
  className?: string
  width?: number
  height?: number
  animate?: boolean
}

export default function SkyFiLogo({ className = "", width = 120, height = 40, animate = true }: SkyFiLogoProps) {
  const LogoComponent = animate ? motion.div : "div"

  return (
    <LogoComponent
      {...(animate && {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        transition: { type: "spring", stiffness: 400, damping: 17 },
      })}
      className={className}
    >
      <Image src="/skyfi-logo.png" alt="SkyFi" width={width} height={height} className="object-contain" priority />
    </LogoComponent>
  )
}
