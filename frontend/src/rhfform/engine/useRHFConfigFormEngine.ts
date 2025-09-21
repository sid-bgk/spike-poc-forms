import * as React from 'react'
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form'
import jsonLogic from 'json-logic-js'
import type { RHFFormEngine, RHFFormEngineOptions, FormData } from './types'

export function useRHFConfigFormEngine({ config, onSubmit, defaultValues = {} }: RHFFormEngineOptions): RHFFormEngine {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0)

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
  }) as UseFormReturn<FormData>

  // json-logic helpers
  const evaluateConditions = React.useCallback((conditions: any[] | undefined, values: FormData) => {
    if (!conditions || conditions.length === 0) return true
    try {
      return conditions.every((rule) => Boolean(jsonLogic.apply(rule, values)))
    } catch (_) {
      return true
    }
  }, [])

  const extractVarsFromLogic = React.useCallback((rule: any, acc: Set<string>) => {
    if (!rule || typeof rule !== 'object') return
    if (Array.isArray(rule)) {
      rule.forEach((r) => extractVarsFromLogic(r, acc))
      return
    }
    for (const [op, val] of Object.entries(rule)) {
      if (op === 'var') {
        if (typeof val === 'string') acc.add(val)
        else if (Array.isArray(val) && typeof val[0] === 'string') acc.add(val[0])
      } else if (Array.isArray(val)) {
        val.forEach((v) => extractVarsFromLogic(v as any, acc))
      } else if (val && typeof val === 'object') {
        extractVarsFromLogic(val as any, acc)
      }
    }
  }, [])

  const conditionKeys = React.useMemo(() => {
    const set = new Set<string>()
    for (const step of config.steps) {
      step.conditions?.forEach((r) => extractVarsFromLogic(r, set))
      for (const field of step.fields) {
        field.conditions?.forEach((r) => extractVarsFromLogic(r, set))
      }
    }
    return Array.from(set)
  }, [config.steps, extractVarsFromLogic])

  // Subscribe only to condition-driving values; use to trigger recompute
  const _watchedConditionValues = methods.watch(conditionKeys as any)

  // Visible steps (indices into config.steps)
  const visibleStepIndices = React.useMemo(() => {
    const values = methods.getValues() as FormData
    const indices: number[] = []
    for (let i = 0; i < config.steps.length; i++) {
      const step = config.steps[i]
      if (evaluateConditions(step.conditions, values)) indices.push(i)
    }
    return indices
  }, [config.steps, _watchedConditionValues, evaluateConditions])

  const visibleSteps = React.useMemo(() => visibleStepIndices.map((i) => config.steps[i]), [visibleStepIndices, config.steps])

  // Ensure current step is visible; if not, move to nearest visible
  React.useEffect(() => {
    if (visibleStepIndices.length === 0) return
    if (!visibleStepIndices.includes(currentStepIndex)) {
      const after = visibleStepIndices.find((i) => i >= currentStepIndex)
      const target = after ?? visibleStepIndices[visibleStepIndices.length - 1]
      setCurrentStepIndex(target)
    }
  }, [visibleStepIndices, currentStepIndex])

  const currentStep = config.steps[currentStepIndex]
  const currentVisiblePos = Math.max(0, visibleStepIndices.indexOf(currentStepIndex))
  const totalSteps = visibleSteps.length

  // Visible fields for current step
  const visibleFields = React.useMemo(() => {
    const values = methods.getValues() as FormData
    return currentStep.fields.filter((f) => evaluateConditions(f.conditions, values))
  }, [currentStep.fields, _watchedConditionValues, evaluateConditions])

  // Navigation
  const next = React.useCallback(async () => {
    const names = visibleFields.map((f) => f.name)
    const isValid = await methods.trigger(names as any)
    if (isValid) {
      const pos = currentVisiblePos
      if (pos > -1 && pos < visibleStepIndices.length - 1) {
        setCurrentStepIndex(visibleStepIndices[pos + 1])
      }
    }
  }, [visibleFields, currentVisiblePos, visibleStepIndices, methods])

  const previous = React.useCallback(() => {
    const pos = currentVisiblePos
    if (pos > 0) setCurrentStepIndex(visibleStepIndices[pos - 1])
  }, [currentVisiblePos, visibleStepIndices])

  const goTo = React.useCallback(
    async (visibleIndex: number) => {
      const pos = currentVisiblePos
      const targetRealIndex = visibleStepIndices[visibleIndex]
      if (visibleIndex <= pos) {
        setCurrentStepIndex(targetRealIndex)
      } else {
        const names = visibleFields.map((f) => f.name)
        const isValid = await methods.trigger(names as any)
        if (isValid) setCurrentStepIndex(targetRealIndex)
      }
    },
    [currentVisiblePos, visibleFields, visibleStepIndices, methods],
  )

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      e.stopPropagation()
      methods.handleSubmit(async (data) => {
        await onSubmit(data as FormData)
      })(e)
    },
    [methods, onSubmit],
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
      isSubmitting: methods.formState.isSubmitting,
    }),
    [currentVisiblePos, totalSteps, next, previous, goTo, visibleSteps, methods.formState.isSubmitting],
  )

  const isFieldVisible = React.useCallback(
    (field) => evaluateConditions(field.conditions, methods.getValues() as FormData),
    [evaluateConditions, _watchedConditionValues, methods],
  )

  return {
    methods,
    config,
    currentStepIndex,
    setCurrentStepIndex,
    currentStep,
    totalSteps,
    visibleFields,
    isFieldVisible,
    canGoNext: true,
    canGoPrevious: currentVisiblePos > 0,
    next,
    previous,
    goTo,
    handleSubmit,
    stepNavigationProps,
  }
}

