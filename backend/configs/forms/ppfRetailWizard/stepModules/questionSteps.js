import { FIELD_TYPES, GRID_LAYOUTS } from '../../../shared/constants.js';
import { VALIDATION_PATTERNS } from '../../../shared/validations.js';
import {
  STEP_IDS,
  FIELD_IDS,
  PROPERTY_TYPE_OPTIONS,
  STATE_OPTIONS,
  CREDIT_SCORE_OPTIONS,
  CITIZENSHIP_OPTIONS,
  RTL_LOAN_TYPE_OPTIONS,
  PROJECTS_COMPLETED_OPTIONS
} from '../constants.js';

// Loan purpose question step
export const loanPurposeQuestionStep = {
  id: STEP_IDS.LOAN_PURPOSE_QUESTION,
  name: "Loan Purpose",
  description: "What is the purpose of your loan?",
  phase: "phase2",
  order: 2,
  stepType: "question",
  category: "Qualifying Information",
  showPricer: true,
  required: true,
  fields: [
    {
      id: FIELD_IDS.LOAN_PURPOSE,
      type: FIELD_TYPES.OPTIONS,
      name: FIELD_IDS.LOAN_PURPOSE,
      label: "Loan Purpose",
      required: true,
      validation: [
        {
          rule: "required",
          message: "This field is required"
        }
      ],
      grid: GRID_LAYOUTS.FULL,
      options: [
        { value: "purchase", label: "Purchase" },
        { value: "refinance_rate_and_term", label: "Refinance Rate-And-Term" },
        { value: "refinance_cashout", label: "Refinance Cashout" }
      ]
    }
  ]
};

// Property type question step
export const propertyTypeQuestionStep = {
  id: STEP_IDS.PROPERTY_TYPE_QUESTION,
  name: "Property Type",
  description: "What type of property are you financing?",
  phase: "phase2",
  order: 3,
  stepType: "question",
  category: "Qualifying Information",
  showPricer: true,
  required: true,
  fields: [
    {
      id: FIELD_IDS.PROPERTY_TYPE,
      type: FIELD_TYPES.OPTIONS,
      name: FIELD_IDS.PROPERTY_TYPE,
      label: "Select a Property Type",
      required: true,
      validation: [
        {
          rule: "required",
          message: "This field is required"
        }
      ],
      grid: GRID_LAYOUTS.FULL,
      options: PROPERTY_TYPE_OPTIONS
    }
  ]
};

// Property state question step
export const propertyStateQuestionStep = {
  id: STEP_IDS.PROPERTY_STATE_QUESTION,
  name: "Property Location",
  description: "Where is your property located?",
  phase: "phase2",
  order: 4,
  stepType: "question",
  category: "Qualifying Information",
  showPricer: true,
  required: true,
  fields: [
    {
      id: FIELD_IDS.PROPERTY_STATE,
      type: FIELD_TYPES.DROPDOWN,
      name: FIELD_IDS.PROPERTY_STATE,
      label: "State",
      required: true,
      validation: [
        {
          rule: "required",
          message: "This field is required"
        }
      ],
      grid: GRID_LAYOUTS.FULL,
      options: STATE_OPTIONS
    }
  ]
};

// Credit score question step
export const creditScoreQuestionStep = {
  id: STEP_IDS.CREDIT_SCORE_QUESTION,
  name: "Credit Score Range",
  description: "What is your estimated credit score?",
  phase: "phase2",
  order: 5,
  stepType: "question",
  category: "Qualifying Information",
  showPricer: true,
  required: true,
  fields: [
    {
      id: FIELD_IDS.ESTIMATED_CREDIT_SCORE,
      type: FIELD_TYPES.OPTIONS,
      name: FIELD_IDS.ESTIMATED_CREDIT_SCORE,
      label: "What is your credit score range?",
      required: true,
      validation: [
        {
          rule: "required",
          message: "Please select your credit score range"
        },
        {
          rule: "minCreditScore",
          value: 660,
          message: "We require a minimum credit score of 660"
        }
      ],
      grid: GRID_LAYOUTS.FULL,
      options: CREDIT_SCORE_OPTIONS
    }
  ]
};

// Property value question step
export const propertyValueQuestionStep = {
  id: STEP_IDS.PROPERTY_VALUE_QUESTION,
  name: "Property Value",
  description: "What is the estimated value or purchase price?",
  phase: "phase2",
  order: 6,
  stepType: "question",
  category: "Qualifying Information",
  showPricer: true,
  required: true,
  fields: [
    {
      id: FIELD_IDS.PROPERTY_VALUE,
      type: FIELD_TYPES.CURRENCY,
      name: FIELD_IDS.PROPERTY_VALUE,
      label: "Property Value",
      required: true,
      validation: [
        {
          rule: "required",
          message: "Please enter the property value"
        },
        {
          rule: "min",
          value: 75000,
          message: "Property value must be at least $75,000"
        },
        {
          rule: "max",
          value: 5000000,
          message: "Property value cannot exceed $5,000,000"
        }
      ],
      grid: GRID_LAYOUTS.FULL,
      placeholder: "$500,000",
      helperText: "Purchase Price or Estimated Value",
      inputProps: {
        startAdornment: "$"
      }
    }
  ]
};

// Rental use question step
export const rentalUseQuestionStep = {
  id: STEP_IDS.RENTAL_USE_QUESTION,
  name: "Rental Type",
  description: "How will the property be rented?",
  phase: "phase2",
  order: 7,
  stepType: "question",
  category: "Qualifying Information",
  showPricer: true,
  required: true,
  conditions: [
    {
      "===": [{"var": FIELD_IDS.LOAN_TYPE_NAME}, "debt-service-coverage-ratio"]
    }
  ],
  fields: [
    {
      id: FIELD_IDS.RENTAL_USE,
      type: FIELD_TYPES.OPTIONS,
      name: FIELD_IDS.RENTAL_USE,
      label: "What is the rental type?",
      required: true,
      validation: [
        {
          rule: "required",
          message: "This field is required"
        }
      ],
      grid: GRID_LAYOUTS.FULL,
      options: [
        { value: "long_term", label: "Long Term Rental" },
        { value: "short_term", label: "Short Term Rental (Airbnb)" }
      ]
    }
  ]
};

