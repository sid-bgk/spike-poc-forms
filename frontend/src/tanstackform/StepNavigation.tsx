import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { StepNavigationProps } from "./types"

export function StepNavigation({
  currentStep,
  totalSteps,
  canGoNext,
  canGoPrevious,
  onNext,
  onPrevious,
  onStepClick,
  steps,
  isSubmitting = false,
  isSaving = false,
  onSubmit
}: StepNavigationProps) {
  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => onStepClick(index)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all",
                index === currentStep
                  ? "bg-primary text-primary-foreground"
                  : index < currentStep
                  ? "bg-primary/20 text-primary hover:bg-primary/30"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              disabled={index > currentStep}
            >
              {index + 1}
            </button>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 w-8 transition-colors",
                  index < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="grid grid-cols-3 gap-4 text-center">
        {steps.map((step, index) => (
          <div key={step.id} className="space-y-1">
            <p
              className={cn(
                "text-sm font-medium",
                index === currentStep ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.name}
            </p>
            <p className="text-xs text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious || isSubmitting || isSaving}
        >
          Previous
        </Button>

        <div className="flex space-x-2">
          {currentStep < totalSteps - 1 ? (
            <Button
              type="button"
              onClick={onNext}
              disabled={!canGoNext || isSubmitting}
              loading={isSaving}
              loadingText="Saving..."
            >
              Next
            </Button>
          ) : (
            onSubmit ? (
              <Button
                type="button"
                onClick={onSubmit}
                disabled={!canGoNext || isSubmitting || isSaving}
                loading={isSubmitting}
                loadingText="Submitting..."
              >
                Submit
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!canGoNext || isSubmitting || isSaving}
                loading={isSubmitting}
                loadingText="Submitting..."
              >
                Submit
              </Button>
            )
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  )
}
