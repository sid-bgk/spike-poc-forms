import type { RegisterOptions, ValidateResult } from 'react-hook-form'

// Enhanced validation rule with custom message
export interface ValidationRule {
  rule: string
  value?: any
  message: string
}

// React Hook Form validator function type
export type RHFValidator = (value: any) => ValidateResult

export function createRHFFieldValidator(
  validationRules: Array<string | { [key: string]: any }> = [],
  fieldType: string = 'text'
): RegisterOptions {
  const rules: RegisterOptions = {}

  // Convert validation rules to RHF rules
  for (const rule of validationRules) {
    if (typeof rule === 'string') {
      // Simple string rules
      switch (rule) {
        case 'required':
          rules.required = fieldType === 'checkbox' ? 'This field is required' : 'This field is required'
          break
        case 'email':
          rules.pattern = {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address',
          }
          break
        case 'phoneUS':
          rules.pattern = {
            value: /^\(\d{3}\) \d{3}-\d{4}$/,
            message: 'Please enter a valid US phone number (XXX) XXX-XXXX',
          }
          break
        case 'zipCodeUS':
          rules.pattern = {
            value: /^\d{5}(-\d{4})?$/,
            message: 'Please enter a valid US ZIP code',
          }
          break
        case 'currency':
          rules.validate = (value: any) => {
            if (!value) return true
            const num = parseFloat(value.toString().replace(/[,$]/g, ''))
            return !isNaN(num) && num >= 0 ? true : 'Please enter a valid amount'
          }
          break
        case 'date':
          rules.validate = (value: any) => {
            if (!value) return true
            const date = new Date(value)
            return !isNaN(date.getTime()) ? true : 'Please enter a valid date'
          }
          break
      }
    } else if (typeof rule === 'object') {
      // Complex object rules
      const ruleKey = Object.keys(rule)[0]
      const ruleValue = rule[ruleKey]

      switch (ruleKey) {
        case 'required':
          rules.required = ruleValue || 'This field is required'
          break
        case 'minLength':
          rules.minLength = {
            value: ruleValue,
            message: `Must be at least ${ruleValue} characters`,
          }
          break
        case 'maxLength':
          rules.maxLength = {
            value: ruleValue,
            message: `Must be no more than ${ruleValue} characters`,
          }
          break
        case 'min':
          rules.min = {
            value: ruleValue,
            message: `Must be at least ${ruleValue}`,
          }
          break
        case 'max':
          rules.max = {
            value: ruleValue,
            message: `Must be no more than ${ruleValue}`,
          }
          break
        case 'pattern':
          rules.pattern = {
            value: new RegExp(ruleValue),
            message: 'Invalid format',
          }
          break
        case 'oneOf':
          rules.validate = (value: any) => {
            if (!value) return true
            return Array.isArray(ruleValue) && ruleValue.includes(value)
              ? true
              : 'Please select a valid option'
          }
          break
        case 'minAge':
          rules.validate = (value: any) => {
            if (!value) return true
            const age = parseInt(value.toString())
            return !isNaN(age) && age >= ruleValue ? true : `Must be at least ${ruleValue} years old`
          }
          break
        case 'maxAge':
          rules.validate = (value: any) => {
            if (!value) return true
            const age = parseInt(value.toString())
            return !isNaN(age) && age <= ruleValue ? true : `Must be no more than ${ruleValue} years old`
          }
          break
        case 'minCreditScore':
          rules.validate = (value: any) => {
            if (!value) return true
            const creditScoreValues = {
              '<660': 659,
              '660-679': 669,
              '680-699': 689,
              '700-719': 709,
              '720-739': 729,
              '740-759': 749,
              '760-779': 769,
              '780+': 780,
            }
            const scoreValue = creditScoreValues[value as keyof typeof creditScoreValues] || 0
            return scoreValue >= ruleValue ? true : `Credit score must be at least ${ruleValue}`
          }
          break
        case 'ssnFormat':
          rules.pattern = {
            value: /^\d{3}-\d{2}-\d{4}$/,
            message: 'Please enter a valid SSN (XXX-XX-XXXX)',
          }
          break
      }
    }
  }

  return rules
}

// Utility functions for common validations
export const validators = {
  required: (message: string = 'This field is required'): RegisterOptions => ({
    required: message,
  }),

  email: (message: string = 'Please enter a valid email address'): RegisterOptions => ({
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message,
    },
  }),

  phoneUS: (message: string = 'Please enter a valid US phone number'): RegisterOptions => ({
    pattern: {
      value: /^\(\d{3}\) \d{3}-\d{4}$/,
      message,
    },
  }),

  zipCodeUS: (message: string = 'Please enter a valid US ZIP code'): RegisterOptions => ({
    pattern: {
      value: /^\d{5}(-\d{4})?$/,
      message,
    },
  }),

  minLength: (length: number, message?: string): RegisterOptions => ({
    minLength: {
      value: length,
      message: message || `Must be at least ${length} characters`,
    },
  }),

  maxLength: (length: number, message?: string): RegisterOptions => ({
    maxLength: {
      value: length,
      message: message || `Must be no more than ${length} characters`,
    },
  }),

  min: (value: number, message?: string): RegisterOptions => ({
    min: {
      value,
      message: message || `Must be at least ${value}`,
    },
  }),

  max: (value: number, message?: string): RegisterOptions => ({
    max: {
      value,
      message: message || `Must be no more than ${value}`,
    },
  }),

  pattern: (regex: RegExp, message: string = 'Invalid format'): RegisterOptions => ({
    pattern: {
      value: regex,
      message,
    },
  }),

  currency: (message: string = 'Please enter a valid amount'): RegisterOptions => ({
    validate: (value: any) => {
      if (!value) return true
      const num = parseFloat(value.toString().replace(/[,$]/g, ''))
      return !isNaN(num) && num >= 0 ? true : message
    },
  }),

  date: (message: string = 'Please enter a valid date'): RegisterOptions => ({
    validate: (value: any) => {
      if (!value) return true
      const date = new Date(value)
      return !isNaN(date.getTime()) ? true : message
    },
  }),

  // Composition utility for combining multiple validation rules
  compose: (...rulesets: RegisterOptions[]): RegisterOptions => {
    const combined: RegisterOptions = {}
    const validateFunctions: Array<(value: any) => ValidateResult> = []

    for (const rules of rulesets) {
      // Merge simple properties
      if (rules.required) combined.required = rules.required
      if (rules.pattern) combined.pattern = rules.pattern
      if (rules.minLength) combined.minLength = rules.minLength
      if (rules.maxLength) combined.maxLength = rules.maxLength
      if (rules.min) combined.min = rules.min
      if (rules.max) combined.max = rules.max

      // Collect validate functions
      if (rules.validate) {
        if (typeof rules.validate === 'function') {
          validateFunctions.push(rules.validate)
        } else if (typeof rules.validate === 'object') {
          // Handle validate object with multiple validation functions
          Object.values(rules.validate).forEach((fn) => {
            if (typeof fn === 'function') {
              validateFunctions.push(fn)
            }
          })
        }
      }
    }

    // Combine all validate functions
    if (validateFunctions.length > 0) {
      combined.validate = (value: any) => {
        for (const fn of validateFunctions) {
          const result = fn(value)
          if (result !== true) return result
        }
        return true
      }
    }

    return combined
  },
}