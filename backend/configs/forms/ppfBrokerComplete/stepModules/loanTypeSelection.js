import { FIELD_TYPES, GRID_LAYOUTS } from '../../../shared/constants.js';
import { VALIDATION_PATTERNS } from '../../../shared/validations.js';
import { STEP_IDS, FIELD_IDS, LOAN_TYPE_OPTIONS } from '../constants.js';

// Loan type selection field
export const loanTypeName = {
  id: FIELD_IDS.LOAN_TYPE_NAME,
  type: FIELD_TYPES.RADIO,
  name: FIELD_IDS.LOAN_TYPE_NAME,
  label: "Select Loan Type",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.FULL,
  options: LOAN_TYPE_OPTIONS
};

// Loan type selection step
export const loanTypeSelectionStep = {
  id: STEP_IDS.LOAN_TYPE_SELECTION,
  name: "Choose Loan Program",
  description: "Select the type of loan you want to apply for",
  order: 1,
  required: true,
  fields: [
    loanTypeName
  ]
};