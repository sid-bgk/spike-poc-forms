import { FIELD_TYPES, GRID_LAYOUTS } from '../../../shared/constants.js';
import { VALIDATION_PATTERNS } from '../../../shared/validations.js';
import { STEP_IDS, FIELD_IDS } from '../constants.js';

// Loan type field (for RTL)
export const loanType = {
  id: FIELD_IDS.LOAN_TYPE,
  type: FIELD_TYPES.DROPDOWN,
  name: FIELD_IDS.LOAN_TYPE,
  label: "Loan Type",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.HALF,
  options: [
    { value: "fix_and_flip", label: "Fix and Flip" },
    { value: "fix_and_hold", label: "Fix and Hold" },
    { value: "bridge_loan", label: "Bridge Loan" },
    { value: "ground_up_construction", label: "Ground Up Construction" }
  ]
};

// Projects completed field
export const projectsCompleted = {
  id: FIELD_IDS.PROJECTS_COMPLETED,
  type: FIELD_TYPES.DROPDOWN,
  name: FIELD_IDS.PROJECTS_COMPLETED,
  label: "Projects Completed in Past 36 Months",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.HALF,
  options: [
    { value: "0", label: "0" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "10+", label: "10+" }
  ]
};

// Rehab amount field
export const rehabAmount = {
  id: FIELD_IDS.REHAB_AMOUNT,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.REHAB_AMOUNT,
  label: "Rehab Amount",
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
    { "or": [
      { "===": [{"var": FIELD_IDS.LOAN_TYPE}, "fix_and_flip"] },
      { "===": [{"var": FIELD_IDS.LOAN_TYPE}, "fix_and_hold"] }
    ]}
  ]
};

// After repair value field
export const afterRepairValue = {
  id: FIELD_IDS.AFTER_REPAIR_VALUE,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.AFTER_REPAIR_VALUE,
  label: "After Repair Value (ARV)",
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
    { "or": [
      { "===": [{"var": FIELD_IDS.LOAN_TYPE}, "fix_and_flip"] },
      { "===": [{"var": FIELD_IDS.LOAN_TYPE}, "fix_and_hold"] },
      { "===": [{"var": FIELD_IDS.LOAN_TYPE}, "ground_up_construction"] }
    ]}
  ]
};

// Construction budget field
export const constructionBudget = {
  id: FIELD_IDS.CONSTRUCTION_BUDGET,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.CONSTRUCTION_BUDGET,
  label: "Construction Budget",
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
    { "===": [{"var": FIELD_IDS.LOAN_TYPE}, "ground_up_construction"] }
  ]
};

// Available liquidity field
export const availableLiquidity = {
  id: FIELD_IDS.AVAILABLE_LIQUIDITY,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.AVAILABLE_LIQUIDITY,
  label: "Available Liquidity",
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

// RTL details step
export const rtlDetailsStep = {
  id: STEP_IDS.RTL_DETAILS,
  name: "RTL Project Details",
  description: "Rehab and construction project details",
  order: 3,
  required: true,
  conditions: [
    { "===": [{"var": FIELD_IDS.LOAN_TYPE_NAME}, "residential-transition-loan"] }
  ],
  fields: [
    loanType,
    projectsCompleted,
    rehabAmount,
    afterRepairValue,
    constructionBudget,
    availableLiquidity
  ]
};