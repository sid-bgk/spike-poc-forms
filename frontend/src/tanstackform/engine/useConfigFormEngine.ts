import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { createZodFieldValidator } from "../zodValidation";
import type {
  FormEngine,
  FormEngineOptions,
  FormData,
  FormStep,
  FormField,
  FormConfig,
  SaveState,
} from "./types";
import jsonLogic from "json-logic-js";
import { useStore } from "@tanstack/react-store";
import { useNavigationEngine } from "./useNavigationEngine";

function buildAugmentedSteps(config: FormConfig): {
  steps: FormStep[];
  dynamicArraySteps: Map<string, { stepId: string; insertAfterIndex: number }>;
} {
  const resultSteps: FormStep[] = [...config.steps];
  const dynamicArraySteps = new Map<
    string,
    { stepId: string; insertAfterIndex: number }
  >();

  if (!config.arrayTemplates) {
    return { steps: resultSteps, dynamicArraySteps };
  }

  for (const [templateName] of Object.entries(config.arrayTemplates)) {
    // Find controller field and its step
    let controllerStepIndex = -1;
    let controllerFound = false;
    for (let i = 0; i < resultSteps.length; i++) {
      const step = resultSteps[i];
      for (const field of step.fields) {
        if ((field as any).arrayController === templateName) {
          controllerStepIndex = i;
          controllerFound = true;
          break;
        }
      }
      if (controllerFound) break;
    }

    if (controllerStepIndex >= 0) {
      const stepId = `${templateName}-details`;
      const syntheticStep: FormStep = {
        id: stepId,
        name: templateName[0].toUpperCase() + templateName.slice(1),
        description: "Provide details",
        order: (resultSteps[controllerStepIndex]?.order || 0) + 0.1,
        fields: [],
      };
      resultSteps.splice(controllerStepIndex + 1, 0, syntheticStep);
      dynamicArraySteps.set(templateName, {
        stepId,
        insertAfterIndex: controllerStepIndex,
      });
    }
  }

  return { steps: resultSteps, dynamicArraySteps };
}

function expandArrayTemplateFields(
  templateName: string,
  config: FormConfig,
  values: FormData
): FormField[] {
  const tpl = config.arrayTemplates?.[templateName];
  if (!tpl) return [];

  const countField = tpl.countField;
  const rawCount = (values as any)[countField];
  const appType = (values as any)["applicationType"];
  let count =
    appType && appType !== "joint"
      ? 1
      : typeof rawCount === "number"
      ? rawCount
      : parseInt(String(rawCount || ""), 10);
  if (!Number.isFinite(count) || count <= 0) count = tpl.defaultCount || 1;
  count = Math.max(tpl.minCount ?? 1, Math.min(tpl.maxCount ?? 99, count));

  const fields: FormField[] = [];
  for (let i = 0; i < count; i++) {
    for (const base of tpl.fieldTemplate) {
      const id = `${templateName}[${i}].${base.id}`;
      const name = id;
      fields.push({
        id,
        name,
        type: (base.type as any) || "text",
        label: base.label ? `${base.label}` : base.id,
        required: base.required ?? true,
        validation: (base.validation as any) || [],
        grid: base.grid || { xs: 12 },
      } as unknown as FormField);
    }
  }
  return fields;
}

