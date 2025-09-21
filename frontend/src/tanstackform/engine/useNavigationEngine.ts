import * as React from 'react'
import type { FormStep, FormData } from '../types'

interface NavigationEngineOptions {
  steps: FormStep[]
  // Evaluates a conditions array against values
  evaluateConditions: (conditions: any[] | undefined, values: FormData) => boolean
  // Returns the latest values snapshot
  getValues: () => FormData
  // A minimal dependency token to recompute visibility when relevant values change
  depsSignature: unknown
  // Future: navigation policies
  allowBackward?: boolean
}

export interface NavigationEngine {
  // Index in original steps array
  currentStepIndex: number
  setCurrentStepIndex: (i: number) => void
  // Visible steps and mapping
  visibleStepIndices: number[]
  visibleSteps: FormStep[]
  currentVisiblePos: number
  totalSteps: number

  // Navigation
  next: () => void
  previous: () => void
  goTo: (visibleIndex: number) => void

  // Derived UI props
  stepNavigationProps: {
    currentStep: number
    totalSteps: number
    canGoNext: boolean
    canGoPrevious: boolean
    onNext: () => void
    onPrevious: () => void
    onStepClick: (i: number) => void
    steps: FormStep[]
    isSubmitting: boolean
  }
}

export function useNavigationEngine({
  steps,
  evaluateConditions,
  getValues,
  depsSignature,
  allowBackward = true,
}: NavigationEngineOptions): NavigationEngine {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0)

  // Compute visible steps based on latest values; recompute when depsSignature changes
  const visibleStepIndices = React.useMemo(() => {
    const values = getValues()
    const indices: number[] = []
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      if (evaluateConditions(step.conditions, values)) indices.push(i)
    }
    return indices
  }, [steps, depsSignature, evaluateConditions, getValues])

  const visibleSteps = React.useMemo(() => visibleStepIndices.map((i) => steps[i]), [visibleStepIndices, steps])

  // Keep current real index within visible set
  React.useEffect(() => {
    if (visibleStepIndices.length === 0) return
    if (!visibleStepIndices.includes(currentStepIndex)) {
      const after = visibleStepIndices.find((i) => i >= currentStepIndex)
      const target = after ?? visibleStepIndices[visibleStepIndices.length - 1]
      setCurrentStepIndex(target)
    }
  }, [visibleStepIndices, currentStepIndex])

  const currentVisiblePos = Math.max(0, visibleStepIndices.indexOf(currentStepIndex))
  const totalSteps = visibleSteps.length

  const next = React.useCallback(() => {
    const pos = currentVisiblePos
    if (pos > -1 && pos < visibleStepIndices.length - 1) {
      setCurrentStepIndex(visibleStepIndices[pos + 1])
    }
  }, [currentVisiblePos, visibleStepIndices])

  const previous = React.useCallback(() => {
    const pos = currentVisiblePos
    if (pos > 0 && allowBackward) setCurrentStepIndex(visibleStepIndices[pos - 1])
  }, [currentVisiblePos, visibleStepIndices, allowBackward])

  const goTo = React.useCallback(
    (visibleIndex: number) => {
      const pos = currentVisiblePos
      if (visibleIndex <= pos) setCurrentStepIndex(visibleStepIndices[visibleIndex])
    },
    [currentVisiblePos, visibleStepIndices],
  )

  const stepNavigationProps = React.useMemo(
    () => ({
      currentStep: currentVisiblePos,
      totalSteps,
      canGoNext: true,
      canGoPrevious: currentVisiblePos > 0,
      onNext: next,
      onPrevious: previous,
      onStepClick: goTo,
      steps: visibleSteps,
      isSubmitting: false, // caller can override when composing
    }),
    [currentVisiblePos, totalSteps, next, previous, goTo, visibleSteps],
  )

  return {
    currentStepIndex,
    setCurrentStepIndex,
    visibleStepIndices,
    visibleSteps,
    currentVisiblePos,
    totalSteps,
    next,
    previous,
    goTo,
    stepNavigationProps,
  }
}

