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
    const requiredRule = validationRules.find(r => r.rule === 'required')
    const schema = z.boolean().superRefine((val, ctx) => {
      if (requiredRule && val !== true) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: requiredRule.message })
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
    const requiredRule = rules.find(r => r.rule === 'required')

    if (requiredRule && v.trim().length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: requiredRule.message })
      return
    }

    // If empty and not required, skip remaining checks
    if (!requiredRule && (v === '' || v == null)) return

    for (const rule of rules) {
      const { rule: ruleName, value: ruleValue, message } = rule

      switch (ruleName) {
        case 'required':
          // already handled
          break
        case 'email': {
          const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRe.test(v)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message })
          }
          break
        }
        case 'phoneUS': {
          const formatted = /^\(\d{3}\) \d{3}-\d{4}$/
          if (!formatted.test(v)) {
            const digits = v.replace(/\D/g, '')
            if (digits.length !== 10) {
              ctx.addIssue({ code: z.ZodIssueCode.custom, message })
            }
          }
          break
        }
        case 'zipCode':
        case 'zipCodeUS': {
          const zipRe = /^\d{5}(-\d{4})?$/
          if (!zipRe.test(v)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message })
          }
          break
        }
        case 'currency': {
          const num = parseCurrencyToNumber(v)
          if (num == null || num < 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message })
          }
          break
        }
        case 'date': {
          if (!isValidDate(v)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message })
          }
          break
        }
        case 'ssnFormat': {
          const ssnRe = /^\d{3}-\d{2}-\d{4}$/
          if (!ssnRe.test(v)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message })
          }
          break
        }
        case 'minLength': {
          if (v.length < ruleValue) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message })
          }
          break
        }
        case 'maxLength': {
          if (v.length > ruleValue) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message })
          }
          break
        }
        case 'min': {
          const num = parseCurrencyToNumber(v)
          if (num !== null && num < ruleValue) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message })
          }
          break
        }
        case 'max': {
          const num = parseCurrencyToNumber(v)
          if (num !== null && num > ruleValue) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message })
          }
          break
        }
        case 'minCreditScore': {
          // Credit score validation logic
          const creditScoreValues = {
            '<660': 659,
            '660-679': 669,
            '680-699': 689,
            '700-719': 709,
            '720-739': 729,
            '740-759': 749,
            '760-779': 769,
            '780+': 780
          }
          const scoreValue = creditScoreValues[v as keyof typeof creditScoreValues] || 0
          if (scoreValue < ruleValue) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message })
          }
          break
        }
        case 'minAge': {
          const age = parseInt(v)
          if (!isNaN(age) && age < ruleValue) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message })
          }
          break
        }
        case 'maxAge': {
          const age = parseInt(v)
          if (!isNaN(age) && age > ruleValue) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message })
          }
          break
        }
        case 'pattern': {
          const re = new RegExp(ruleValue)
          if (!re.test(v)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message })
          }
          break
        }
        case 'oneOf': {
          if (!ruleValue.includes(v)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message })
          }
          break
        }
        default:
          // Unknown rule type
          break
      }
    }
  })

  return ({ value }) => {
    const res = schema.safeParse(value)
    if (!res.success) return res.error.issues[0]?.message || 'Invalid value'
    return undefined
  }
}
