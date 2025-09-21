export type ValidationRule =
  | 'required'
  | 'email'
  | 'phoneUS'
  | 'date'
  | 'currency'
  | 'zipCodeUS'
  | { minLength: number }
  | { maxLength: number }
  | { min: number }
  | { max: number }
  | { pattern: string }
  | { oneOf: string[] }

// TanStack Form validator function type
export type FieldValidator = ({ value }: { value: any }) => string | undefined

export function createFieldValidator(validationRules: ValidationRule[] = [], fieldType: string = 'text'): FieldValidator {
  return ({ value }) => {
    // Apply each validation rule
    for (const rule of validationRules) {
      if (rule === 'required') {
        if (fieldType === 'checkbox') {
          if (value !== true) return 'This field is required'
        } else {
          if (!value || value.toString().trim() === '') return 'This field is required'
        }
      } else if (rule === 'email') {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address'
        }
      } else if (rule === 'phoneUS') {
        if (value && !/^\(\d{3}\) \d{3}-\d{4}$/.test(value)) {
          return 'Please enter a valid US phone number (e.g., (555) 123-4567)'
        }
      } else if (rule === 'zipCodeUS') {
        if (value && !/^\d{5}(-\d{4})?$/.test(value)) {
          return 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'
        }
      } else if (rule === 'currency') {
        if (value) {
          const num = parseFloat(value.toString().replace(/[,$]/g, ''))
          if (isNaN(num) || num < 0) {
            return 'Please enter a valid amount'
          }
        }
      } else if (rule === 'date') {
        if (value) {
          const date = new Date(value)
          if (isNaN(date.getTime())) {
            return 'Please enter a valid date'
          }
        }
      } else if (typeof rule === 'object') {
        if ('minLength' in rule) {
          if (value && value.toString().length < rule.minLength) {
            return `Must be at least ${rule.minLength} characters`
          }
        } else if ('maxLength' in rule) {
          if (value && value.toString().length > rule.maxLength) {
            return `Must be no more than ${rule.maxLength} characters`
          }
        } else if ('min' in rule) {
          if (fieldType === 'currency') {
            if (value) {
              const num = parseFloat(value.toString().replace(/[,$]/g, ''))
              if (!isNaN(num) && num < rule.min) {
                return `Amount must be at least $${rule.min.toLocaleString()}`
              }
            }
          } else {
            if (value) {
              const num = parseFloat(value.toString())
              if (!isNaN(num) && num < rule.min) {
                return `Must be at least ${rule.min}`
              }
            }
          }
        } else if ('max' in rule) {
          if (fieldType === 'currency') {
            if (value) {
              const num = parseFloat(value.toString().replace(/[,$]/g, ''))
              if (!isNaN(num) && num > rule.max) {
                return `Amount must be no more than $${rule.max.toLocaleString()}`
              }
            }
          } else {
            if (value) {
              const num = parseFloat(value.toString())
              if (!isNaN(num) && num > rule.max) {
                return `Must be no more than ${rule.max}`
              }
            }
          }
        } else if ('pattern' in rule) {
          if (value && !new RegExp(rule.pattern).test(value.toString())) {
            return 'Invalid format'
          }
        } else if ('oneOf' in rule) {
          if (value && !rule.oneOf.includes(value.toString())) {
            return `Must be one of: ${rule.oneOf.join(', ')}`
          }
        }
      }
    }

    return undefined // No validation errors
  }
}