import * as React from 'react'
import { useForm } from '@tanstack/react-form'
import { createZodFieldValidator } from '../zodValidation'
import type { FormEngine, FormEngineOptions, FormData } from './types'
import jsonLogic from 'json-logic-js'
import { useStore } from '@tanstack/react-store'
import { useNavigationEngine } from './useNavigationEngine'

export function useConfigFormEngine({ config, onSubmit, defaultValues = {} }: FormEngineOptions): FormEngine {
  const [attemptedNext, setAttemptedNext] = React.useState(false)

  // Build default values
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
            default:
              values[field.name] = ''
              break
          }
        }
      }
    }
    return values
  }, [config.steps, defaultValues])

  const form = useForm({
    defaultValues: formDefaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  // Helper: extract all referenced keys from json-logic rules
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

  // Compute the set of keys used in any conditions (steps + fields)
  const conditionKeys = React.useMemo(() => {
    const set = new Set<string>()
    for (const step of config.steps) {
      step.conditions?.forEach((r) => extractVarsFromLogic(r, set))
      for (const field of step.fields) {
        field.conditions?.forEach((r) => extractVarsFromLogic(r, set))
      }
    }
    return set
  }, [config.steps, extractVarsFromLogic])

  // Subscribe only to the condition keys; re-render when any of them changes
  const conditionKeySignature = useStore(form.store, (s) => {
    const pairs = Array.from(conditionKeys).map((k) => [k, (s.values as any)[k]])
    return JSON.stringify(pairs)
  })

  // Also subscribe to isSubmitting for UI state without re-subscribing to values
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting)

  // Helper: evaluate a list of json-logic rules (AND)
  const evaluateConditions = React.useCallback(
    (conditions: any[] | undefined, values: FormData) => {
      if (!conditions || conditions.length === 0) return true
      try {
        return conditions.every((rule) => Boolean(jsonLogic.apply(rule, values)))
      } catch (_) {
        return true
      }
    },
    [],
  )

  // Navigation engine (decoupled)
  const nav = useNavigationEngine({
    steps: config.steps,
    evaluateConditions,
    getValues: () => form.state.values as FormData,
    depsSignature: conditionKeySignature,
  })

  const currentStep = config.steps[nav.currentStepIndex]
  const totalSteps = nav.totalSteps

  // Memoized visible fields for current step
  const visibleFields = React.useMemo(() => {
    const valuesSnapshot = form.state.values as FormData
    return currentStep.fields.filter((field) => evaluateConditions(field.conditions, valuesSnapshot))
  }, [currentStep.fields, evaluateConditions, conditionKeySignature])

  // Validators per field (for current step)
  const fieldValidators = React.useMemo(
    () =>
      new Map(
        currentStep.fields.map((field) => [field.id, createZodFieldValidator(field.validation || [], field.type)] as const),
      ),
    [currentStep.fields],
  )

  const getValidatorForField = React.useCallback(
    (field) => fieldValidators.get(field.id),
    [fieldValidators],
  )

  const manualErrors = React.useMemo(() => {
    if (!attemptedNext) return new Map()
    const errors = new Map<string, string>()
    for (const field of visibleFields) {
      const validator = fieldValidators.get(field.id)
      if (validator) {
        const fieldValue = form.getFieldValue(field.name)
        const error = validator({ value: fieldValue })
        if (error) errors.set(field.id, error)
      }
    }
    return errors
  }, [attemptedNext, visibleFields, fieldValidators, form])

  const next = React.useCallback(() => {
    setAttemptedNext(true)
    let hasErrors = false
    for (const field of visibleFields) {
      if (!field.required) continue
      const fieldValue = form.getFieldValue(field.name)
      const validator = fieldValidators.get(field.id)
      const error = validator?.({ value: fieldValue })
      if (error) hasErrors = true
    }
    if (!hasErrors) {
      nav.next()
      setAttemptedNext(false)
    }
  }, [visibleFields, fieldValidators, form, nav])

  const previous = React.useCallback(() => {
    nav.previous()
  }, [nav])

  const goTo = React.useCallback((i: number) => nav.goTo(i), [nav])

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      e.stopPropagation()
      form.handleSubmit()
    },
    [form],
  )

  const stepNavigationProps = React.useMemo(
    () => ({
      currentStep: nav.stepNavigationProps.currentStep,
      totalSteps: nav.stepNavigationProps.totalSteps,
      canGoNext: nav.stepNavigationProps.canGoNext,
      canGoPrevious: nav.stepNavigationProps.canGoPrevious,
      onNext: next,
      onPrevious: previous,
      onStepClick: goTo,
      steps: nav.stepNavigationProps.steps,
      isSubmitting,
    }),
    [nav.stepNavigationProps, next, previous, goTo, isSubmitting],
  )

  const isFieldVisible = React.useCallback(
    (field) => evaluateConditions(field.conditions, form.state.values as FormData),
    [evaluateConditions, conditionKeySignature],
  )

  return {
    form,
    config,
    currentStepIndex: nav.currentStepIndex,
    setCurrentStepIndex: nav.setCurrentStepIndex,
    currentStep,
    totalSteps,
    visibleFields,
    getValidatorForField,
    attemptedNext,
    setAttemptedNext,
    manualErrors,
    canGoNext: true,
    canGoPrevious: nav.stepNavigationProps.canGoPrevious,
    next,
    previous,
    goTo,
    handleSubmit,
    isFieldVisible,
    stepNavigationProps,
  }
}
