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
  PROPERTY_CITY: SHARED_FIELD_IDS.PROPERTY_CITY,
  PROPERTY_ZIP: SHARED_FIELD_IDS.PROPERTY_ZIP,

  // PPF Retail Wizard specific fields
  LOAN_TYPE_NAME: "loanTypeName",
  LOAN_PURPOSE: "loanPurpose",
  ESTIMATED_CREDIT_SCORE: "estimatedCreditScore",
  CITIZENSHIP: "citizenship",
  RENTAL_USE: "rentalUse",
  RTL_LOAN_TYPE: "rtlLoanType",
  PROJECTS_COMPLETED_IN_PAST_36_MONTHS: "projectsCompletedInPast36Months",
  PURCHASE_PRICE: "purchasePrice",
  OUTSTANDING_LOAN_BALANCE: "outstandingLoanBalance",
  LIEN_POSITION: "lienPosition",

  // Property fields
  PROPERTY_STREET: "propertyStreet",
  PROPERTY_APARTMENT_NUMBER: "propertyApartmentNumber",
  NUMBER_OF_UNITS: "numberOfUnits",
  MINIMUM_YEARLY_GROSS_RENTAL_INCOME: "minimumYearlyGrossRentalIncome",

  // Borrower address fields
  BORROWER_STREET: "borrowerStreet",
  BORROWER_APARTMENT_NUMBER: "borrowerApartmentNumber",
  BORROWER_CITY: "borrowerCity",
  BORROWER_STATE: "borrowerState",
  BORROWER_ZIP: "borrowerZip",
  GUARANTOR_ENTITY: "guarantorEntity",

  // Headers and labels
  QUALIFYING_INFO_HEADER: "qualifyingInfoHeader",
  PROPERTY_INFO_HEADER: "propertyInfoHeader",
  BORROWER_INFO_HEADER: "borrowerInfoHeader",
  CURRENT_ADDRESS_HEADER: "currentAddressHeader"
};

// Step IDs specific to this form
export const STEP_IDS = {
  LOAN_PROGRAM_SELECTION: "loan-program-selection",
  LOAN_PURPOSE_QUESTION: "loan-purpose-question",
  PROPERTY_TYPE_QUESTION: "property-type-question",
  PROPERTY_STATE_QUESTION: "property-state-question",
  CREDIT_SCORE_QUESTION: "credit-score-question",
  PROPERTY_VALUE_QUESTION: "property-value-question",
  RENTAL_USE_QUESTION: "rental-use-question",
  LOAN_TYPE_RTL_QUESTION: "loan-type-rtl-question",
  PROJECTS_COMPLETED_QUESTION: "projects-completed-question",
  CITIZENSHIP_QUESTION: "citizenship-question",
  PURCHASE_PRICE_QUESTION: "purchase-price-question",
  OUTSTANDING_BALANCE_QUESTION: "outstanding-balance-question",
  QUALIFYING_INFORMATION_SUMMARY: "qualifying-information-summary",
  PROPERTY_INFORMATION: "property-information",
  BORROWER_INFORMATION: "borrower-information"
};

// Loan program options
export const LOAN_PROGRAM_OPTIONS = [
  {
    value: "debt-service-coverage-ratio",
    label: "DSCR",
    title: "Debt Service Coverage Ratio",
    description: "Investment property loan based on rental income",
    icon: "investment"
  },
  {
    value: "residential-transition-loan",
    label: "RTL",
    title: "Residential Transition Loan",
    description: "Fix & flip, fix & hold, bridge loans",
    icon: "construction"
  }
];

// Property type options (extended)
export const PROPERTY_TYPE_OPTIONS = [
  { value: "single_family_residence", label: "Single Family Residence" },
  { value: "2_4_unit", label: "2-4 Units" },
  { value: "condominium", label: "Condominium" },
  { value: "non_warrantable_condo", label: "Non-Warrantable Condo" },
  { value: "condotel", label: "Condotel" },
  { value: "pud", label: "PUD" },
  { value: "townhome", label: "Townhome" },
  { value: "other", label: "Other" }
];

// Credit score options (extended)
export const CREDIT_SCORE_OPTIONS = [
  { value: "760+", label: "760+" },
  { value: "740-759", label: "740-759" },
  { value: "720-739", label: "720-739" },
  { value: "700-719", label: "700-719" },
  { value: "680-699", label: "680-699" },
  { value: "660-679", label: "660-679" },
  { value: "<660", label: "Less than 660 (Not Eligible)" }
];

// Citizenship options
export const CITIZENSHIP_OPTIONS = [
  { value: "us_citizen", label: "U.S. Citizen" },
  { value: "permanent_resident_alien", label: "Permanent Resident Alien" },
  { value: "non_permanent_resident_alien", label: "Non-Permanent Resident Alien" }
];

// RTL loan type options
export const RTL_LOAN_TYPE_OPTIONS = [
  { value: "fix_and_flip", label: "Fix and Flip" },
  { value: "fix_and_hold", label: "Fix and Hold" },
  { value: "bridge_loan", label: "Bridge Loan" },
  { value: "ground_up_construction", label: "Ground Up Construction" }
];

// Projects completed options
export const PROJECTS_COMPLETED_OPTIONS = [
  { value: "0", label: "0" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10+", label: "10+" }
];

// State options (extended)
export const STATE_OPTIONS = [
  { value: "CA", label: "California" },
  { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" },
  { value: "FL", label: "Florida" },
  { value: "IL", label: "Illinois" },
  { value: "WA", label: "Washington" },
  { value: "AZ", label: "Arizona" },
  { value: "CO", label: "Colorado" }
];

// Number of units options
export const NUMBER_OF_UNITS_OPTIONS = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" }
];