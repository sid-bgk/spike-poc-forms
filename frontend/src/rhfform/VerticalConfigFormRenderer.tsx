import * as React from 'react'
import { FormProvider } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { RHFFormField } from './RHFFormField'
import { VerticalStepList } from './VerticalStepList'
import { cn } from '@/lib/utils'
import type { FormConfig, FormData } from '../tanstackform/types'
import { useRHFConfigFormEngine } from './engine/useRHFConfigFormEngine'

export interface VerticalConfigFormRendererProps {
  config: FormConfig
  onSubmit: (data: FormData) => void | Promise<void>
  defaultValues?: Partial<FormData>
  className?: string
}

export function VerticalConfigFormRenderer({
  config,
  onSubmit,
  defaultValues = {},
  className,
}: VerticalConfigFormRendererProps) {
  const renderCountRef = React.useRef(0)
  renderCountRef.current += 1
  const engine = useRHFConfigFormEngine({ config, onSubmit, defaultValues })
  const { methods, currentStep, totalSteps } = engine

  return (
    <div className={cn('w-full max-w-6xl mx-auto space-y-6', className)}>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">{config.metadata.name}</h1>
        <p className="text-muted-foreground">
          Step {engine.stepNavigationProps.currentStep + 1} of {totalSteps}: {currentStep.name}
        </p>
        <p className="text-xs text-muted-foreground">Renders: {renderCountRef.current}</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={engine.handleSubmit} className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 md:col-span-4">
            <div className="bg-card rounded-lg border p-4 sticky top-4">
              <VerticalStepList
                currentStep={engine.stepNavigationProps.currentStep}
                steps={engine.stepNavigationProps.steps}
                onStepClick={engine.goTo}
              />
            </div>
          </aside>

          <section className="col-span-12 md:col-span-8 space-y-6">
            <div className="bg-card rounded-lg border p-6 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{currentStep.name}</h2>
                <p className="text-muted-foreground">{currentStep.description}</p>
              </div>

              <div className="grid grid-cols-12 gap-4">
                {engine.visibleFields.map((field) => (
                  <RHFFormField key={field.id} field={field} onAutoTrigger={engine.handleAutoTrigger} />
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={engine.previous}
                disabled={!engine.canGoPrevious || methods.formState.isSubmitting}
              >
                Previous
              </Button>

              {engine.stepNavigationProps.currentStep < totalSteps - 1 ? (
                <Button
                  type="button"
                  onClick={engine.next}
                  disabled={!engine.canGoNext || methods.formState.isSubmitting}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={engine.submit}
                  disabled={!engine.canGoNext || methods.formState.isSubmitting}
                >
                  {methods.formState.isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              )}
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="bg-muted p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold">Debug: Form State</summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {JSON.stringify(
                    {
                      renderCount: renderCountRef.current,
                      currentStep: engine.stepNavigationProps.currentStep,
                      values: methods.getValues(),
                      errors: simplifyErrors(methods.formState.errors as any),
                      isValid: methods.formState.isValid,
                      isSubmitting: methods.formState.isSubmitting,
                    },
                    null,
                    2,
                  )}
                </pre>
              </details>
            )}
          </section>
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