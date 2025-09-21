import { z } from 'zod'
import type { ValidationRule, FieldValidator } from './validation'

function isValidDate(value: string): boolean {
  if (!value) return false
  const d = new Date(value)
  return !isNaN(d.getTime())
}

function parseCurrencyToNumber(input: unknown): number | null {
  if (input == null) return null
  const str = String(input)
  const cleaned = str.replace(/[^\d.]/g, '')
  if (!cleaned) return null
  const num = Number(cleaned)
  return isNaN(num) ? null : num
}

export function createZodFieldValidator(validationRules: ValidationRule[] = [], fieldType: string = 'text'): FieldValidator {
  // Special case: checkbox → boolean with required enforcement only
  if (fieldType === 'checkbox') {
    const hasRequired = validationRules.some((r) => r === 'required')
    const schema = z.boolean().superRefine((val, ctx) => {
      if (hasRequired && val !== true) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'This field is required' })
      }
    })
    return ({ value }) => {
      const res = schema.safeParse(value)
      if (!res.success) return res.error.issues[0]?.message || 'Invalid value'
      return undefined
    }
  }

  // For non-checkbox fields, validate via a single superRefine pass.
  const rules = validationRules
  const schema = z.any().superRefine((raw, ctx) => {
    const v = raw == null ? '' : String(raw)
    const hasRequired = rules.some((r) => r === 'required')
    if (hasRequired && v.trim().length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'This field is required' })
      return
    }

    // If empty and not required, skip remaining checks
    if (!hasRequired && (v === '' || v == null)) return

    for (const rule of rules) {
      switch (typeof rule === 'string' ? rule : (Object.keys(rule)[0] as string)) {
        case 'required':
          // already handled
          break
        case 'email': {
          const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRe.test(v)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please enter a valid email address' })
          break
        }
        case 'phoneUS': {
          const formatted = /^\(\d{3}\) \d{3}-\d{4}$/
          if (!formatted.test(v)) {
            const digits = v.replace(/\D/g, '')
            if (digits.length !== 10) {
              ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please enter a valid US phone number (e.g., (555) 123-4567)' })
            }
          }
          break
        }
        case 'zipCodeUS': {
          const zipRe = /^\d{5}(-\d{4})?$/
          if (!zipRe.test(v)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)' })
          break
        }
        case 'currency': {
          const num = parseCurrencyToNumber(v)
          if (num == null || num < 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please enter a valid amount' })
          break
        }
        case 'date': {
          if (!isValidDate(v)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please enter a valid date' })
          break
        }
        default: {
          if (typeof rule === 'object') {
            if ('minLength' in rule) {
              if (v.length < (rule as any).minLength) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Must be at least ${(rule as any).minLength} characters` })
            } else if ('maxLength' in rule) {
              if (v.length > (rule as any).maxLength) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Must be no more than ${(rule as any).maxLength} characters` })
            } else if ('min' in rule) {
              const num = Number(v)
              if (isNaN(num) || num < (rule as any).min) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Must be at least ${(rule as any).min}` })
            } else if ('max' in rule) {
              const num = Number(v)
              if (isNaN(num) || num > (rule as any).max) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Must be no more than ${(rule as any).max}` })
            } else if ('pattern' in rule) {
              const re = new RegExp((rule as any).pattern)
              if (!re.test(v)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid format' })
            } else if ('oneOf' in rule) {
              const set = new Set((rule as any).oneOf.map((x: any) => String(x)))
              if (!set.has(String(v))) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Must be one of: ${(rule as any).oneOf.join(', ')}` })
            }
          }
          break
        }
      }
    }
  })

  return ({ value }) => {
    const res = schema.safeParse(value)
    if (!res.success) return res.error.issues[0]?.message || 'Invalid value'
    return undefined
  }
}
