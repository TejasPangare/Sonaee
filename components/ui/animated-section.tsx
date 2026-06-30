"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type AnimationType = "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  animation?: AnimationType
  delay?: number
  duration?: number
  as?: "div" | "section" | "article" | "aside"
}

const animationClasses: Record<AnimationType, { initial: string; visible: string }> = {
  "fade-up": {
    initial: "translate-y-6 opacity-0",
    visible: "translate-y-0 opacity-100",
  },
  "fade-in": {
    initial: "opacity-0",
    visible: "opacity-100",
  },
  "fade-left": {
    initial: "-translate-x-6 opacity-0",
    visible: "translate-x-0 opacity-100",
  },
  "fade-right": {
    initial: "translate-x-6 opacity-0",
    visible: "translate-x-0 opacity-100",
  },
  scale: {
    initial: "scale-[0.985] opacity-0",
    visible: "scale-100 opacity-100",
  },
}

export function AnimatedSection({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  duration = 700,
  as: Component = "div",
}: AnimatedSectionProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>()

  const { initial, visible } = animationClasses[animation]

  return (
    <Component
      ref={ref}
      className={cn(
        "transform-gpu transition-all motion-reduce:transform-none motion-reduce:transition-none",
        isVisible ? visible : initial,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {children}
    </Component>
  )
}
