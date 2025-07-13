import type { FormValues } from '@/components/multi-step-form'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FormCacheState {
  // Form data for each step
  stepData: {
    [key: number]: Partial<FormValues>
  }
  
  // Current step
  currentStep: number
  
  // Form completion status
  isCompleted: boolean
  
  // Last saved timestamp
  lastSaved: string | null
  
  // Actions
  saveStepData: (step: number, data: Partial<FormValues>) => void
  getStepData: (step: number) => Partial<FormValues> | null
  getAllStepData: () => FormValues
  setCurrentStep: (step: number) => void
  clearCache: () => void
  markAsCompleted: () => void
  isStepCompleted: (step: number) => boolean
}

export const useFormCacheStore = create<FormCacheState>()(
  persist(
    (set, get) => ({
      stepData: {},
      currentStep: 0,
      isCompleted: false,
      lastSaved: null,

      saveStepData: (step: number, data: Partial<FormValues>) => {
        set((state) => ({
          stepData: {
            ...state.stepData,
            [step]: { ...state.stepData[step], ...data }
          },
          lastSaved: new Date().toISOString()
        }))
      },

      getStepData: (step: number) => {
        const state = get()
        return state.stepData[step] || null
      },

      getAllStepData: () => {
        const state = get()
        const allData: FormValues = {
          first_name: "",
          last_name: "",
          email: "",
          role: "candidate" as const,
          skills: [],
          education: [],
          phone_number: "",
          github_link: "",
          linkedin_link: "",
        }

        // Merge all step data
        Object.values(state.stepData).forEach(stepData => {
          Object.assign(allData, stepData)
        })

        return allData
      },

      setCurrentStep: (step: number) => {
        set({ currentStep: step })
      },

      clearCache: () => {
        set({
          stepData: {},
          currentStep: 0,
          isCompleted: false,
          lastSaved: null
        })
      },

      markAsCompleted: () => {
        set({ isCompleted: true })
      },

      isStepCompleted: (step: number) => {
        const state = get()
        return !!state.stepData[step]
      }
    }),
    {
      name: 'form-cache-storage'
    }
  )
) 