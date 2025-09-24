const patternRegistry = require("./patterns");

// Simple get function to avoid lodash dependency
function get(obj, path, defaultValue = undefined) {
  if (!obj || !path) return defaultValue;

  // Handle quoted keys like ["saaf:DEAL_EXTENSION"] and array indices
  const keys = path
    .replace(/\[\"([^"]+)\"\]/g, ".$1") // Convert ["quoted"] to .quoted
    .replace(/\[\'([^']+)\'\]/g, ".$1") // Convert ['quoted'] to .quoted
    .replace(/\[(\d+)\]/g, ".$1") // Convert [0] to .0
    .split(".")
    .filter((key) => key !== ""); // Remove empty strings

  let result = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = result[key];
  }

  return result === undefined ? defaultValue : result;
}

/**
 * Core transformation functions - pure functional approach
 */

// Path resolution function
const resolvePath = (data, path) => {
  if (!path) return undefined;
  return get(data, path);
};

// Condition checking functions
const conditionCheckers = {
  notEmpty: (value) => Boolean(value && value !== ""),
  arrayNotEmpty: (value) => Array.isArray(value) && value.length > 0,
  exists: (value) => value !== undefined && value !== null,
  objectNotEmpty: (value) =>
    Boolean(
      value && typeof value === "object" && Object.keys(value).length > 0
    ),
  default: (value) => value !== undefined && value !== null,
};

// Core transformation functions
const transformers = {
  // Convert single object to array (for borrower fallback)
  singleToArray: (value) => (value ? [keysToCamelCase(value)] : []),

  // Expand array into multiple form fields with dynamic naming
  arrayExpand: (array, config) => {
    const expanded = {};
    if (!Array.isArray(array)) return expanded;

    array.forEach((item, index) => {
      const fieldName = config.pattern.replace("{index}", index + 1);
      expanded[fieldName] = get(item, config.valueField || config.field);
    });

    return expanded;
  },

  // Get specific field from array by index (extracted from field name)
  arrayIndex: (data, config, fieldName) => {
    const match = fieldName.match(/(\d+)/);
    if (!match) return "";

    const index = parseInt(match[1]) - 1; // Convert to 0-based index
    const array = get(data, config.arrayPath || "borrowers", []);
    const item = array[index];

    return item ? get(item, config.field) : "";
  },

  // Map array to extract specific field from each item
  arrayField: (array, config) => {
    if (!Array.isArray(array)) return [];
    return array.map((item) => get(item, config.field));
  },

  // Phone number formatting (for retail forms)
  formatPhone: (phoneValue, countryCode = "US") => {
    if (!phoneValue) return "";
    // Basic phone formatting - could be enhanced with libphonenumber-js
    return phoneValue.replace(/\D/g, "").slice(-10);
  },

  // Date formatting for forms
  formatDate: (dateValue) => {
    if (!dateValue) return "";
    try {
      return new Date(dateValue).toISOString().split("T")[0];
    } catch {
      return dateValue;
    }
  },

  // Percentage calculations (for DSCR, LTV, etc.)
  calculatePercentage: (numerator, denominator, multiplier = 100) => {
    if (!numerator || !denominator) return 0;
    return ((numerator / denominator) * multiplier).toFixed(2);
  },

  // Amount formatting (for currency fields)
  formatAmount: (amount) => {
    if (!amount) return "";
    return typeof amount === "string" ? amount : amount.toString();
  },
};

// Utility function to convert snake_case keys to camelCase
function keysToCamelCase(obj) {
  if (!obj || typeof obj !== "object") return obj;

  const converted = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase()
    );
    converted[camelKey] = value;
  }
  return converted;
}

/**
 * Check if value meets condition
 */
const checkCondition = (value, condition) => {
  if (!condition) return conditionCheckers.default(value);
  return conditionCheckers[condition]
    ? conditionCheckers[condition](value)
    : true;
};

/**
 * Apply transformation to value
 */
const applyTransform = (value, config, fieldName, data) => {
  const transformType = config.transform || config.type;

  if (!transformType) {
    return value;
  }

  const transformer = transformers[transformType];
  if (transformer) {
    return transformer(value, config, fieldName, data);
  }

  // Handle built-in transforms that need special logic
  switch (transformType) {
    case "singleToArray":
      return transformers.singleToArray(value);
    case "arrayExpand":
      return transformers.arrayExpand(value, config);
    case "arrayIndex":
      return transformers.arrayIndex(data, config, fieldName);
    case "arrayField":
      return transformers.arrayField(value, config);
    case "formatPhone":
      return transformers.formatPhone(value, config.countryCode);
    case "formatDate":
      return transformers.formatDate(value);
    case "formatAmount":
      return transformers.formatAmount(value);
    default:
      return value;
  }
};

