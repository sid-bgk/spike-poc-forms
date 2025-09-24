import type { UseFormReturn } from 'react-hook-form'
import type { FormConfig, FormData, FormField, FormStep } from '../../tanstackform/types'

export interface SaveState {
  isSaving: boolean
  lastSaveTime: Date | null
  saveError: string | null
}

export interface SaveConfig {
  enabled: boolean
  saveOnStepComplete: boolean
  showSaveStatus?: boolean
  allowManualSave?: boolean
}

export interface RHFFormEngineOptions {
  config: FormConfig
  onSubmit: (data: FormData) => void | Promise<void>
  defaultValues?: Partial<FormData>
  onSave?: (stepId: string, data: FormData) => Promise<void>
}

export interface RHFFormEngine {
  methods: UseFormReturn<FormData>
  config: FormConfig
  currentStepIndex: number
  setCurrentStepIndex: (i: number) => void
  currentStep: FormStep
  totalSteps: number
  visibleFields: FormField[]

  // Visibility helpers
  isFieldVisible: (field: FormField) => boolean

  // Navigation
  canGoNext: boolean
  canGoPrevious: boolean
  next: () => Promise<void>
  previous: () => void
  goTo: (visibleIndex: number) => Promise<void>

  // Submission
  handleSubmit: (e: React.FormEvent) => void
  submit: () => void

  // Save functionality
  saveState: SaveState
  saveStepData: (stepId: string, stepData: FormData) => Promise<void>

  // AutoTrigger functionality
  handleAutoTrigger: (sourceField: string, sourceValue: any, targetField: string, targetValue: any) => void

  // Derived props for a generic step navigation UI
  stepNavigationProps: {
    currentStep: number
    totalSteps: number
    canGoNext: boolean
    canGoPrevious: boolean
    onNext: () => void | Promise<void>
    onPrevious: () => void
    onStepClick: (i: number) => void | Promise<void>
    steps: FormStep[]
    isSubmitting: boolean
    isSaving: boolean
    onSubmit?: () => void
  }
}

export type { FormConfig, FormData, FormField, FormStep }
