import * as React from 'react'
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form'
import jsonLogic from 'json-logic-js'
import type { RHFFormEngine, RHFFormEngineOptions, FormData } from './types'
import type { FormConfig, FormStep, FormField } from '../../tanstackform/types'

function buildAugmentedSteps(config: FormConfig): { steps: FormStep[]; dynamicArraySteps: Map<string, { stepId: string; insertAfterIndex: number }> } {
  const resultSteps: FormStep[] = [...config.steps]
  const dynamicArraySteps = new Map<string, { stepId: string; insertAfterIndex: number }>()

  if (!config.arrayTemplates) return { steps: resultSteps, dynamicArraySteps }

  for (const [templateName] of Object.entries(config.arrayTemplates)) {
    let controllerStepIndex = -1
    outer: for (let i = 0; i < resultSteps.length; i++) {
      const step = resultSteps[i]
      for (const field of step.fields) {
        if ((field as any).arrayController === templateName) {
          controllerStepIndex = i
          break outer
        }
      }
    }
    if (controllerStepIndex >= 0) {
      const stepId = `${templateName}-details`
      const synthetic: FormStep = {
        id: stepId,
        name: templateName[0].toUpperCase() + templateName.slice(1),
        description: 'Provide details',
        order: (resultSteps[controllerStepIndex]?.order || 0) + 0.1,
        fields: [],
      }
      resultSteps.splice(controllerStepIndex + 1, 0, synthetic)
      dynamicArraySteps.set(templateName, { stepId, insertAfterIndex: controllerStepIndex })
    }
  }
  return { steps: resultSteps, dynamicArraySteps }
}

function expandArrayTemplateFields(templateName: string, config: FormConfig, values: FormData): FormField[] {
  const tpl = config.arrayTemplates?.[templateName]
  if (!tpl) return []
  const countField = tpl.countField
  const rawCount = (values as any)[countField]
  const appType = (values as any)['applicationType']
  let count = appType && appType !== 'joint' ? 1 : (typeof rawCount === 'number' ? rawCount : parseInt(String(rawCount || ''), 10))
  if (!Number.isFinite(count) || count <= 0) count = tpl.defaultCount || 1
  count = Math.max(tpl.minCount ?? 1, Math.min(tpl.maxCount ?? 99, count))

  const fields: FormField[] = []
  for (let i = 0; i < count; i++) {
    for (const base of tpl.fieldTemplate) {
      const id = `${templateName}[${i}].${base.id}`
      const name = id
      fields.push({
        id,
        name,
        type: (base.type as any) || 'text',
        label: base.label ? `${base.label}` : base.id,
        required: (base as any).required ?? true,
        validation: (base as any).validation || [],
        grid: (base as any).grid || { xs: 12 },
      } as unknown as FormField)
    }
  }
  return fields
}

export function useRHFConfigFormEngine({ config, onSubmit, defaultValues = {} }: RHFFormEngineOptions): RHFFormEngine {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0)
  const { steps: augmentedSteps, dynamicArraySteps } = React.useMemo(() => buildAugmentedSteps(config as FormConfig), [config])

  // Build default values from config + incoming defaults
  const formDefaultValues = React.useMemo(() => {
    const values: FormData = { ...defaultValues }
    for (const step of augmentedSteps) {
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
  }, [augmentedSteps, defaultValues])

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
    for (const step of augmentedSteps) {
      step.conditions?.forEach((r) => extractVarsFromLogic(r, set))
      for (const field of step.fields) {
        field.conditions?.forEach((r) => extractVarsFromLogic(r, set))
      }
    }
    if ((config as FormConfig).arrayTemplates) {
      for (const tpl of Object.values((config as FormConfig).arrayTemplates!)) {
        if (tpl.countField) set.add(tpl.countField)
      }
    }
    set.add('applicationType')
    return Array.from(set)
  }, [augmentedSteps, extractVarsFromLogic, config])

  // Subscribe only to condition-driving values; use to trigger recompute
  const _watchedConditionValues = methods.watch(conditionKeys as any)

  // Visible steps (indices into config.steps)
  const visibleStepIndices = React.useMemo(() => {
    const values = methods.getValues() as FormData
    const indices: number[] = []
    for (let i = 0; i < augmentedSteps.length; i++) {
      const step = augmentedSteps[i]
      if (evaluateConditions(step.conditions, values)) indices.push(i)
    }
    return indices
  }, [augmentedSteps, _watchedConditionValues, evaluateConditions, methods])

  const visibleSteps = React.useMemo(() => visibleStepIndices.map((i) => augmentedSteps[i]), [visibleStepIndices, augmentedSteps])

  // Ensure current step is visible; if not, move to nearest visible
  React.useEffect(() => {
    if (visibleStepIndices.length === 0) return
    if (!visibleStepIndices.includes(currentStepIndex)) {
      const after = visibleStepIndices.find((i) => i >= currentStepIndex)
      const target = after ?? visibleStepIndices[visibleStepIndices.length - 1]
      setCurrentStepIndex(target)
    }
  }, [visibleStepIndices, currentStepIndex])

  const currentStep = augmentedSteps[currentStepIndex]
  const currentVisiblePos = Math.max(0, visibleStepIndices.indexOf(currentStepIndex))
  const totalSteps = visibleSteps.length

  // Visible fields for current step
  const visibleFields = React.useMemo(() => {
    const values = methods.getValues() as FormData
    let base = currentStep.fields
    if ((config as FormConfig).arrayTemplates) {
      for (const [templateName, meta] of dynamicArraySteps.entries()) {
        if (currentStep.id === meta.stepId) {
          base = expandArrayTemplateFields(templateName, config as FormConfig, values)
          break
        }
      }
    }
    return base.filter((f) => evaluateConditions(f.conditions, values))
  }, [currentStep.id, currentStep.fields, _watchedConditionValues, evaluateConditions, config, dynamicArraySteps, methods])

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

  const submit = React.useCallback(() => {
    // Programmatic submit without relying on native form event
    void methods.handleSubmit(async (data) => {
      await onSubmit(data as FormData)
    })()
  }, [methods, onSubmit])

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
      onSubmit: submit,
    }),
    [currentVisiblePos, totalSteps, next, previous, goTo, visibleSteps, methods.formState.isSubmitting, submit],
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
    submit,
    stepNavigationProps,
  }
}
