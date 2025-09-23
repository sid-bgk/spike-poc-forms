import * as React from 'react'
import jsonLogic from 'json-logic-js'
import { cn } from '@/lib/utils'
import type { FormConfig as ApiFormConfig, FormField as ApiFormField, FormStep as ApiFormStep } from '../api/formConfig'
import { ConfigFormRenderer } from './ConfigFormRenderer'

type Props = {
  config: ApiFormConfig
  onSubmit: (data: Record<string, any>) => void | Promise<void>
  defaultValues?: Record<string, any>
  className?: string
}

function evaluateConditions(conditions: any[] | undefined, values: Record<string, any>): boolean {
  if (!conditions || conditions.length === 0) return true
  try {
    return conditions.every((rule) => Boolean(jsonLogic.apply(rule, values)))
  } catch {
    return true
  }
}

export function WizardFlowRenderer({ config, onSubmit, defaultValues = {}, className }: Props) {
  const [values, setValues] = React.useState<Record<string, any>>({ ...defaultValues })
  const [phase, setPhase] = React.useState<'selection' | 'questions' | 'traditional'>(() => 'selection')
  const [qIndex, setQIndex] = React.useState(0)
  const containerClass = cn('w-full max-w-5xl mx-auto space-y-6', className)

  const selectionStep: ApiFormStep | undefined = React.useMemo(
    () => config.steps.find((s: any) => (s as any).stepType === 'selection' || (s as any).phase === 'phase1'),
    [config.steps],
  )

  const selectionField: ApiFormField | undefined = React.useMemo(() => {
    if (!selectionStep) return undefined
    return selectionStep.fields?.[0]
  }, [selectionStep])

  const questionSteps: ApiFormStep[] = React.useMemo(() => {
    return config.steps
      .filter((s: any) => (s as any).stepType === 'question' || (s as any).phase === 'phase2')
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [config.steps])

  const traditionalConfig: ApiFormConfig = React.useMemo(() => {
    const steps = config.steps.filter((s: any) => (s as any).stepType === 'traditional' || (s as any).phase === 'phase3')
    return {
      ...config,
      steps,
    }
  }, [config])

  const visibleQuestionIndexes: number[] = React.useMemo(() => {
    const idxs: number[] = []
    questionSteps.forEach((step, i) => {
      const visible = evaluateConditions((step as any).conditions, values)
      if (visible) idxs.push(i)
    })
    return idxs
  }, [questionSteps, values])

  const currentQuestionStep: ApiFormStep | undefined = React.useMemo(() => {
    const actualIdx = visibleQuestionIndexes[qIndex] ?? -1
    return actualIdx >= 0 ? questionSteps[actualIdx] : undefined
  }, [qIndex, questionSteps, visibleQuestionIndexes])

  const onSelectProgram = (val: any) => {
    if (!selectionField) return
    setValues((prev) => ({ ...prev, [selectionField.name!]: val }))
    setPhase('questions')
  }

  const updateField = (name: string, val: any) => setValues((prev) => ({ ...prev, [name]: val }))

  const goNext = () => setQIndex((i) => Math.min(i + 1, Math.max(visibleQuestionIndexes.length - 1, 0)))
  const goPrev = () => setQIndex((i) => Math.max(i - 1, 0))

  const finishQuestions = () => setPhase('traditional')

  if (phase === 'selection') {
    // Render selection cards like the MULTI_FLOW selection UI
    const opts = (selectionField?.options || []) as Array<{ value: string; label: string; description?: string }>
    return (
      <div className={containerClass}>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">{config.metadata.name}</h1>
            <p className="text-muted-foreground">Select a loan program to continue</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {opts.map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => onSelectProgram(opt.value)}
                className="text-left border rounded-lg p-4 hover:border-primary transition-colors bg-card"
              >
                <div className="font-semibold">{opt.label}</div>
                {opt.description && <div className="text-sm text-muted-foreground mt-1">{opt.description}</div>}
              </button>
            ))}
          </div>
      </div>
    )
  }

  if (phase === 'questions') {
    if (!currentQuestionStep) {
      // No visible questions; jump to traditional
      return (
        <div className={containerClass}>
          <div className="mb-4 text-muted-foreground">No qualifying questions to answer.</div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded" onClick={finishQuestions}>
            Continue
          </button>
        </div>
      )
    }

    return (
      <div className={containerClass}>
          <div>
            <div className="text-sm text-muted-foreground">Question {qIndex + 1} of {visibleQuestionIndexes.length}</div>
            <h2 className="text-2xl font-semibold">{currentQuestionStep.name}</h2>
            <p className="text-muted-foreground">{currentQuestionStep.description}</p>
          </div>

          <div className="space-y-4">
            {(currentQuestionStep.fields || []).map((f) => (
              <QuestionField
                key={f.id}
                field={f}
                value={values[f.name!]}
                onChange={(v) => updateField(f.name!, v)}
                onAnswered={() => {
                  // Auto-advance on answer
                  if (qIndex < visibleQuestionIndexes.length - 1) {
                    goNext()
                  } else {
                    finishQuestions()
                  }
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button className="px-4 py-2 border rounded" onClick={goPrev} disabled={qIndex === 0}>
              Previous
            </button>
            {qIndex < visibleQuestionIndexes.length - 1 ? (
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded" onClick={goNext}>
                Next
              </button>
            ) : (
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded" onClick={finishQuestions}>
                Continue to Application
              </button>
            )}
          </div>
      </div>
    )
  }

  // Traditional phase: render remaining steps with values prefilled
  return (
    <div className={containerClass}>
      <ConfigFormRenderer config={traditionalConfig as any} onSubmit={onSubmit} defaultValues={values} className="max-w-6xl" />
    </div>
  )
}

function QuestionField({ field, value, onChange, onAnswered }: { field: ApiFormField; value: any; onChange: (v: any) => void; onAnswered?: () => void }) {
  const baseClasses = 'w-full border rounded px-3 py-2'
  const label = field.label || field.name

  if ((String(field.type).toLowerCase()) === 'options') {
    const opts = (field.options || []) as Array<{ value: string; label: string; description?: string }>
    return (
      <div>
        <div className="mb-2 font-medium">{label}</div>
        <div className="space-y-2">
          {opts.map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => {
                onChange(opt.value)
                onAnswered && onAnswered()
              }}
              className="w-full text-left border rounded-lg p-3 hover:border-primary transition-colors"
            >
              <div className="font-medium">{opt.label}</div>
              {opt.description && <div className="text-sm text-muted-foreground">{opt.description}</div>}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (field.type === 'dropdown' || (field as any).type === 'DROPDOWN') {
    const opts = (field.options || []) as Array<{ value: string; label: string }>
    return (
      <div>
        <div className="mb-2 font-medium">{label}</div>
        <select className={baseClasses} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select...</option>
          {opts.map((opt) => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (field.type === 'currency') {
    return (
      <div>
        <div className="mb-2 font-medium">{label}</div>
        <input className={baseClasses} type="number" inputMode="decimal" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      </div>
    )
  }

  // default text input
  return (
    <div>
      <div className="mb-2 font-medium">{label}</div>
      <input className={baseClasses} type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
