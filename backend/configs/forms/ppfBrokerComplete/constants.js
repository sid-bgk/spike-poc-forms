import { SHARED_FIELD_IDS } from '../../shared/constants.js';

// Form-specific field IDs - extends shared constants
export const FIELD_IDS = {
  // Use shared field IDs for common fields
  FIRST_NAME: SHARED_FIELD_IDS.FIRST_NAME,
  LAST_NAME: SHARED_FIELD_IDS.LAST_NAME,
  EMAIL: SHARED_FIELD_IDS.EMAIL,
  PHONE: SHARED_FIELD_IDS.PHONE,
  SSN: SHARED_FIELD_IDS.SSN,
  DATE_OF_BIRTH: SHARED_FIELD_IDS.DATE_OF_BIRTH,
  PROPERTY_STATE: SHARED_FIELD_IDS.PROPERTY_STATE,
  PROPERTY_TYPE: SHARED_FIELD_IDS.PROPERTY_TYPE,
  PROPERTY_VALUE: SHARED_FIELD_IDS.PROPERTY_VALUE,
  APPLICATION_TYPE: SHARED_FIELD_IDS.APPLICATION_TYPE,

  // PPF Broker Complete specific fields
  LOAN_TYPE_NAME: "loanTypeName",
  LOAN_PURPOSE: "loanPurpose",
  ESTIMATED_CREDIT_SCORE: "estimatedCreditScore",
  CITIZENSHIP: "citizenship",

  // DSCR specific fields
  RENTAL_USE: "rentalUse",
  NUMBER_OF_UNITS: "numberOfUnits",
  MONTHLY_PROPERTY_TAXES: "monthlyPropertyTaxes",
  MONTHLY_INSURANCE: "monthlyInsurance",
  UNIT_1_MONTHLY_RENT: "unit1MonthlyRent",
  UNIT_2_MONTHLY_RENT: "unit2MonthlyRent",

  // RTL specific fields
  LOAN_TYPE: "loanType",
  PROJECTS_COMPLETED: "projectsCompleted",
  REHAB_AMOUNT: "rehabAmount",
  AFTER_REPAIR_VALUE: "afterRepairValue",
  CONSTRUCTION_BUDGET: "constructionBudget",
  AVAILABLE_LIQUIDITY: "availableLiquidity",

  // Borrower fields
  NUMBER_OF_BORROWERS: "numberOfBorrowers"
};

// Step IDs specific to this form
export const STEP_IDS = {
  LOAN_TYPE_SELECTION: "loan-type-selection",
  QUALIFYING_INFO: "qualifying-info",
  DSCR_DETAILS: "dscr-details",
  RTL_DETAILS: "rtl-details",
  BORROWER_SELECTION: "borrower-selection"
};

// Loan type options
export const LOAN_TYPE_OPTIONS = [
  {
    value: "debt-service-coverage-ratio",
    label: "DSCR (Debt Service Coverage Ratio)",
    description: "Investment property loan based on rental income"
  },
  {
    value: "residential-transition-loan",
    label: "RTL (Residential Transition Loan)",
    description: "Fix & flip, fix & hold, bridge loans"
  }
];

// Credit score options
export const CREDIT_SCORE_OPTIONS = [
  { value: "760+", label: "760+" },
  { value: "740-759", label: "740-759" },
  { value: "720-739", label: "720-739" },
  { value: "700-719", label: "700-719" },
  { value: "680-699", label: "680-699" }
];

// Citizenship options
export const CITIZENSHIP_OPTIONS = [
  { value: "us_citizen", label: "U.S. Citizen" },
  { value: "permanent_resident_alien", label: "Permanent Resident Alien" },
  { value: "non_permanent_resident_alien", label: "Non-Permanent Resident Alien" }
];