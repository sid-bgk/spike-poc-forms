import { loanTypeSelectionStep } from './stepModules/loanTypeSelection.js';
import { qualifyingInfoStep } from './stepModules/qualifyingInfo.js';
import { dscrDetailsStep } from './stepModules/dscrDetails.js';
import { rtlDetailsStep } from './stepModules/rtlDetails.js';
import { borrowerSelectionStep } from './stepModules/borrowerSelection.js';
import { TRANSFORMATIONS } from './transformations.js';
import { mergeConfigs } from '../../shared/utils.js';
import { FIELD_IDS } from './constants.js';

/**
 * Creates a PPF Broker Complete form configuration
 * @param {Object} overrides - Configuration overrides at any level
 * @returns {Object} Complete form configuration
 */
export function createPpfBrokerCompleteConfig(overrides = {}) {
  const baseConfig = {
    metadata: {
      id: "ppf-broker-complete",
      name: "PPF Broker All Loan Types",
      version: "1.0.0",
      description: "Multi-flow form supporting DSCR and RTL loan types with dynamic borrower arrays",
      formType: "MULTI_FLOW_FORM"
    },
    flowSelection: {
      step: "loan-type-selection",
      field: "loanTypeName"
    },
    steps: [
      loanTypeSelectionStep,
      qualifyingInfoStep,
      dscrDetailsStep,
      rtlDetailsStep,
      borrowerSelectionStep
    ],
    arrayTemplates: {
      borrowers: {
        minCount: 1,
        maxCount: 4,
        defaultCount: 1,
        countField: FIELD_IDS.NUMBER_OF_BORROWERS,
        fieldTemplate: [
          {
            id: FIELD_IDS.FIRST_NAME,
            type: "text",
            label: "First Name",
            required: true,
            validation: [
              {
                rule: "required",
                message: "Please enter the name"
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
            grid: { xs: 12, sm: 6 },
            arrayIndex: true
          },
          {
            id: FIELD_IDS.LAST_NAME,
            type: "text",
            label: "Last Name",
            required: true,
            validation: [
              {
                rule: "required",
                message: "Please enter the name"
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
            grid: { xs: 12, sm: 6 },
            arrayIndex: true
          },
          {
            id: FIELD_IDS.EMAIL,
            type: "email",
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
            grid: { xs: 12 },
            arrayIndex: true
          },
          {
            id: FIELD_IDS.PHONE,
            type: "phone",
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
            grid: { xs: 12 },
            arrayIndex: true
          },
          {
            id: FIELD_IDS.SSN,
            type: "password",
            label: "SSN (9 digits)",
            required: true,
            validation: [
              {
                rule: "required",
                message: "This field is required"
              }
            ],
            grid: { xs: 12, sm: 6 },
            arrayIndex: true
          },
          {
            id: FIELD_IDS.DATE_OF_BIRTH,
            type: "date",
            label: "Date of Birth",
            required: true,
            validation: [
              {
                rule: "required",
                message: "This field is required"
              }
            ],
            grid: { xs: 12, sm: 6 },
            arrayIndex: true
          }
        ]
      }
    },
    navigation: {
      type: "stepped",
      allowBackward: true,
      allowSkipping: false,
      showProgress: true,
      completionRequired: true
    },
    transformations: TRANSFORMATIONS
  };

  return mergeConfigs(baseConfig, overrides);
}

// Default export for backward compatibility
export default createPpfBrokerCompleteConfig();