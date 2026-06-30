import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'surface-field placeholder:text-muted-foreground flex min-h-28 w-full rounded-2xl px-4 py-3 text-base leading-6 transition-[color,box-shadow,border-color,background-color] duration-300 outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:shadow-glow focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
