"use client"

import { useFormCache } from '@/lib/hooks/use-form-cache'

interface WithCacheProps {
  step: number
  children: React.ReactNode
}

export function WithCache({ step, children }: WithCacheProps) {
  const { hasStepData } = useFormCache(step)

  return (
    <div className="relative">
      {children}
      
      {/* Optional: Show a small indicator for cached data */}
      {hasStepData && (
        <div className="absolute -top-2 -right-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" 
               title="Data loaded from cache" />
        </div>
      )}
    </div>
  )
} 