/**
 * Resolve a single field by trying each source in order
 */
const resolveField = (fieldName, sources, data) => {
  for (const source of sources) {
    // Handle default values
    if (source.default !== undefined) {
      return source.default;
    }

    // Get value from path
    const value = resolvePath(data, source.path);

    // Check conditions
    if (!checkCondition(value, source.condition)) {
      continue;
    }

    // Apply transforms and return first successful result
    return applyTransform(value, source, fieldName, data);
  }

  return null;
};

/**
 * Check if field name contains dynamic patterns
 */
const isDynamicField = (fieldName) => {
  return fieldName.includes("{index}") || fieldName.includes("*");
};

/**
 * Main transformation function - functional approach
 */
const transform = (config, loanData, context = {}) => {
  // Build data context with all sources flattened for easy access
  const data = {
    loanData,
    context,
    additionalInfo: context.additionalInfo || {},
    primaryBorrower: context.primaryBorrower || {},
    // Flatten context for easier access
    ...context,
  };

  const result = {};
  const transformations = config.transformations?.inbound || {};

  for (const [fieldName, sources] of Object.entries(transformations)) {
    const value = resolveField(fieldName, sources, data);

    if (isDynamicField(fieldName)) {
      // Handle dynamic fields that expand to multiple form fields
      Object.assign(result, value || {});
    } else {
      result[fieldName] = value;
    }
  }

  return result;
};

/**
 * Reverse transformation (form data → database format)
 */
const reverseTransform = (config, formData, context = {}) => {
  const result = {};
  const transformations = config.transformations?.outbound || {};

  for (const [dbField, sources] of Object.entries(transformations)) {
    const value = resolveField(dbField, sources, formData);

    // Handle nested object paths for database storage
    if (dbField.includes(".")) {
      setNestedValue(result, dbField, value);
    } else {
      result[dbField] = value;
    }
  }

  return result;
};

/**
 * Helper function to set nested object values
 */
const setNestedValue = (obj, path, value) => {
  const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    // Check if the next key is a number (array index)
    const isNextKeyArrayIndex = /^\d+$/.test(nextKey);

    if (!(key in current)) {
      // Create array if next key is array index, object otherwise
      current[key] = isNextKeyArrayIndex ? [] : {};
    }

    current = current[key];
  }

  const finalKey = keys[keys.length - 1];
  current[finalKey] = value;
};

/**
 * Validate transformation configuration
 */
const validateConfig = (config) => {
  const errors = [];

  if (!config.transformations || !config.transformations.inbound) {
    errors.push("Missing transformations.inbound configuration");
    return errors;
  }

  for (const [fieldName, sources] of Object.entries(
    config.transformations.inbound
  )) {
    if (!Array.isArray(sources)) {
      errors.push(`Field '${fieldName}' must have array of sources`);
      continue;
    }

    sources.forEach((source, index) => {
      if (!source.path && source.default === undefined) {
        errors.push(
          `Field '${fieldName}' source ${index} missing path or default`
        );
      }
    });
  }

  return errors;
};

/**
 * Enhanced transformation engine supporting all SAAF patterns
 */
const createTransformationEngine = (customTransformers = {}) => {
  // Merge custom transformers with built-in ones
  const allTransformers = { ...transformers, ...customTransformers };

  return {
    transform: (config, loanData, context) =>
      transform(config, loanData, context),
    reverseTransform: (config, formData, context) =>
      reverseTransform(config, formData, context),
    validateConfig: (config) => validateConfig(config),

    // Individual utility functions for custom use
    resolveField: (fieldName, sources, data) =>
      resolveField(fieldName, sources, data),
    applyTransform: (value, config, fieldName, data) =>
      applyTransform(value, config, fieldName, data),
    checkCondition: (value, condition) => checkCondition(value, condition),

    // Transformer access
    transformers: allTransformers,

    // Support for specific SAAF patterns
    patterns: patternRegistry.patterns,

    // Pattern management functions
    registerPattern: patternRegistry.registerPattern,
    getPattern: patternRegistry.getPattern,
    getAllPatterns: patternRegistry.getAllPatterns,
    hasPattern: patternRegistry.hasPattern,
    getPatternInfo: patternRegistry.getPatternInfo,
  };
};

// Export functional API
module.exports = {
  createTransformationEngine,
  transform,
  reverseTransform,
  validateConfig,
  transformers,
  conditionCheckers,

  // Individual functions for advanced use
  resolveField,
  applyTransform,
  checkCondition,
  resolvePath,
  keysToCamelCase,

  // Default engine instance
  defaultEngine: createTransformationEngine(),
};
