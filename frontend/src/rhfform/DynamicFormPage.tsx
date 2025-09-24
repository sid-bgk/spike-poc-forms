import * as React from 'react'
import { useParams, Link } from 'react-router-dom'
import jsonLogic from 'json-logic-js'
import { fetchFormConfig, submitForm } from '../api/formConfig'
import type { FormConfig as ApiFormConfig } from '../api/formConfig'
import { RHFConfigFormRenderer } from './RHFConfigFormRenderer'
import { WizardFlowRenderer } from './WizardFlowRenderer'
import { VerticalConfigFormRenderer } from './VerticalConfigFormRenderer'
import { SinglePageFormRenderer } from './SinglePageFormRenderer'

type FlowBehavior = 'linear' | 'multi-flow' | 'wizard-flow' | 'hybrid-flow' | 'single-flow'

function detectFlowBehavior(config: ApiFormConfig): FlowBehavior {
  if (!config.flowConfig) return 'linear'
  switch (config.flowConfig.type) {
    case 'single':
      return 'single-flow'
    case 'selection':
      return 'multi-flow'
    case 'wizard':
      return 'wizard-flow'
    case 'hybrid':
      return 'hybrid-flow'
    case 'linear':
    default:
      return 'linear'
  }
}

function pruneConfigByFlow(config: ApiFormConfig, selectionField: string, selectionValue: string): ApiFormConfig {
  const context: Record<string, any> = { [selectionField]: selectionValue }
  const prunedSteps = config.steps.filter((step) => {
    if (step.id === config.flowSelection?.step) return false
    if (!step.conditions || step.conditions.length === 0) return true
    try {
      return step.conditions.every((rule) => Boolean(jsonLogic.apply(rule as any, context)))
    } catch {
      // If evaluation fails, keep step conservative
      return true
    }
  })

  return {
    ...config,
    steps: prunedSteps,
  }
}

export function DynamicFormPage() {
  const { formId } = useParams<{ formId: string }>()
  const [config, setConfig] = React.useState<ApiFormConfig | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // MULTI_FLOW_FORM selection state
  const [selectedFlow, setSelectedFlow] = React.useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        if (!formId) throw new Error('Missing formId in route')
        const cfg = await fetchFormConfig(formId)
        if (!mounted) return
        setConfig(cfg)
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message || 'Failed to load form config')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [formId])

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      console.log('RHF submitting:', { formId, data })

      if (!formId) {
        throw new Error('Form ID is required for submission')
      }

      const result = await submitForm(formId, data)
      console.log('Form submission result:', result)
      alert(`Form submitted successfully! Check console for details.\nTimestamp: ${result.timestamp}`)
    } catch (error) {
      console.error('Form submission error:', error)
      alert(`Form submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="text-muted-foreground">Loading form configuration...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !config) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="text-destructive text-lg font-semibold">Error Loading Form</div>
              <p className="text-muted-foreground">{error || 'No form configuration available'}</p>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const behavior = detectFlowBehavior(config)

  if (behavior === 'linear') {
    return (
      <div className="min-h-screen bg-background p-6">
        <VerticalConfigFormRenderer config={config as any} onSubmit={handleSubmit} defaultValues={{}} className="max-w-6xl" />
      </div>
    )
  }

  if (behavior === 'multi-flow') {
    const selectionStepId = config.flowConfig?.selectionStep?.stepId || config.flowSelection?.step
    const selectionFieldName = config.flowConfig?.selectionStep?.fieldName || config.flowSelection?.field
    const selectionStep = config.steps.find((s) => s.id === selectionStepId)
    const selectionField = selectionStep?.fields.find((f) => f.name === selectionFieldName)

    if (!selectedFlow) {
      // Phase 1: flow selection cards
      const options = selectionField?.options || []
      return (
        <div className="min-h-screen bg-background p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">{config.metadata.name}</h1>
              <p className="text-muted-foreground">Select a loan program to continue</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedFlow(String(opt.value))}
                  className="text-left border rounded-lg p-4 hover:border-primary transition-colors bg-card"
                >
                  <div className="font-semibold">{opt.label}</div>
                  {opt.description && <div className="text-sm text-muted-foreground mt-1">{opt.description}</div>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    }

    // Phase 2: pruned config based on selected flow
    const pruned = selectionFieldName ? pruneConfigByFlow(config, selectionFieldName, selectedFlow) : config
    return (
      <div className="min-h-screen bg-background p-6">
        <RHFConfigFormRenderer config={pruned as any} onSubmit={handleSubmit} defaultValues={{ [selectionFieldName!]: selectedFlow }} className="max-w-6xl" />
      </div>
    )
  }

  if (behavior === 'wizard-flow') {
    return (
      <div className="min-h-screen bg-background p-6">
        <WizardFlowRenderer config={config as any} onSubmit={handleSubmit} defaultValues={{}} className="max-w-6xl" />
      </div>
    )
  }

  if (behavior === 'single-flow') {
    return (
      <div className="min-h-screen bg-background p-6">
        <SinglePageFormRenderer config={config as any} onSubmit={handleSubmit} defaultValues={{}} className="max-w-6xl" />
      </div>
    )
  }

  // Wizard/hybrid fallback to horizontal
  return (
    <div className="min-h-screen bg-background p-6">
      <RHFConfigFormRenderer config={config as any} onSubmit={handleSubmit} defaultValues={{}} className="max-w-6xl" />
    </div>
  )
}