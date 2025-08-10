import type { FormValues } from '@/components/form-steps/multi-step-form'
import { useFormCacheStore } from '@/lib/stores/form-cache-store'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

export function useFormCache(step: number) {
  const { setValue } = useFormContext<FormValues>()
  const { 
    getStepData, 
    setCurrentStep, 
    isStepCompleted,
    lastSaved 
  } = useFormCacheStore()

  // Load cached data when component mounts
  useEffect(() => {
    const cachedData = getStepData(step)
    if (cachedData) {
      Object.entries(cachedData).forEach(([key, value]) => {
        setValue(key as keyof FormValues, value)
      })
    }
  }, [step, getStepData, setValue])

  // Check if step has data
  const hasStepData = isStepCompleted(step)

  return {
    hasStepData,
    lastSaved: lastSaved ? new Date(lastSaved) : null,
    setCurrentStep
  }
} 