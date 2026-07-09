import { Loader2 } from 'lucide-react'

import { BrandLogo } from '@/components/brand-logo'

type BrandSplashProps = {
  className?: string
}

export function BrandSplash({ className = '' }: BrandSplashProps) {
  return (
    <div className={`flex min-h-[55vh] items-center justify-center bg-background px-6 ${className}`}>
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-[2rem] border border-border/60 bg-card/85 px-8 py-10 text-center shadow-soft backdrop-blur-md">
        <BrandLogo className="w-[220px] sm:w-[280px]" priority />
        <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Loading your Sonaee Veg experience...</p>
      </div>
    </div>
  )
}
