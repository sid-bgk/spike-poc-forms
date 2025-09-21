export interface FormField {
  id: string
  name: string
  type: 'text' | 'email' | 'phone' | 'date' | 'currency' | 'radio' | 'checkbox' | 'dropdown' | 'textarea'
  label: string
  required: boolean
  placeholder?: string
  helpText?: string
  validation?: Array<string | { [key: string]: any }>
  conditions?: any[]
  options?: Array<{
    value: string
    label: string
    description?: string
  }>
  dependencies?: string[]
  grid: {
    xs: number
    sm?: number
    md?: number
    lg?: number
  }
}

export interface FormStep {
  id: string
  name: string
  description: string
  order: number
  conditions?: any[]
  fields: FormField[]
}

export interface FormConfig {
  metadata: {
    id: string
    name: string
    formType: string
  }
  steps: FormStep[]
}

export interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  canGoNext: boolean
  canGoPrevious: boolean
  onNext: () => void
  onPrevious: () => void
  onStepClick: (stepIndex: number) => void
  steps: FormStep[]
  isSubmitting?: boolean
}

export interface FormFieldProps {
  field: FormField
  value: any
  onChange: (value: any) => void
  onBlur: () => void
  error?: string
  isValidating?: boolean
}

export type FormData = Record<string, any>
