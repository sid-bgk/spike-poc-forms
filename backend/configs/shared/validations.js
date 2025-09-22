// Common validation patterns used across forms

export const VALIDATION_RULES = {
  REQUIRED: "required",
  MIN_LENGTH: "minLength",
  MAX_LENGTH: "maxLength",
  EMAIL: "email",
  PHONE_US: "phoneUS",
  ZIP_CODE: "zipCode",
  SSN_FORMAT: "ssnFormat",
  MIN_AGE: "minAge",
  MAX_AGE: "maxAge",
  MIN: "min",
  MAX: "max"
};

// Common validation pattern factories
export const VALIDATION_PATTERNS = {
  REQUIRED_FIELD: (message = "This field is required") => ({
    rule: VALIDATION_RULES.REQUIRED,
    message
  }),

  NAME_VALIDATION: (fieldName = "Name") => [
    {
      rule: VALIDATION_RULES.REQUIRED,
      message: `Please enter your ${fieldName.toLowerCase()}`
    },
    {
      rule: VALIDATION_RULES.MIN_LENGTH,
      value: 2,
      message: `${fieldName} must be at least 2 characters`
    },
    {
      rule: VALIDATION_RULES.MAX_LENGTH,
      value: 50,
      message: `${fieldName} cannot exceed 50 characters`
    }
  ],

  EMAIL_VALIDATION: [
    {
      rule: VALIDATION_RULES.REQUIRED,
      message: "Please enter your email address"
    },
    {
      rule: VALIDATION_RULES.EMAIL,
      message: "Please enter a valid email address"
    }
  ],

  PHONE_VALIDATION: [
    {
      rule: VALIDATION_RULES.REQUIRED,
      message: "Please enter your phone number"
    },
    {
      rule: VALIDATION_RULES.PHONE_US,
      message: "Please enter a valid US phone number"
    }
  ],

  ZIP_CODE_VALIDATION: [
    {
      rule: VALIDATION_RULES.REQUIRED,
      message: "Please enter a ZIP code"
    },
    {
      rule: VALIDATION_RULES.ZIP_CODE,
      message: "Please enter a valid ZIP code"
    }
  ],

  CITY_VALIDATION: (fieldType = "city") => [
    {
      rule: VALIDATION_RULES.REQUIRED,
      message: `Please enter the ${fieldType}`
    }
  ],

  STATE_VALIDATION: [
    {
      rule: VALIDATION_RULES.REQUIRED,
      message: "Please select a state"
    }
  ]
};