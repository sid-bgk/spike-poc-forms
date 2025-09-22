export interface FormField {
  id: string
  name: string
  type: 'text' | 'email' | 'phone' | 'date' | 'currency' | 'radio' | 'checkbox' | 'dropdown' | 'textarea' | 'password'
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
  // Optional UI style metadata
  style?: Record<string, any>
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
    formType: 'APPLICATION_FORM' | 'MULTI_FLOW_FORM' | string
  }
  steps: FormStep[]
  flowSelection?: { step: string; field: string }
  arrayTemplates?: Record<string, {
    minCount: number
    maxCount: number
    defaultCount: number
    countField: string
    fieldTemplate: Array<{
      id: string
      type: FormField['type'] | string
      label?: string
      required?: boolean
      validation?: Array<string | { [key: string]: any }>
      grid?: FormField['grid']
      arrayIndex?: boolean
    }>
  }>
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
  onSubmit?: () => void
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
