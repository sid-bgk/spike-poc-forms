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
  PROJECTS_COMPLETED_OPTIONS,
  NUMBER_OF_UNITS_OPTIONS
} from '../constants.js';

// Qualifying information summary step
export const qualifyingInformationSummaryStep = {
  id: STEP_IDS.QUALIFYING_INFORMATION_SUMMARY,
  name: "Qualifying Information",
  description: "Review and update your qualifying information",
  phase: "phase3",
  order: 12,
  stepType: "traditional",
  category: "Application Details",
  showPricer: true,
  required: true,
  fields: [
    {
      id: FIELD_IDS.QUALIFYING_INFO_HEADER,
      type: FIELD_TYPES.LABEL,
      name: FIELD_IDS.QUALIFYING_INFO_HEADER,
      text: "Qualifying Information Summary",
      grid: GRID_LAYOUTS.FULL,
      style: { fontWeight: "bold", fontSize: "18px", marginBottom: "16px" }
    },
    {
      id: "loanPurposeDisplay",
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
      prefillFrom: FIELD_IDS.LOAN_PURPOSE,
      options: [
        { value: "purchase", label: "Purchase" },
        { value: "refinance_rate_and_term", label: "Refinance Rate-And-Term" },
        { value: "refinance_cashout", label: "Refinance Cashout" }
      ]
    },
    {
      id: "propertyTypeDisplay",
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
      prefillFrom: FIELD_IDS.PROPERTY_TYPE,
      options: PROPERTY_TYPE_OPTIONS
    },
    {
      id: "propertyStateDisplay",
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
      prefillFrom: FIELD_IDS.PROPERTY_STATE,
      options: STATE_OPTIONS
    },
    {
      id: "estimatedCreditScoreDisplay",
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
      prefillFrom: FIELD_IDS.ESTIMATED_CREDIT_SCORE,
      options: CREDIT_SCORE_OPTIONS.filter(option => option.value !== "<660")
    },
    {
      id: "propertyValueDisplay",
      type: FIELD_TYPES.CURRENCY,
      name: FIELD_IDS.PROPERTY_VALUE,
      label: "Property Value",
      required: true,
      validation: [
        {
          rule: "required",
          message: "Please enter the purchase price"
        },
        {
          rule: "min",
          value: 75000,
          message: "Purchase price must be at least $75,000"
        }
      ],
      grid: GRID_LAYOUTS.HALF,
      prefillFrom: FIELD_IDS.PROPERTY_VALUE,
      helperText: "Appraised or Estimated Value",
      inputProps: {
        startAdornment: "$"
      }
    },
    {
      id: "citizenshipDisplay",
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
      prefillFrom: FIELD_IDS.CITIZENSHIP,
      options: CITIZENSHIP_OPTIONS
    },
    {
      id: "rentalUseDisplay",
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
      prefillFrom: FIELD_IDS.RENTAL_USE,
      conditions: [
        {
          "===": [{"var": FIELD_IDS.LOAN_TYPE_NAME}, "debt-service-coverage-ratio"]
        }
      ],
      options: [
        { value: "long_term", label: "Long Term Rental" },
        { value: "short_term", label: "Short Term Rental (Airbnb)" }
      ]
    },
    {
      id: "rtlLoanTypeDisplay",
      type: FIELD_TYPES.DROPDOWN,
      name: FIELD_IDS.RTL_LOAN_TYPE,
      label: "RTL Loan Type",
      required: true,
      validation: [
        {
          rule: "required",
          message: "This field is required"
        }
      ],
      grid: GRID_LAYOUTS.HALF,
      prefillFrom: FIELD_IDS.RTL_LOAN_TYPE,
      conditions: [
        {
          "===": [{"var": FIELD_IDS.LOAN_TYPE_NAME}, "residential-transition-loan"]
        }
      ],
      options: RTL_LOAN_TYPE_OPTIONS
    },
    {
      id: "projectsCompletedDisplay",
      type: FIELD_TYPES.DROPDOWN,
      name: FIELD_IDS.PROJECTS_COMPLETED_IN_PAST_36_MONTHS,
      label: "Projects Completed (36 Months)",
      required: true,
      validation: [
        {
          rule: "required",
          message: "This field is required"
        }
      ],
      grid: GRID_LAYOUTS.HALF,
      prefillFrom: FIELD_IDS.PROJECTS_COMPLETED_IN_PAST_36_MONTHS,
      conditions: [
        {
          "===": [{"var": FIELD_IDS.LOAN_TYPE_NAME}, "residential-transition-loan"]
        }
      ],
      options: PROJECTS_COMPLETED_OPTIONS
    },
    {
      id: "purchasePriceDisplay",
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
      grid: GRID_LAYOUTS.HALF,
      prefillFrom: FIELD_IDS.PURCHASE_PRICE,
      conditions: [
        {
          "===": [{"var": FIELD_IDS.LOAN_PURPOSE}, "purchase"]
        }
      ],
      inputProps: {
        startAdornment: "$"
      }
    },
    {
      id: "outstandingLoanBalanceDisplay",
      type: FIELD_TYPES.CURRENCY,
      name: FIELD_IDS.OUTSTANDING_LOAN_BALANCE,
      label: "Outstanding Loan Balance",
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
      grid: GRID_LAYOUTS.HALF,
      prefillFrom: FIELD_IDS.OUTSTANDING_LOAN_BALANCE,
      conditions: [
        {
          "or": [
            {"===": [{"var": FIELD_IDS.LOAN_PURPOSE}, "refinance_rate_and_term"]},
            {"===": [{"var": FIELD_IDS.LOAN_PURPOSE}, "refinance_cashout"]}
          ]
        }
      ],
      inputProps: {
        startAdornment: "$"
      }
    },
    {
      id: FIELD_IDS.LIEN_POSITION,
      type: FIELD_TYPES.HIDDEN,
      name: FIELD_IDS.LIEN_POSITION,
      defaultValue: "first_lien"
    }
  ]
};

