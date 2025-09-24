import * as React from 'react'
import { cn } from '@/lib/utils'
import type { StepNavigationProps } from '../tanstackform/types'

export function VerticalStepList({
  currentStep,
  steps,
  onStepClick,
}: Pick<StepNavigationProps, 'currentStep' | 'steps' | 'onStepClick'>) {
  return (
    <nav className="space-y-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep
        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onStepClick(index)}
            disabled={index > currentStep}
            className={cn(
              'w-full flex items-start gap-3 p-3 rounded-md border text-left transition-colors',
              isActive
                ? 'border-primary bg-primary/5'
                : isCompleted
                ? 'border-primary/40 hover:bg-primary/5'
                : 'border-muted hover:bg-muted/50'
            )}
          >
            <span
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : isCompleted
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {index + 1}
            </span>
            <span className="flex-1">
              <span className={cn('block text-sm font-medium', isActive ? 'text-foreground' : 'text-muted-foreground')}>
                {step.name}
              </span>
              <span className="block text-xs text-muted-foreground">{step.description}</span>
            </span>
          </button>
        )
      })}
    </nav>
  )
}