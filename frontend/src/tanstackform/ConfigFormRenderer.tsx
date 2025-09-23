import * as React from "react"
import { FormField } from "./FormField"
import { StepNavigation } from "./StepNavigation"
import { SaveStatusIndicator } from "./SaveStatusIndicator"
import { cn } from "@/lib/utils"
import type { FormConfig, FormData } from "./types"
import { useConfigFormEngine } from './engine/useConfigFormEngine'

interface ConfigFormRendererProps {
  config: FormConfig
  onSubmit: (data: FormData) => void | Promise<void>
  defaultValues?: Partial<FormData>
  className?: string
}

export function ConfigFormRenderer({
  config,
  onSubmit,
  defaultValues = {},
  className
}: ConfigFormRendererProps) {
  const renderCountRef = React.useRef(0)
  renderCountRef.current += 1
  const engine = useConfigFormEngine({ config, onSubmit, defaultValues })
  const { form, currentStep, totalSteps, handleSubmit } = engine

  // Show save UI only if enabled in config
  const showSaveUI = config.saveConfig?.enabled

  return (
    <div className={cn("w-full max-w-4xl mx-auto space-y-8", className)}>
      {/* Form Header */}
      <div className="text-center space-y-2">
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

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Current Step Fields */}
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

        {/* Step Navigation */}
        <StepNavigation {...engine.stepNavigationProps} />

        {/* Form State Debug (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="bg-muted p-4 rounded-lg">
            <summary className="cursor-pointer font-semibold">
              Debug: Form State
            </summary>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(
                {
                  renderCount: renderCountRef.current,
                  currentStep: engine.currentStepIndex,
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
      </form>
    </div>
  )
}
