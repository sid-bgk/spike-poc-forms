import * as React from 'react'
import jsonLogic from 'json-logic-js'
import { cn } from '@/lib/utils'
import type { FormConfig as ApiFormConfig, FormStep as ApiFormStep, FormField as ApiFormField } from '../api/formConfig'
import { useConfigFormEngine } from './engine/useConfigFormEngine'
import { FormField } from './FormField'
import { createZodFieldValidator } from './zodValidation'

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

export function SinglePageFormRenderer({ config, onSubmit, defaultValues = {}, className }: Props) {
  const renderCountRef = React.useRef(0)
  renderCountRef.current += 1
  const engine = useConfigFormEngine({ config: config as any, onSubmit, defaultValues })
  const { form } = engine

  const containerClass = cn('w-full max-w-6xl mx-auto space-y-6', className)

  const visibleSteps: ApiFormStep[] = React.useMemo(() => {
    const values = form.state.values as Record<string, any>
    return (config.steps || []).filter((s) => evaluateConditions((s as any).conditions, values))
  }, [config.steps, form.state.values])

  return (
    <div className={containerClass}>
      <div className="space-y-1 text-center">
        <h1 className="text-3xl font-bold">{config.metadata.name}</h1>
        {config.metadata.description && (
          <p className="text-muted-foreground">{config.metadata.description}</p>
        )}
        <p className="text-xs text-muted-foreground">Renders: {renderCountRef.current}</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form.handleSubmit(); }} className="space-y-8">
        {visibleSteps.map((step) => {
          const stepFields = (step.fields || []).filter((f) => evaluateConditions((f as any).conditions, form.state.values as any))
          return (
            <section key={step.id} className="bg-card rounded-lg border p-6 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">{step.name}</h2>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              <div className="grid grid-cols-12 gap-4">
                {stepFields.map((field: ApiFormField) => {
                  const validator = createZodFieldValidator((field as any).validation || [], (field as any).type)
                  return (
                    <form.Field
                      key={field.id}
                      name={field.name!}
                      validators={{ onChange: validator }}
                    >
                      {(formField) => (
                        <FormField
                          field={field as any}
                          value={formField.state.value}
                          onChange={formField.handleChange}
                          onBlur={formField.handleBlur}
                          error={formField.state.meta.errors?.[0]}
                          isValidating={formField.state.meta.isValidating}
                        />
                      )}
                    </form.Field>
                  )
                })}
              </div>
            </section>
          )
        })}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => void form.handleSubmit()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
            disabled={form.state.isSubmitting}
          >
            {form.state.isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}