// Property information step
export const propertyInformationStep = {
  id: STEP_IDS.PROPERTY_INFORMATION,
  name: "Property Information",
  description: "Detailed property information",
  phase: "phase3",
  order: 13,
  stepType: "traditional",
  category: "Property Details",
  required: true,
  fields: [
    {
      id: FIELD_IDS.PROPERTY_INFO_HEADER,
      type: FIELD_TYPES.LABEL,
      name: FIELD_IDS.PROPERTY_INFO_HEADER,
      text: "Property Information",
      grid: GRID_LAYOUTS.FULL,
      style: { fontWeight: "bold", fontSize: "18px", marginBottom: "16px" }
    },
    {
      id: FIELD_IDS.PROPERTY_STREET,
      type: FIELD_TYPES.TEXT,
      name: FIELD_IDS.PROPERTY_STREET,
      label: "Street Address",
      required: true,
      validation: [
        {
          rule: "required",
          message: "This field is required"
        }
      ],
      grid: GRID_LAYOUTS.FULL,
      placeholder: "123 Main Street"
    },
    {
      id: FIELD_IDS.PROPERTY_APARTMENT_NUMBER,
      type: FIELD_TYPES.TEXT,
      name: FIELD_IDS.PROPERTY_APARTMENT_NUMBER,
      label: "Apt or Unit #",
      required: false,
      grid: GRID_LAYOUTS.HALF,
      placeholder: "Apt 2B"
    },
    {
      id: FIELD_IDS.PROPERTY_CITY,
      type: FIELD_TYPES.TEXT,
      name: FIELD_IDS.PROPERTY_CITY,
      label: "City",
      required: true,
      validation: [
        {
          rule: "required",
          message: "This field is required"
        }
      ],
      grid: GRID_LAYOUTS.HALF,
      placeholder: "Los Angeles"
    },
    {
      id: FIELD_IDS.PROPERTY_ZIP,
      type: FIELD_TYPES.TEXT,
      name: FIELD_IDS.PROPERTY_ZIP,
      label: "ZIP Code",
      required: true,
      validation: [
        {
          rule: "required",
          message: "Please enter a ZIP code"
        },
        {
          rule: "zipCode",
          message: "Please enter a valid ZIP code"
        }
      ],
      grid: GRID_LAYOUTS.HALF,
      placeholder: "90210"
    },
    {
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
      defaultValue: 1,
      options: NUMBER_OF_UNITS_OPTIONS
    },
    {
      id: FIELD_IDS.MINIMUM_YEARLY_GROSS_RENTAL_INCOME,
      type: FIELD_TYPES.CURRENCY,
      name: FIELD_IDS.MINIMUM_YEARLY_GROSS_RENTAL_INCOME,
      label: "Minimum Yearly Gross Rental Income",
      required: false,
      grid: GRID_LAYOUTS.HALF,
      conditions: [
        {
          "===": [{"var": FIELD_IDS.LOAN_TYPE_NAME}, "residential-transition-loan"]
        }
      ],
      inputProps: {
        startAdornment: "$"
      }
    }
  ]
};

