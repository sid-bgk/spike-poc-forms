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
  // Optional metadata used by wizard flows
  stepType?: string
  phase?: string
}

export interface FlowPhase {
  id: string
  name: string
  type: 'selection' | 'wizard' | 'traditional'
  description: string
  order?: number
}

export interface FlowConfig {
  type: 'linear' | 'selection' | 'wizard' | 'hybrid' | 'single'
  navigation?: 'stepped' | 'wizard' | 'free-form' | 'sections' | string
  selectionStep?: {
    stepId: string
    fieldName: string
  }
  phases?: FlowPhase[]
}

export interface FormConfig {
  metadata: {
    id: string
    name: string
    version?: string
    description?: string
  }
  // New unified flow configuration (preferred)
  flowConfig?: FlowConfig
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
  validation?: {
    globalRules?: any[]
  }
  transformations?: {
    inbound: Record<string, string>
    outbound: Record<string, string>
  }
}

export interface FormMetadataSummary {
  id: string
  name: string
  description?: string
  version?: string
  flowConfig?: { type?: string; navigation?: string }
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

export async function fetchAllForms(): Promise<FormMetadataSummary[]> {
  const response = await fetch('http://localhost:3001/api/forms')
  if (!response.ok) {
    throw new Error(`Failed to fetch forms: ${response.status} ${response.statusText}`)
  }
  const result = await response.json()
  if (!result.success) {
    throw new Error('API returned error: ' + (result.error || 'Unknown error'))
  }
  return result.data as FormMetadataSummary[]
}

export async function submitForm(formId: string, formData: Record<string, any>): Promise<{ success: boolean; message: string; timestamp: string }> {
  const response = await fetch(`http://localhost:3001/api/forms/${formId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })

  if (!response.ok) {
    throw new Error(`Failed to submit form: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()

  if (!result.success) {
    throw new Error('API returned error: ' + (result.error || 'Unknown error'))
  }

  return result
}
