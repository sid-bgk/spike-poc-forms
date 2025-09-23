// Shared constants used across multiple forms

// Common field IDs used in multiple forms
export const SHARED_FIELD_IDS = {
  // Personal Information - used in almost every form
  FIRST_NAME: "first_name",
  LAST_NAME: "last_name",
  EMAIL: "email",
  PHONE: "phone",
  MOBILE: "mobile",
  SSN: "ssn",
  DATE_OF_BIRTH: "date_of_birth",

  // Address fields - common across forms
  STREET: "street",
  CITY: "city",
  STATE: "state",
  ZIP: "zip",
  APARTMENT_NUMBER: "apartment_number",

  // Property fields - used in multiple forms
  PROPERTY_VALUE: "property_value",
  PROPERTY_TYPE: "property_type",
  PROPERTY_STATE: "property_state",
  PROPERTY_CITY: "property_city",
  PROPERTY_ZIP: "property_zip",
  PROPERTY_STREET: "property_street",
  PROPERTY_APARTMENT_NUMBER: "property_apartment_number",

  // Loan fields - common across forms
  LOAN_PURPOSE: "loan_purpose",
  LOAN_AMOUNT: "loan_amount",
  ESTIMATED_CREDIT_SCORE: "estimated_credit_score",
  LOAN_TYPE_NAME: "loan_type_name",

  // Application fields - common patterns
  APPLICATION_TYPE: "application_type",
  NUMBER_OF_BORROWERS: "number_of_borrowers"
};

// Field types
export const FIELD_TYPES = {
  TEXT: "text",
  EMAIL: "email",
  PHONE: "phone",
  PASSWORD: "password",
  DROPDOWN: "dropdown",
  OPTIONS: "options",
  OPTIONS_CARDS: "options_cards",
  RADIO: "radio",
  CHECKBOX: "checkbox",
  DATE: "date",
  CURRENCY: "currency",
  LABEL: "label",
  HIDDEN: "hidden"
};

// Grid layout patterns
export const GRID_LAYOUTS = {
  FULL: { xs: 12 },
  HALF: { xs: 12, sm: 6 },
  THIRD: { xs: 12, sm: 4 },
  QUARTER: { xs: 12, sm: 3 },
  TWO_THIRDS: { xs: 12, sm: 8 }
};

// US States options
export const US_STATES = [
  { value: "CA", label: "California" },
  { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" },
  { value: "FL", label: "Florida" },
  { value: "IL", label: "Illinois" },
  { value: "WA", label: "Washington" },
  { value: "AZ", label: "Arizona" },
  { value: "CO", label: "Colorado" },
  { value: "NV", label: "Nevada" },
  { value: "OR", label: "Oregon" }
];

// Common option sets
export const APPLICATION_TYPE_OPTIONS = [
  { value: "individual", label: "Individual" },
  { value: "joint", label: "Joint" }
];

export const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" }
];