// RTL loan type question step
export const rtlLoanTypeQuestionStep = {
  id: STEP_IDS.LOAN_TYPE_RTL_QUESTION,
  name: "RTL Loan Type",
  description: "What type of RTL loan do you need?",
  phase: "phase2",
  order: 7,
  stepType: "question",
  category: "Qualifying Information",
  showPricer: true,
  required: true,
  conditions: [
    {
      "===": [{"var": FIELD_IDS.LOAN_TYPE_NAME}, "residential-transition-loan"]
    }
  ],
  fields: [
    {
      id: FIELD_IDS.RTL_LOAN_TYPE,
      type: FIELD_TYPES.OPTIONS,
      name: FIELD_IDS.RTL_LOAN_TYPE,
      label: "Loan Type",
      required: true,
      validation: [
        {
          rule: "required",
          message: "This field is required"
        }
      ],
      grid: GRID_LAYOUTS.FULL,
      options: RTL_LOAN_TYPE_OPTIONS
    }
  ]
};

// Projects completed question step
export const projectsCompletedQuestionStep = {
  id: STEP_IDS.PROJECTS_COMPLETED_QUESTION,
  name: "Experience Level",
  description: "How many projects have you completed?",
  phase: "phase2",
  order: 8,
  stepType: "question",
  category: "Qualifying Information",
  showPricer: true,
  required: true,
  conditions: [
    {
      "===": [{"var": FIELD_IDS.LOAN_TYPE_NAME}, "residential-transition-loan"]
    }
  ],
  fields: [
    {
      id: FIELD_IDS.PROJECTS_COMPLETED_IN_PAST_36_MONTHS,
      type: FIELD_TYPES.DROPDOWN,
      name: FIELD_IDS.PROJECTS_COMPLETED_IN_PAST_36_MONTHS,
      label: "Projects Completed in Past 36 Months",
      required: true,
      validation: [
        {
          rule: "required",
          message: "This field is required"
        }
      ],
      grid: GRID_LAYOUTS.FULL,
      options: PROJECTS_COMPLETED_OPTIONS
    }
  ]
};

// Citizenship question step
export const citizenshipQuestionStep = {
  id: STEP_IDS.CITIZENSHIP_QUESTION,
  name: "Residency Status",
  description: "What is your residency status?",
  phase: "phase2",
  order: 9,
  stepType: "question",
  category: "Qualifying Information",
  showPricer: true,
  required: true,
  fields: [
    {
      id: FIELD_IDS.CITIZENSHIP,
      type: FIELD_TYPES.OPTIONS,
      name: FIELD_IDS.CITIZENSHIP,
      label: "Residency Status",
      required: true,
      validation: [
        {
          rule: "required",
          message: "This field is required"
        }
      ],
      grid: GRID_LAYOUTS.FULL,
      options: CITIZENSHIP_OPTIONS
    }
  ]
};

// Purchase price question step
export const purchasePriceQuestionStep = {
  id: STEP_IDS.PURCHASE_PRICE_QUESTION,
  name: "Purchase Price",
  description: "What is the purchase price?",
  phase: "phase2",
  order: 10,
  stepType: "question",
  category: "Qualifying Information",
  showPricer: true,
  required: true,
  conditions: [
    {
      "===": [{"var": FIELD_IDS.LOAN_PURPOSE}, "purchase"]
    }
  ],
  fields: [
    {
      id: FIELD_IDS.PURCHASE_PRICE,
      type: FIELD_TYPES.CURRENCY,
      name: FIELD_IDS.PURCHASE_PRICE,
      label: "Purchase Price",
      required: true,
      validation: [
        {
          rule: "required",
          message: "Please enter the amount"
        },
        {
          rule: "min",
          value: 50000,
          message: "Amount must be at least $50,000"
        }
      ],
      grid: GRID_LAYOUTS.FULL,
      placeholder: "$400,000",
      inputProps: {
        startAdornment: "$"
      }
    }
  ]
};

// Outstanding balance question step
export const outstandingBalanceQuestionStep = {
  id: STEP_IDS.OUTSTANDING_BALANCE_QUESTION,
  name: "Outstanding Loan Balance",
  description: "What is the current loan balance?",
  phase: "phase2",
  order: 11,
  stepType: "question",
  category: "Qualifying Information",
  showPricer: true,
  required: true,
  conditions: [
    {
      "or": [
        {"===": [{"var": FIELD_IDS.LOAN_PURPOSE}, "refinance_rate_and_term"]},
        {"===": [{"var": FIELD_IDS.LOAN_PURPOSE}, "refinance_cashout"]}
      ]
    }
  ],
  fields: [
    {
      id: FIELD_IDS.OUTSTANDING_LOAN_BALANCE,
      type: FIELD_TYPES.CURRENCY,
      name: FIELD_IDS.OUTSTANDING_LOAN_BALANCE,
      label: "Outstanding Loan Balance on Property",
      required: true,
      validation: [
        {
          rule: "required",
          message: "Please enter the amount"
        },
        {
          rule: "min",
          value: 0,
          message: "Amount cannot be negative"
        }
      ],
      grid: GRID_LAYOUTS.FULL,
      placeholder: "$200,000",
      inputProps: {
        startAdornment: "$"
      }
    }
  ]
};