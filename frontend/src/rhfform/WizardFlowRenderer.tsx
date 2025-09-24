import * as React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import jsonLogic from 'json-logic-js'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { RHFConfigFormRenderer } from './RHFConfigFormRenderer'
import type { FormConfig, FormData, FormStep, FormField } from '../tanstackform/types'

export interface WizardFlowRendererProps {
  config: FormConfig
  onSubmit: (data: FormData) => void | Promise<void>
  defaultValues?: Partial<FormData>
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

export function WizardFlowRenderer({ config, onSubmit, defaultValues = {}, className }: WizardFlowRendererProps) {
  const [values, setValues] = React.useState<Record<string, any>>({ ...defaultValues })
  const [phase, setPhase] = React.useState<'selection' | 'questions' | 'traditional'>(() => 'selection')
  const [qIndex, setQIndex] = React.useState(0)
  const containerClass = cn('w-full max-w-5xl mx-auto space-y-6', className)

  const selectionStep = React.useMemo(
    () => config.steps.find((s: any) => (s as any).stepType === 'selection' || (s as any).phase === 'phase1'),
    [config.steps]
  )

  const selectionField = React.useMemo(() => {
    if (!selectionStep) return undefined
    return selectionStep.fields?.[0]
  }, [selectionStep])

  const questionSteps = React.useMemo(() => {
    return config.steps
      .filter((s: any) => (s as any).stepType === 'question' || (s as any).phase === 'phase2')
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [config.steps])

  const traditionalConfig = React.useMemo(() => {
    const steps = config.steps.filter((s: any) => (s as any).stepType === 'traditional' || (s as any).phase === 'phase3')
    return {
      ...config,
      steps,
    }
  }, [config])

  const visibleQuestionIndexes = React.useMemo(() => {
    const idxs: number[] = []
    questionSteps.forEach((step, i) => {
      const visible = evaluateConditions((step as any).conditions, values)
      if (visible) idxs.push(i)
    })
    return idxs
  }, [questionSteps, values])

  const currentQuestionStep = React.useMemo(() => {
    const actualIdx = visibleQuestionIndexes[qIndex] ?? -1
    return actualIdx >= 0 ? questionSteps[actualIdx] : undefined
  }, [qIndex, questionSteps, visibleQuestionIndexes])

  const onSelectProgram = (val: any) => {
    if (!selectionField) return
    setValues((prev) => ({ ...prev, [selectionField.name]: val }))
    setPhase('questions')
  }

  const updateField = (name: string, val: any) => setValues((prev) => ({ ...prev, [name]: val }))

  const goNext = () => setQIndex((i) => Math.min(i + 1, Math.max(visibleQuestionIndexes.length - 1, 0)))
  const goPrev = () => setQIndex((i) => Math.max(i - 1, 0))

  const finishQuestions = () => setPhase('traditional')

  if (phase === 'selection') {
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
      return (
        <div className={containerClass}>
          <div className="mb-4 text-muted-foreground">No qualifying questions to answer.</div>
          <Button onClick={finishQuestions}>Continue</Button>
        </div>
      )
    }

    return (
      <div className={containerClass}>
        <div>
          <div className="text-sm text-muted-foreground">
            Question {qIndex + 1} of {visibleQuestionIndexes.length}
          </div>
          <h2 className="text-2xl font-semibold">{currentQuestionStep.name}</h2>
          <p className="text-muted-foreground">{currentQuestionStep.description}</p>
        </div>

        <div className="space-y-4">
          {(currentQuestionStep.fields || []).map((field) => (
            <QuestionField
              key={field.id}
              field={field}
              value={values[field.name]}
              onChange={(v) => updateField(field.name, v)}
              onAnswered={() => {
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
          <Button variant="outline" onClick={goPrev} disabled={qIndex === 0}>
            Previous
          </Button>
          {qIndex < visibleQuestionIndexes.length - 1 ? (
            <Button onClick={goNext}>Next</Button>
          ) : (
            <Button onClick={finishQuestions}>Continue to Application</Button>
          )}
        </div>
      </div>
    )
  }

  // Traditional phase: render remaining steps with values prefilled
  return (
    <div className={containerClass}>
      <RHFConfigFormRenderer config={traditionalConfig} onSubmit={onSubmit} defaultValues={values} className="max-w-6xl" />
    </div>
  )
}

interface QuestionFieldProps {
  field: FormField
  value: any
  onChange: (v: any) => void
  onAnswered?: () => void
}

function QuestionField({ field, value, onChange, onAnswered }: QuestionFieldProps) {
  const baseClasses = 'w-full border rounded px-3 py-2'
  const label = field.label || field.name
  const fieldId = `question-field-${field.id}`

  if ((field.type as any) === 'options' || field.options) {
    const opts = (field.options || []) as Array<{ value: string; label: string; description?: string }>
    return (
      <div>
        <Label className="mb-2 font-medium">{label}</Label>
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

  if (field.type === 'dropdown') {
    const opts = (field.options || []) as Array<{ value: string; label: string }>
    return (
      <div>
        <Label htmlFor={fieldId} className="mb-2 font-medium">
          {label}
        </Label>
        <Select
          id={fieldId}
          value={value ?? ''}
          onChange={(e: any) => onChange(e.target.value)}
          className={baseClasses}
        >
          <option value="">Select...</option>
          {opts.map((opt) => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>
    )
  }

  if (field.type === 'currency') {
    return (
      <div>
        <Label htmlFor={fieldId} className="mb-2 font-medium">
          {label}
        </Label>
        <Input
          id={fieldId}
          type="number"
          inputMode="decimal"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={baseClasses}
        />
      </div>
    )
  }

  // Default text input
  return (
    <div>
      <Label htmlFor={fieldId} className="mb-2 font-medium">
        {label}
      </Label>
      <Input
        id={fieldId}
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={baseClasses}
      />
    </div>
  )
}