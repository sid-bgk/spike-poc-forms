export interface FormField {
  id: string
  name: string
  type: string
  label?: string
  text?: string
  required?: boolean
  placeholder?: string
  helpText?: string
  validation?: any[]
  grid?: { xs: number; sm?: number; md?: number; lg?: number }
  options?: Array<{
    value: string
    label: string
    description?: string
  }>
  dependencies?: string[]
  conditions?: any[]
  style?: Record<string, any>
}

export interface FormStep {
  id: string
  name: string
  description: string
  order: number
  required?: boolean
  conditions?: any[]
  fields: FormField[]
}

export interface FormConfig {
  metadata: {
    id: string
    name: string
    version?: string
    description?: string
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
      type: string
      label?: string
      required?: boolean
      validation?: any[]
      grid?: { xs: number; sm?: number; md?: number; lg?: number }
      arrayIndex?: boolean
    }>
  }>
  navigation?: {
    type: string
    allowBackward: boolean
    allowSkipping: boolean
    showProgress: boolean
    completionRequired: boolean
  }
  validation?: {
    globalRules?: any[]
  }
  transformations?: {
    inbound: Record<string, string>
    outbound: Record<string, string>
  }
}

export async function fetchFormConfig(formId: string): Promise<FormConfig> {
  const response = await fetch(`http://localhost:3001/api/forms/${formId}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch form config: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()

  if (!result.success) {
    throw new Error('API returned error: ' + (result.error || 'Unknown error'))
  }

  return result.data
}
