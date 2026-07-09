'use client'

import Image from 'next/image'

import { cn } from '@/lib/utils'

type BrandLogoProps = {
  className?: string
  priority?: boolean
}

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/assets/sonaee-veg-logo.png"
      alt="Sonaee Veg Family Restaurant Logo"
      width={1400}
      height={600}
      priority={priority}
      className={cn('h-auto w-full object-contain', className)}
      sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 360px"
    />
  )
}
