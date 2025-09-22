import { FIELD_TYPES, GRID_LAYOUTS } from '../../../shared/constants.js';
import { VALIDATION_PATTERNS } from '../../../shared/validations.js';
import { STEP_IDS, FIELD_IDS, LOAN_PROGRAM_OPTIONS } from '../constants.js';

// Loan program selection field
export const loanTypeName = {
  id: FIELD_IDS.LOAN_TYPE_NAME,
  type: FIELD_TYPES.OPTIONS_CARDS,
  name: FIELD_IDS.LOAN_TYPE_NAME,
  label: "Choose Your Loan Program",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.FULL,
  buttonLabel: "Price",
  options: LOAN_PROGRAM_OPTIONS
};

// Loan program selection step
export const loanProgramSelectionStep = {
  id: STEP_IDS.LOAN_PROGRAM_SELECTION,
  name: "Choose Your Loan Program",
  description: "Select the type of loan you want to apply for",
  phase: "phase1",
  order: 1,
  stepType: "selection",
  required: true,
  hideContinueButton: true,
  fields: [
    loanTypeName
  ]
};