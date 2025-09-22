import { FIELD_TYPES, GRID_LAYOUTS } from '../../../shared/constants.js';
import { VALIDATION_PATTERNS } from '../../../shared/validations.js';
import { STEP_IDS, FIELD_IDS } from '../constants.js';

// Application type field
export const applicationType = {
  id: FIELD_IDS.APPLICATION_TYPE,
  type: FIELD_TYPES.RADIO,
  name: FIELD_IDS.APPLICATION_TYPE,
  label: "Application Type",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.FULL,
  options: [
    { value: "individual", label: "Individual" },
    { value: "joint", label: "Joint" }
  ]
};

// Number of borrowers field
export const numberOfBorrowers = {
  id: FIELD_IDS.NUMBER_OF_BORROWERS,
  type: FIELD_TYPES.DROPDOWN,
  name: FIELD_IDS.NUMBER_OF_BORROWERS,
  label: "Number of Borrowers",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.HALF,
  defaultValue: 2,
  arrayController: "borrowers",
  conditions: [
    { "===": [{"var": FIELD_IDS.APPLICATION_TYPE}, "joint"] }
  ],
  options: [
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" }
  ]
};

// Borrower selection step
export const borrowerSelectionStep = {
  id: STEP_IDS.BORROWER_SELECTION,
  name: "Application Type",
  description: "Select application type and number of borrowers",
  order: 4,
  required: true,
  fields: [
    applicationType,
    numberOfBorrowers
  ]
};