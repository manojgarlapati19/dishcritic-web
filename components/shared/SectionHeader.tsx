'use client'

import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
  align?: 'left' | 'center'
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className,
  align = 'left',
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6',
        align === 'center' && 'sm:flex-col sm:items-center text-center',
        className
      )}
    >
      <div>
        <h2 className="text-2xl font-bold text-ink">{title}</h2>
        {subtitle && (
          <p className="text-brown-muted mt-1 text-sm">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