// Borrower information step
export const borrowerInformationStep = {
  id: STEP_IDS.BORROWER_INFORMATION,
  name: "Borrower Information",
  description: "Primary borrower details",
  phase: "phase3",
  order: 14,
  stepType: "traditional",
  category: "Borrower Details",
  required: true,
  fields: [
    {
      id: FIELD_IDS.BORROWER_INFO_HEADER,
      type: FIELD_TYPES.LABEL,
      name: FIELD_IDS.BORROWER_INFO_HEADER,
      text: "Borrower Information",
      grid: GRID_LAYOUTS.FULL,
      style: { fontWeight: "bold", fontSize: "18px", marginBottom: "16px" }
    },
    {
      id: FIELD_IDS.FIRST_NAME,
      type: FIELD_TYPES.TEXT,
      name: FIELD_IDS.FIRST_NAME,
      label: "First Name",
      required: true,
      validation: [
        {
          rule: "required",
          message: "This field is required"
        },
        {
          rule: "minLength",
          value: 2,
          message: "Name must be at least 2 characters"
        },
        {
          rule: "maxLength",
          value: 50,
          message: "Name cannot exceed 50 characters"
        }
      ],
      grid: GRID_LAYOUTS.HALF,
      placeholder: "John"
    },
    {
      id: FIELD_IDS.LAST_NAME,
      type: FIELD_TYPES.TEXT,
      name: FIELD_IDS.LAST_NAME,
      label: "Last Name",
      required: true,
      validation: [
        {
          rule: "required",
          message: "This field is required"
        },
        {
          rule: "minLength",
          value: 2,
          message: "Name must be at least 2 characters"
        },
        {
          rule: "maxLength",
          value: 50,
          message: "Name cannot exceed 50 characters"
        }
      ],
      grid: GRID_LAYOUTS.HALF,
      placeholder: "Doe"
    },
    {
      id: FIELD_IDS.EMAIL,
      type: FIELD_TYPES.EMAIL,
      name: FIELD_IDS.EMAIL,
      label: "Email Address",
      required: true,
      validation: [
        {
          rule: "required",
          message: "Please enter your email address"
        },
        {
          rule: "email",
          message: "Please enter a valid email address"
        }
      ],
      grid: GRID_LAYOUTS.FULL,
      placeholder: "john.doe@example.com"
    },
    {
      id: FIELD_IDS.PHONE,
      type: FIELD_TYPES.PHONE,
      name: FIELD_IDS.PHONE,
      label: "Phone Number",
      required: true,
      validation: [
        {
          rule: "required",
          message: "Please enter your phone number"
        },
        {
          rule: "phoneUS",
          message: "Please enter a valid US phone number"
        }
      ],
      grid: GRID_LAYOUTS.HALF,
      placeholder: "(555) 123-4567"
    },
    {
      id: FIELD_IDS.DATE_OF_BIRTH,
      type: FIELD_TYPES.DATE,
      name: FIELD_IDS.DATE_OF_BIRTH,
      label: "Date of Birth",
      required: true,
      validation: [
        {
          rule: "required",
          message: "Please enter your age"
        },
        {
          rule: "minAge",
          value: 18,
          message: "You must be at least 18 years old"
        },
        {
          rule: "maxAge",
          value: 150,
          message: "Please enter a valid age"
        }
      ],
      grid: GRID_LAYOUTS.HALF
    },
    {
      id: FIELD_IDS.SSN,
      type: FIELD_TYPES.PASSWORD,
      name: FIELD_IDS.SSN,
      label: "Social Security Number",
      required: true,
      validation: [
        {
          rule: "required",
          message: "Please enter your Social Security Number"
        },
        {
          rule: "ssnFormat",
          message: "Please enter a valid SSN (XXX-XX-XXXX)"
        }
      ],
      grid: GRID_LAYOUTS.HALF,
      placeholder: "123-45-6789",
      helperText: "9 digits only"
    },
    {
      id: FIELD_IDS.GUARANTOR_ENTITY,
      type: FIELD_TYPES.TEXT,
      name: FIELD_IDS.GUARANTOR_ENTITY,
      label: "Guarantor/Entity Name",
      required: false,
      grid: GRID_LAYOUTS.HALF,
      placeholder: "ABC Company LLC"
    },
    {
      id: FIELD_IDS.CURRENT_ADDRESS_HEADER,
      type: FIELD_TYPES.LABEL,
      name: FIELD_IDS.CURRENT_ADDRESS_HEADER,
      text: "Current Address",
      grid: GRID_LAYOUTS.FULL,
      style: { fontWeight: "bold", fontSize: "16px", marginTop: "24px", marginBottom: "8px" }
    },
    {
      id: FIELD_IDS.BORROWER_STREET,
      type: FIELD_TYPES.TEXT,
      name: FIELD_IDS.BORROWER_STREET,
      label: "Street Address",
      required: true,
      validation: [
        {
          rule: "required",
          message: "This field is required"
        }
      ],
      grid: GRID_LAYOUTS.FULL,
      placeholder: "456 Oak Avenue"
    },
    {
      id: FIELD_IDS.BORROWER_APARTMENT_NUMBER,
      type: FIELD_TYPES.TEXT,
      name: FIELD_IDS.BORROWER_APARTMENT_NUMBER,
      label: "Apt or Unit #",
      required: false,
      grid: GRID_LAYOUTS.HALF,
      placeholder: "Unit 5"
    },
    {
      id: FIELD_IDS.BORROWER_CITY,
      type: FIELD_TYPES.TEXT,
      name: FIELD_IDS.BORROWER_CITY,
      label: "City",
      required: true,
      validation: [
        {
          rule: "required",
          message: "This field is required"
        }
      ],
      grid: GRID_LAYOUTS.HALF,
      placeholder: "San Francisco"
    },
    {
      id: FIELD_IDS.BORROWER_STATE,
      type: FIELD_TYPES.DROPDOWN,
      name: FIELD_IDS.BORROWER_STATE,
      label: "State",
      required: true,
      validation: [
        {
          rule: "required",
          message: "This field is required"
        }
      ],
      grid: GRID_LAYOUTS.HALF,
      options: STATE_OPTIONS
    },
    {
      id: FIELD_IDS.BORROWER_ZIP,
      type: FIELD_TYPES.TEXT,
      name: FIELD_IDS.BORROWER_ZIP,
      label: "ZIP Code",
      required: true,
      validation: [
        {
          rule: "required",
          message: "Please enter a ZIP code"
        },
        {
          rule: "zipCode",
          message: "Please enter a valid ZIP code"
        }
      ],
      grid: GRID_LAYOUTS.HALF,
      placeholder: "94102"
    }
  ]
};