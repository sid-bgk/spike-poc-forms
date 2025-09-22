import { personalInfoStep } from './stepModules/personalInfo.js';
import { propertyInfoStep } from './stepModules/propertyInfo.js';
import { accountTypeStep } from './stepModules/accountType.js';
import { jointPropertyStep } from './stepModules/jointProperty.js';
import { TRANSFORMATIONS } from './transformations.js';
import { mergeConfigs } from '../../shared/utils.js';

/**
 * Creates a simplified loan application form configuration
 * @param {Object} overrides - Configuration overrides at any level
 * @returns {Object} Complete form configuration
 */
export function createSimplifiedApplicationConfig(overrides = {}) {
  const baseConfig = {
    metadata: {
      id: "simplified-application-poc",
      name: "Simplified Loan Application POC",
      version: "1.0.0",
      description: "POC demonstrating centralized form configuration with conditional steps",
    },
    // New unified flow configuration (Phase 1)
    flowConfig: {
      type: "linear",
      navigation: "stepped",
    },
    steps: [
      personalInfoStep,
      propertyInfoStep,
      accountTypeStep,
      jointPropertyStep
    ],
    // Navigation now implied via flowConfig; omit legacy root-level navigation
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
    transformations: TRANSFORMATIONS
  };

  return mergeConfigs(baseConfig, overrides);
}

// Default export for backward compatibility
export default createSimplifiedApplicationConfig();
