import * as React from "react"
import { Button } from "@/components/ui/button"
import { FormField } from "./FormField"
import { VerticalStepList } from "./VerticalStepList"
import { SaveStatusIndicator } from "./SaveStatusIndicator"
import { cn } from "@/lib/utils"
import type { FormConfig, FormData } from "./types"
import { useConfigFormEngine } from './engine/useConfigFormEngine'

interface VerticalConfigFormRendererProps {
  config: FormConfig
  onSubmit: (data: FormData) => void | Promise<void>
  defaultValues?: Partial<FormData>
  className?: string
}

export function VerticalConfigFormRenderer({
  config,
  onSubmit,
  defaultValues = {},
  className
}: VerticalConfigFormRendererProps) {
  const renderCountRef = React.useRef(0)
  renderCountRef.current += 1
  const engine = useConfigFormEngine({ config, onSubmit, defaultValues })
  const { form, currentStep, totalSteps, handleSubmit } = engine

  // Show save UI only if enabled in config
  const showSaveUI = config.saveConfig?.enabled

  return (
    <div className={cn("w-full max-w-6xl mx-auto space-y-6", className)}>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">{config.metadata.name}</h1>
        <p className="text-muted-foreground">
          Step {engine.stepNavigationProps.currentStep + 1} of {totalSteps}: {currentStep.name}
        </p>
        <p className="text-xs text-muted-foreground">Renders: {renderCountRef.current}</p>

        {/* Step Save Indicator */}
        {showSaveUI && (
          <SaveStatusIndicator
            saveState={engine.saveState}
            onManualSave={() => engine.saveStepData(currentStep.id, form.state.values)}
            showManualSave={config.saveConfig?.allowManualSave}
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
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
              {engine.visibleFields.map((field) => {
                const validator = engine.getValidatorForField(field)
                return (
                  <form.Field
                    key={field.id}
                    name={field.name}
                    validators={{ onChange: validator }}
                    children={(formField) => {
                      const manualError = engine.attemptedNext && !formField.state.meta.isTouched
                        ? engine.manualErrors.get(field.id)
                        : undefined
                      return (
                        <FormField
                          field={field}
                          value={formField.state.value}
                          onChange={formField.handleChange}
                          onBlur={formField.handleBlur}
                          error={formField.state.meta.errors?.[0] || manualError}
                          isValidating={formField.state.meta.isValidating}
                        />
                      )
                    }}
                  />
                )
              })}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={engine.previous}
              disabled={!engine.canGoPrevious || form.state.isSubmitting}
            >
              Previous
            </Button>

            {engine.stepNavigationProps.currentStep < totalSteps - 1 ? (
              <Button
                type="button"
                onClick={engine.next}
                disabled={!engine.canGoNext || form.state.isSubmitting}
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={engine.submit}
                disabled={!engine.canGoNext || form.state.isSubmitting}
              >
                {form.state.isSubmitting ? "Submitting..." : "Submit"}
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
                  values: form.state.values,
                  errors: form.state.errors,
                  isValid: form.state.isValid,
                  canSubmit: form.state.canSubmit,
                },
                  null,
                  2
                )}
              </pre>
            </details>
          )}
        </section>
      </form>
    </div>
  )
}
