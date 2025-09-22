import { FIELD_TYPES, GRID_LAYOUTS } from '../../../shared/constants.js';
import { VALIDATION_PATTERNS } from '../../../shared/validations.js';
import { STEP_IDS, FIELD_IDS } from '../constants.js';

// Rental use field
export const rentalUse = {
  id: FIELD_IDS.RENTAL_USE,
  type: FIELD_TYPES.DROPDOWN,
  name: FIELD_IDS.RENTAL_USE,
  label: "Rental Use",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.HALF,
  options: [
    { value: "long_term", label: "Long Term" },
    { value: "short_term", label: "Short Term" }
  ]
};

// Number of units field
export const numberOfUnits = {
  id: FIELD_IDS.NUMBER_OF_UNITS,
  type: FIELD_TYPES.DROPDOWN,
  name: FIELD_IDS.NUMBER_OF_UNITS,
  label: "Number of Units",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.HALF,
  options: [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" }
  ]
};

// Monthly property taxes field
export const monthlyPropertyTaxes = {
  id: FIELD_IDS.MONTHLY_PROPERTY_TAXES,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.MONTHLY_PROPERTY_TAXES,
  label: "Monthly Property Taxes",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.HALF,
  formType: "amount"
};

// Monthly insurance field
export const monthlyInsurance = {
  id: FIELD_IDS.MONTHLY_INSURANCE,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.MONTHLY_INSURANCE,
  label: "Monthly Insurance",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.HALF,
  formType: "amount"
};

// Unit 1 monthly rent field
export const unit1MonthlyRent = {
  id: FIELD_IDS.UNIT_1_MONTHLY_RENT,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.UNIT_1_MONTHLY_RENT,
  label: "Unit 1 Monthly Rent",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.HALF,
  formType: "amount",
  conditions: [
    { ">=": [{"var": FIELD_IDS.NUMBER_OF_UNITS}, 1] }
  ]
};

// Unit 2 monthly rent field
export const unit2MonthlyRent = {
  id: FIELD_IDS.UNIT_2_MONTHLY_RENT,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.UNIT_2_MONTHLY_RENT,
  label: "Unit 2 Monthly Rent",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.HALF,
  formType: "amount",
  conditions: [
    { ">=": [{"var": FIELD_IDS.NUMBER_OF_UNITS}, 2] }
  ]
};

// DSCR details step
export const dscrDetailsStep = {
  id: STEP_IDS.DSCR_DETAILS,
  name: "DSCR Property Details",
  description: "Rental property income and expense details",
  order: 3,
  required: true,
  conditions: [
    { "===": [{"var": FIELD_IDS.LOAN_TYPE_NAME}, "debt-service-coverage-ratio"] }
  ],
  fields: [
    rentalUse,
    numberOfUnits,
    monthlyPropertyTaxes,
    monthlyInsurance,
    unit1MonthlyRent,
    unit2MonthlyRent
  ]
};