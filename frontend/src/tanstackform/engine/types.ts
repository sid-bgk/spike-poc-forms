import type { FormApi } from '@tanstack/react-form'
import type { FormConfig, FormData, FormField, FormStep } from '../types'

export interface FormEngineOptions {
  config: FormConfig
  onSubmit: (data: FormData) => void | Promise<void>
  defaultValues?: Partial<FormData>
}

export interface FieldRenderState {
  value: any
  onChange: (value: any) => void
  onBlur: () => void
  error?: string
  isValidating?: boolean
}

export interface FormEngine {
  form: FormApi<FormData>
  config: FormConfig
  currentStepIndex: number
  setCurrentStepIndex: (i: number) => void
  currentStep: FormStep
  totalSteps: number
  visibleFields: FormField[]

  // Validation helpers
  getValidatorForField: (field: FormField) => ((ctx: { value: any }) => string | undefined) | undefined
  attemptedNext: boolean
  setAttemptedNext: (v: boolean) => void
  manualErrors: Map<string, string>

  // Navigation
  canGoNext: boolean
  canGoPrevious: boolean
  next: () => void
  previous: () => void
  goTo: (stepIndex: number) => void

  // Submission
  handleSubmit: (e: React.FormEvent) => void
  submit: () => void

  // Visibility helpers
  isFieldVisible: (field: FormField) => boolean

  // Derived props for a generic step navigation UI
  stepNavigationProps: {
    currentStep: number
    totalSteps: number
    canGoNext: boolean
    canGoPrevious: boolean
    onNext: () => void
    onPrevious: () => void
    onStepClick: (i: number) => void
    steps: FormStep[]
    isSubmitting: boolean
    onSubmit?: () => void
  }
}

export type { FormConfig, FormData, FormField, FormStep }
