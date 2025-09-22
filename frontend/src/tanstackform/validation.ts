// Enhanced validation rule with custom message
export interface ValidationRule {
  rule: string
  value?: any
  message: string
}

// TanStack Form validator function type
export type FieldValidator = ({ value }: { value: any }) => string | undefined

export function createFieldValidator(validationRules: ValidationRule[] = [], fieldType: string = 'text'): FieldValidator {
  return ({ value }) => {
    // Apply each validation rule
    for (const rule of validationRules) {
      const error = validateSingleRule(rule, value, fieldType)
      if (error) return error
    }

    return undefined // No validation errors
  }
}

function validateSingleRule(rule: ValidationRule, value: any, fieldType: string): string | undefined {
  const { rule: ruleName, value: ruleValue, message } = rule

  switch (ruleName) {
    case 'required':
      if (fieldType === 'checkbox') {
        if (value !== true) return message
      } else {
        if (!value || value.toString().trim() === '') return message
      }
      break

    case 'email':
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return message
      }
      break

    case 'phoneUS':
      if (value && !/^\(\d{3}\) \d{3}-\d{4}$/.test(value)) {
        return message
      }
      break

    case 'zipCode':
    case 'zipCodeUS':
      if (value && !/^\d{5}(-\d{4})?$/.test(value)) {
        return message
      }
      break

    case 'currency':
      if (value) {
        const num = parseFloat(value.toString().replace(/[,$]/g, ''))
        if (isNaN(num) || num < 0) {
          return message
        }
      }
      break

    case 'date':
      if (value) {
        const date = new Date(value)
        if (isNaN(date.getTime())) {
          return message
        }
      }
      break

    case 'ssnFormat':
      if (value && !/^\d{3}-\d{2}-\d{4}$/.test(value)) {
        return message
      }
      break

    case 'minLength':
      if (value && value.toString().length < ruleValue) {
        return message
      }
      break

    case 'maxLength':
      if (value && value.toString().length > ruleValue) {
        return message
      }
      break

    case 'min':
      if (value) {
        const num = parseFloat(value.toString().replace(/[,$]/g, ''))
        if (!isNaN(num) && num < ruleValue) {
          return message
        }
      }
      break

    case 'max':
      if (value) {
        const num = parseFloat(value.toString().replace(/[,$]/g, ''))
        if (!isNaN(num) && num > ruleValue) {
          return message
        }
      }
      break

    case 'minCreditScore':
      if (value) {
        // Credit score validation logic - comparing against credit score ranges
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
        const scoreValue = creditScoreValues[value as keyof typeof creditScoreValues] || 0
        if (scoreValue < ruleValue) {
          return message
        }
      }
      break

    case 'minAge':
      if (value) {
        const age = parseInt(value.toString())
        if (!isNaN(age) && age < ruleValue) {
          return message
        }
      }
      break

    case 'maxAge':
      if (value) {
        const age = parseInt(value.toString())
        if (!isNaN(age) && age > ruleValue) {
          return message
        }
      }
      break

    case 'pattern':
      if (value && !new RegExp(ruleValue).test(value.toString())) {
        return message
      }
      break

    case 'oneOf':
      if (value && !ruleValue.includes(value.toString())) {
        return message
      }
      break

    default:
      // Unknown rule type
      break
  }

  return undefined
}