export function useConfigFormEngine({
  config,
  onSubmit,
  defaultValues = {},
}: FormEngineOptions): FormEngine {
  const [attemptedNext, setAttemptedNext] = React.useState(false);

  // Step save state management
  const [saveState, setSaveState] = React.useState<SaveState>({
    isSaving: false,
    lastSaveTime: null,
    saveError: null,
  });

  // Build augmented steps (dynamic array steps insertion)
  const { steps: augmentedSteps, dynamicArraySteps } = React.useMemo(
    () => buildAugmentedSteps(config as FormConfig),
    [config]
  );

  // Build default values
  const formDefaultValues = React.useMemo(() => {
    const values: FormData = { ...defaultValues };
    for (const step of augmentedSteps) {
      for (const field of step.fields) {
        if (!(field.name in values)) {
          switch (field.type) {
            case "checkbox":
              values[field.name] = false;
              break;
            case "radio":
            case "dropdown":
              values[field.name] = "";
              break;
            default:
              values[field.name] = "";
              break;
          }
        }
      }
    }
    return values;
  }, [augmentedSteps, defaultValues]);

  const form = useForm({
    defaultValues: formDefaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  // Step save functionality (only if enabled in config)
  const stepSaveEnabled = config.saveConfig?.enabled;

  const saveStepData = React.useCallback(
    async (stepId: string, stepData: FormData): Promise<void> => {
      if (!stepSaveEnabled) return;

      setSaveState((prev) => ({ ...prev, isSaving: true, saveError: null }));

      try {
        const response = await fetch(
          `http://localhost:3001/api/forms/${config.metadata.id}/save-progress`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              stepId,
              data: stepData,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();

          if (response.status === 400 && errorData.validationErrors) {
            // Backend validation failed - show field-level errors but don't block
            console.warn("Save validation failed:", errorData.validationErrors);
            setSaveState((prev) => ({
              ...prev,
              isSaving: false,
              saveError: "Some fields need attention, but you can continue.",
            }));
          } else {
            throw new Error(errorData.error || "Save failed");
          }
        } else {
          // Success
          setSaveState((prev) => ({
            ...prev,
            isSaving: false,
            lastSaveTime: new Date(),
            saveError: null,
          }));
        }
      } catch (error) {
        // Network/server errors
        setSaveState((prev) => ({
          ...prev,
          isSaving: false,
          saveError: error instanceof Error ? error.message : "Save failed",
        }));
      }
    },
    [stepSaveEnabled, config.metadata.id]
  );

  // Helper: extract all referenced keys from json-logic rules
  const extractVarsFromLogic = React.useCallback(
    (rule: any, acc: Set<string>) => {
      if (!rule || typeof rule !== "object") return;
      if (Array.isArray(rule)) {
        rule.forEach((r) => extractVarsFromLogic(r, acc));
        return;
      }
      for (const [op, val] of Object.entries(rule)) {
        if (op === "var") {
          if (typeof val === "string") acc.add(val);
          else if (Array.isArray(val) && typeof val[0] === "string")
            acc.add(val[0]);
        } else if (Array.isArray(val)) {
          val.forEach((v) => extractVarsFromLogic(v as any, acc));
        } else if (val && typeof val === "object") {
          extractVarsFromLogic(val as any, acc);
        }
      }
    },
    []
  );

  // Compute the set of keys used in any conditions (steps + fields)
  const conditionKeys = React.useMemo(() => {
    const set = new Set<string>();
    for (const step of augmentedSteps) {
      step.conditions?.forEach((r) => extractVarsFromLogic(r, set));
      for (const field of step.fields) {
        field.conditions?.forEach((r) => extractVarsFromLogic(r, set));
      }
    }
    // Include arrayTemplates countFields and applicationType if present
    if ((config as FormConfig).arrayTemplates) {
      for (const tpl of Object.values((config as FormConfig).arrayTemplates!)) {
        if (tpl.countField) set.add(tpl.countField);
      }
    }
    set.add("applicationType");
    return set;
  }, [augmentedSteps, extractVarsFromLogic, config]);

  // Subscribe only to the condition keys; re-render when any of them changes
  const conditionKeySignature = useStore(form.store, (s) => {
    const pairs = Array.from(conditionKeys).map((k) => [
      k,
      (s.values as any)[k],
    ]);
    return JSON.stringify(pairs);
  });

  // Also subscribe to isSubmitting for UI state without re-subscribing to values
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  // Helper: evaluate a list of json-logic rules (AND)
  const evaluateConditions = React.useCallback(
    (conditions: any[] | undefined, values: FormData) => {
      if (!conditions || conditions.length === 0) return true;
      try {
        return conditions.every((rule) =>
          Boolean(jsonLogic.apply(rule, values))
        );
      } catch (_) {
        return true;
      }
    },
    []
  );

  // Navigation engine (decoupled)
  const nav = useNavigationEngine({
    steps: augmentedSteps,
    evaluateConditions,
    getValues: () => form.state.values as FormData,
    depsSignature: conditionKeySignature,
  });

  const currentStep = augmentedSteps[nav.currentStepIndex];
  const totalSteps = nav.totalSteps;

  // Memoized visible fields for current step
  const visibleFields = React.useMemo(() => {
    const valuesSnapshot = form.state.values as FormData;
    // Dynamic array step expansion
    let baseFields = currentStep.fields;
    // If this step is one of the dynamic array steps, expand from template
    if ((config as FormConfig).arrayTemplates) {
      for (const [templateName, meta] of dynamicArraySteps.entries()) {
        if (currentStep.id === meta.stepId) {
          baseFields = expandArrayTemplateFields(
            templateName,
            config as FormConfig,
            valuesSnapshot
          );
          break;
        }
      }
    }
    return baseFields.filter((field) =>
      evaluateConditions(field.conditions, valuesSnapshot)
    );
  }, [
    currentStep.id,
    currentStep.fields,
    evaluateConditions,
    conditionKeySignature,
    dynamicArraySteps,
    config,
  ]);

  // Validators per field (for current step)
  const fieldValidators = React.useMemo(
    () =>
      new Map(
        visibleFields.map(
          (field) =>
            [
              field.id,
              createZodFieldValidator(
                (field as any).validation || [],
                (field as any).type
              ),
            ] as const
        )
      ),
    [visibleFields]
  );

  const getValidatorForField = React.useCallback(
    (field) => fieldValidators.get(field.id),
    [fieldValidators]
  );

  const manualErrors = React.useMemo(() => {
    if (!attemptedNext) return new Map();
    const errors = new Map<string, string>();
    for (const field of visibleFields) {
      const validator = fieldValidators.get(field.id);
      if (validator) {
        const fieldValue = form.getFieldValue(field.name);
        const error = validator({ value: fieldValue });
        if (error) errors.set(field.id, error);
      }
    }
    return errors;
  }, [attemptedNext, visibleFields, fieldValidators, form]);

  const next = React.useCallback(async () => {
    setAttemptedNext(true);
    let hasErrors = false;
    for (const field of visibleFields) {
      if (!field.required) continue;
      const fieldValue = form.getFieldValue(field.name);
      const validator = fieldValidators.get(field.id);
      const error = validator?.({ value: fieldValue });
      if (error) hasErrors = true;
    }
    if (!hasErrors) {
      // Save step if enabled and required (default true, can be overridden per step)
      const shouldSave = stepSaveEnabled && currentStep.saveRequired !== false;

      if (shouldSave) {
        await saveStepData(currentStep.id, form.state.values);
        // Continue navigation even if save fails (UX decision)
      }

      nav.next();
      setAttemptedNext(false);
    }
  }, [
    visibleFields,
    fieldValidators,
    form,
    nav,
    stepSaveEnabled,
    currentStep,
    saveStepData,
  ]);

  const previous = React.useCallback(() => {
    nav.previous();
  }, [nav]);

  const goTo = React.useCallback((i: number) => nav.goTo(i), [nav]);

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      void form.handleSubmit();
    },
    [form]
  );

  const submit = React.useCallback(() => {
    void form.handleSubmit();
  }, [form]);

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
      isSaving: saveState.isSaving,
      onSubmit: submit,
    }),
    [
      nav.stepNavigationProps,
      next,
      previous,
      goTo,
      isSubmitting,
      saveState.isSaving,
      submit,
    ]
  );

  const isFieldVisible = React.useCallback(
    (field) =>
      evaluateConditions(field.conditions, form.state.values as FormData),
    [evaluateConditions, conditionKeySignature]
  );

  // Handle auto-trigger functionality (unidirectional)
  const handleAutoTrigger = React.useCallback(
    (sourceField: string, sourceValue: any, targetField: string, targetValue: any) => {
      // Set the target field value without triggering further auto-triggers
      form.setFieldValue(targetField, targetValue, { shouldValidate: false })
    },
    [form]
  );

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
    submit,
    saveState,
    saveStepData,
    isFieldVisible,
    stepNavigationProps,
    handleAutoTrigger,
  };
}
