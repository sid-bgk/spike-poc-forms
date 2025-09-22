import { personalInfoStep } from './stepModules/personalInfo.js';
import { propertyInfoStep } from './stepModules/propertyInfo.js';
import { accountTypeStep } from './stepModules/accountType.js';
import { jointPropertyStep } from './stepModules/jointProperty.js';
import { TRANSFORMATIONS } from './transformations.js';
import { mergeConfigs } from '../../shared/utils.js';

/**
 * Creates a single-page application form configuration
 * Steps are rendered as sections when flowConfig.type === 'single'
 * @param {Object} overrides - Configuration overrides at any level
 * @returns {Object} Complete form configuration
 */
export function createSinglePageApplicationConfig(overrides = {}) {
  const baseConfig = {
    metadata: {
      id: 'single-page-application',
      name: 'Single Page Application',
      version: '1.0.0',
      description: 'Standalone form rendered as a single page with sectioned steps',
    },
    // Single-page flow: steps are sections; no step navigation
    flowConfig: {
      type: 'single',
      navigation: 'sections',
    },
    steps: [personalInfoStep, propertyInfoStep, accountTypeStep, jointPropertyStep],
    validation: {
      globalRules: [
        {
          type: 'crossField',
          fields: ['email', 'mobile'],
          rule: 'unique',
          message: 'Email and mobile must be unique across all applicants',
        },
      ],
    },
    transformations: TRANSFORMATIONS,
  };

  return mergeConfigs(baseConfig, overrides);
}

// Default export for backward compatibility
export default createSinglePageApplicationConfig();

