import { FIELD_TYPES, GRID_LAYOUTS, US_STATES } from '../../../shared/constants.js';
import { VALIDATION_PATTERNS } from '../../../shared/validations.js';
import { STEP_IDS, FIELD_IDS, CREDIT_SCORE_OPTIONS, CITIZENSHIP_OPTIONS } from '../constants.js';

// Loan purpose field
export const loanPurpose = {
  id: FIELD_IDS.LOAN_PURPOSE,
  type: FIELD_TYPES.DROPDOWN,
  name: FIELD_IDS.LOAN_PURPOSE,
  label: "Loan Purpose",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.HALF,
  options: [
    { value: "purchase", label: "Purchase" },
    { value: "refinance_rate_and_term", label: "Refinance Rate-And-Term" },
    { value: "refinance_cashout", label: "Refinance Cashout" }
  ]
};

// Property type field
export const propertyType = {
  id: FIELD_IDS.PROPERTY_TYPE,
  type: FIELD_TYPES.DROPDOWN,
  name: FIELD_IDS.PROPERTY_TYPE,
  label: "Property Type",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.HALF,
  options: [
    { value: "single_family_residence", label: "Single Family Residence" },
    { value: "2_4_unit", label: "2-4 Units" },
    { value: "condominium", label: "Condominium" },
    { value: "townhome", label: "Townhome" }
  ]
};

// Property state field
export const propertyState = {
  id: FIELD_IDS.PROPERTY_STATE,
  type: FIELD_TYPES.DROPDOWN,
  name: FIELD_IDS.PROPERTY_STATE,
  label: "Property State",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.HALF,
  options: [
    { value: "CA", label: "California" },
    { value: "NY", label: "New York" },
    { value: "TX", label: "Texas" },
    { value: "FL", label: "Florida" }
  ]
};

// Estimated credit score field
export const estimatedCreditScore = {
  id: FIELD_IDS.ESTIMATED_CREDIT_SCORE,
  type: FIELD_TYPES.DROPDOWN,
  name: FIELD_IDS.ESTIMATED_CREDIT_SCORE,
  label: "Estimated Credit Score",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.HALF,
  options: CREDIT_SCORE_OPTIONS
};

// Property value field
export const propertyValue = {
  id: FIELD_IDS.PROPERTY_VALUE,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.PROPERTY_VALUE,
  label: "Property Value",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.HALF,
  formType: "amount",
  placeholder: "500000"
};

// Citizenship field
export const citizenship = {
  id: FIELD_IDS.CITIZENSHIP,
  type: FIELD_TYPES.DROPDOWN,
  name: FIELD_IDS.CITIZENSHIP,
  label: "Citizenship",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.HALF,
  options: CITIZENSHIP_OPTIONS
};

// Qualifying information step
export const qualifyingInfoStep = {
  id: STEP_IDS.QUALIFYING_INFO,
  name: "Qualifying Information",
  description: "Basic qualifying information for pricing",
  order: 2,
  required: true,
  fields: [
    loanPurpose,
    propertyType,
    propertyState,
    estimatedCreditScore,
    propertyValue,
    citizenship
  ]
};