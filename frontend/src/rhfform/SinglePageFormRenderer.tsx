import * as React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import jsonLogic from 'json-logic-js'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { RHFFormField } from './RHFFormField'
import type { FormConfig, FormData, FormStep, FormField } from '../tanstackform/types'

export interface SinglePageFormRendererProps {
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

export function SinglePageFormRenderer({
  config,
  onSubmit,
  defaultValues = {},
  className,
}: SinglePageFormRendererProps) {
  const renderCountRef = React.useRef(0)
  renderCountRef.current += 1

  // Build default values from config + incoming defaults
  const formDefaultValues = React.useMemo(() => {
    const values: FormData = { ...defaultValues }
    for (const step of config.steps) {
      for (const field of step.fields) {
        if (!(field.name in values)) {
          switch (field.type) {
            case 'checkbox':
              values[field.name] = false
              break
            case 'radio':
            case 'dropdown':
              values[field.name] = ''
              break
            case 'currency':
              values[field.name] = ''
              break
            default:
              values[field.name] = ''
              break
          }
        }
      }
    }
    return values
  }, [config.steps, defaultValues])

  const methods = useForm({
    defaultValues: formDefaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  // Watch all values for conditional logic
  const watchedValues = methods.watch()

  // Handle auto-trigger functionality
  const handleAutoTrigger = React.useCallback(
    (sourceField: string, sourceValue: any, targetField: string, targetValue: any) => {
      methods.setValue(targetField, targetValue, { shouldValidate: false, shouldDirty: true })
    },
    [methods]
  )

  const visibleSteps = React.useMemo(() => {
    return config.steps.filter((step) => evaluateConditions(step.conditions, watchedValues))
  }, [config.steps, watchedValues])

  const handleFormSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      e.stopPropagation()
      methods.handleSubmit(async (data) => {
        await onSubmit(data as FormData)
      })(e)
    },
    [methods, onSubmit]
  )

  return (
    <div className={cn('w-full max-w-6xl mx-auto space-y-6', className)}>
      <div className="space-y-1 text-center">
        <h1 className="text-3xl font-bold">{config.metadata.name}</h1>
        <p className="text-xs text-muted-foreground">Renders: {renderCountRef.current}</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleFormSubmit} className="space-y-8">
          {visibleSteps.map((step) => {
            const stepFields = step.fields.filter((field) => evaluateConditions(field.conditions, watchedValues))

            if (stepFields.length === 0) return null

            return (
              <section key={step.id} className="bg-card rounded-lg border p-6 space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">{step.name}</h2>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                <div className="grid grid-cols-12 gap-4">
                  {stepFields.map((field) => (
                    <RHFFormField key={field.id} field={field} onAutoTrigger={handleAutoTrigger} />
                  ))}
                </div>
              </section>
            )
          })}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={methods.formState.isSubmitting}
              className="px-6 py-2"
            >
              {methods.formState.isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="bg-muted p-4 rounded-lg">
              <summary className="cursor-pointer font-semibold">Debug: Form State</summary>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(
                  {
                    renderCount: renderCountRef.current,
                    values: methods.getValues(),
                    errors: simplifyErrors(methods.formState.errors as any),
                    isValid: methods.formState.isValid,
                    isSubmitting: methods.formState.isSubmitting,
                  },
                  null,
                  2
                )}
              </pre>
            </details>
          )}
        </form>
      </FormProvider>
    </div>
  )
}

function simplifyErrors(errs: any): any {
  if (!errs || typeof errs !== 'object') return errs
  const out: any = Array.isArray(errs) ? [] : {}
  for (const key of Object.keys(errs)) {
    const val = errs[key]
    if (!val) continue
    if (val.message || val.type) {
      out[key] = { message: val.message, type: val.type }
    } else if (typeof val === 'object') {
      out[key] = simplifyErrors(val)
    }
  }
  return out
}