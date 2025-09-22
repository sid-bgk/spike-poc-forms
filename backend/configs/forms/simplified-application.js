import {
  createPersonalInfoStep,
  createPropertyInfoStep,
  createAccountTypeStep,
  createJointPropertyInfoStep
} from '../../step-templates/index.js';
import { mergeConfigs } from '../../utils/config-merger.js';

/**
 * Creates a simplified loan application form configuration
 * @param {Object} overrides - Configuration overrides
 * @returns {Object} Complete form configuration
 */
export function createSimplifiedApplicationConfig(overrides = {}) {
  const baseConfig = {
    metadata: {
      id: "simplified-application-poc",
      name: "Simplified Loan Application POC",
      version: "1.0.0",
      description: "POC demonstrating centralized form configuration with conditional steps",
      formType: "APPLICATION_FORM"
    },
    steps: [
      createPersonalInfoStep(overrides.personalInfo),
      createPropertyInfoStep(overrides.propertyInfo),
      createAccountTypeStep(overrides.accountType),
      createJointPropertyInfoStep(overrides.jointPropertyInfo)
    ],
    navigation: {
      type: "stepped",
      allowBackward: true,
      allowSkipping: false,
      showProgress: true,
      completionRequired: true
    },
    validation: {
      globalRules: [
        {
          type: "crossField",
          fields: ["email", "mobile"],
          rule: "unique",
          message: "Email and mobile must be unique across all applicants"
        }
      ]
    },
    transformations: {
      inbound: {
        "borrower.personal.firstName": "first_name",
        "borrower.personal.lastName": "last_name",
        "borrower.personal.email": "email",
        "borrower.personal.mobile": "mobile",
        "property.current.city": "property_city",
        "property.current.state": "property_state",
        "property.current.zip": "property_zip",
        "property.residencyInfo.livedMoreThan2Years": "lived_more_than_2_years",
        "property.previous.city": "previous_city",
        "property.previous.state": "previous_state",
        "property.previous.zip": "previous_zip",
        "application.type": "application_type",
        "jointBorrower.property.current.city": "joint_property_city",
        "jointBorrower.property.current.state": "joint_property_state",
        "jointBorrower.property.current.zip": "joint_property_zip",
        "jointBorrower.property.residencyInfo.livedMoreThan2Years": "joint_lived_more_than_2_years",
        "jointBorrower.property.previous.city": "joint_previous_city",
        "jointBorrower.property.previous.state": "joint_previous_state",
        "jointBorrower.property.previous.zip": "joint_previous_zip"
      },
      outbound: {
        "first_name": "borrower.personal.firstName",
        "last_name": "borrower.personal.lastName",
        "email": "borrower.personal.email",
        "mobile": "borrower.personal.mobile",
        "property_city": "property.current.city",
        "property_state": "property.current.state",
        "property_zip": "property.current.zip",
        "lived_more_than_2_years": "property.residencyInfo.livedMoreThan2Years",
        "previous_city": "property.previous.city",
        "previous_state": "property.previous.state",
        "previous_zip": "property.previous.zip",
        "application_type": "application.type",
        "joint_property_city": "jointBorrower.property.current.city",
        "joint_property_state": "jointBorrower.property.current.state",
        "joint_property_zip": "jointBorrower.property.current.zip",
        "joint_lived_more_than_2_years": "jointBorrower.property.residencyInfo.livedMoreThan2Years",
        "joint_previous_city": "jointBorrower.property.previous.city",
        "joint_previous_state": "jointBorrower.property.previous.state",
        "joint_previous_zip": "jointBorrower.property.previous.zip"
      }
    }
  };

  return mergeConfigs(baseConfig, overrides);
}

// Default export for backward compatibility
export default createSimplifiedApplicationConfig();