// Centralized form configuration exports by ID
// This provides a simple ID-based lookup for all form configurations

// Import all form configurations
import { createSimplifiedApplicationConfig } from './simplifiedApplication/index.js';
import { createPpfBrokerCompleteConfig } from './ppfBrokerComplete/index.js';
import { createPpfRetailWizardConfig } from './ppfRetailWizard/index.js';

// Create base configurations
const simplifiedApplicationConfig = createSimplifiedApplicationConfig();
const ppfBrokerCompleteConfig = createPpfBrokerCompleteConfig();
const ppfRetailWizardConfig = createPpfRetailWizardConfig();

// ID-based form configuration registry
export const FORM_CONFIGS = {
  // Simplified Application
  'simplified-application-poc': simplifiedApplicationConfig,

  // PPF Broker Complete (DSCR + RTL multi-flow)
  'ppf-broker-complete': ppfBrokerCompleteConfig,

  // PPF Retail Wizard (3-phase wizard flow)
  'ppf-retail-wizard': ppfRetailWizardConfig
};

// Factory functions registry for custom configurations
export const FORM_FACTORIES = {
  'simplified-application-poc': createSimplifiedApplicationConfig,
  'ppf-broker-complete': createPpfBrokerCompleteConfig,
  'ppf-retail-wizard': createPpfRetailWizardConfig
};

/**
 * Get form configuration by ID
 * @param {string} formId - The form configuration ID
 * @returns {Object|null} Form configuration or null if not found
 */
export function getFormConfig(formId) {
  return FORM_CONFIGS[formId] || null;
}

/**
 * Get all available form configurations
 * @returns {Object} All form configurations
 */
export function getAllFormConfigs() {
  return FORM_CONFIGS;
}

/**
 * Get form metadata summary for all forms
 * @returns {Array} Array of form metadata objects
 */
export function getFormMetadata() {
  return Object.values(FORM_CONFIGS).map(config => ({
    id: config.metadata.id,
    name: config.metadata.name,
    description: config.metadata.description,
    version: config.metadata.version,
    formType: config.metadata.formType
  }));
}

/**
 * Create custom form configuration with overrides
 * @param {string} formId - The form configuration ID
 * @param {Object} overrides - Configuration overrides
 * @returns {Object|null} Custom form configuration or null if factory not found
 */
export function createFormConfig(formId, overrides = {}) {
  const factory = FORM_FACTORIES[formId];
  if (!factory) {
    return null;
  }
  return factory(overrides);
}

/**
 * Check if form configuration exists
 * @param {string} formId - The form configuration ID
 * @returns {boolean} True if form exists
 */
export function hasFormConfig(formId) {
  return formId in FORM_CONFIGS;
}

/**
 * Get list of all form IDs
 * @returns {Array<string>} Array of form IDs
 */
export function getFormIds() {
  return Object.keys(FORM_CONFIGS);
}

// Default export provides the main registry
export default FORM_CONFIGS;