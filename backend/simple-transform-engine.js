/**
 * Ultra-Simple Array-Based Transformation Engine POC
 *
 * Converts complex hardcoded transformation functions into simple config-driven arrays.
 * Each field maps to an array of source attempts with fallbacks.
 */

// Simple get function to avoid lodash dependency
function get(obj, path, defaultValue = undefined) {
  if (!obj || !path) return defaultValue;

  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let result = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = result[key];
  }

  return result === undefined ? defaultValue : result;
}

class SimpleTransformEngine {
  constructor() {
    this.transforms = {
      singleToArray: (value) => value ? [this.keysToCamelCase(value)] : [],
      arrayExpand: (array, source) => this.expandArray(array, source),
      arrayIndex: (data, source, fieldName) => this.getArrayIndexField(data, source, fieldName),
      arrayField: (value, source) => this.mapArrayField(value, source)
    };
  }

  /**
   * Main transformation method
   * @param {Object} config - Transformation configuration
   * @param {Object} loanData - Primary loan data source
   * @param {Object} context - Secondary context data source
   * @returns {Object} Transformed form data
   */
  transform(config, loanData, context = {}) {
    const data = {
      loanData,
      context,
      additionalInfo: context.additionalInfo || {},
      primaryBorrower: context.primaryBorrower || {},
      // Flatten for easier access
      ...context
    };

    const result = {};

    for (const [fieldName, sources] of Object.entries(config.transformations.inbound)) {
      const value = this.resolveField(fieldName, sources, data);

      if (this.isDynamicField(fieldName)) {
        // Handle dynamic fields that expand to multiple form fields
        Object.assign(result, value || {});
      } else {
        result[fieldName] = value;
      }
    }

    return result;
  }

  /**
   * Resolve a single field by trying each source in order
   */
  resolveField(fieldName, sources, data) {
    for (const source of sources) {
      // Handle default values
      if (source.default !== undefined) {
        return source.default;
      }

      // Get value from path
      const value = this.getValue(data, source.path);

      // Check conditions
      if (!this.checkCondition(value, source.condition)) {
        continue;
      }

      // Apply transforms and return first successful result
      return this.applyTransform(value, source, fieldName, data);
    }

    return null;
  }

  /**
   * Get value from nested object path
   */
  getValue(data, path) {
    if (!path) return undefined;
    return get(data, path);
  }

  /**
   * Check if value meets condition
   */
  checkCondition(value, condition) {
    if (!condition) return value !== undefined && value !== null;

    switch (condition) {
      case 'notEmpty':
        return value && value !== '';
      case 'arrayNotEmpty':
        return Array.isArray(value) && value.length > 0;
      case 'exists':
        return value !== undefined && value !== null;
      case 'objectNotEmpty':
        return value && typeof value === 'object' && Object.keys(value).length > 0;
      default:
        return true;
    }
  }

  /**
   * Apply transformation to value
   */
  applyTransform(value, source, fieldName, data) {
    const transformType = source.transform || source.type;

    if (!transformType) {
      return value;
    }

    const transformer = this.transforms[transformType];
    if (transformer) {
      return transformer(value, source, fieldName, data);
    }

    // Handle built-in transforms
    switch (transformType) {
      case 'singleToArray':
        return [this.keysToCamelCase(value)];

      case 'arrayExpand':
        return this.expandArray(value, source);

      case 'arrayIndex':
        return this.getArrayIndexField(data, source, fieldName);

      case 'arrayField':
        return this.mapArrayField(value, source);

      default:
        return value;
    }
  }

  /**
   * Expand array into multiple form fields
   */
  expandArray(array, source) {
    const expanded = {};
    if (!Array.isArray(array)) return expanded;

    array.forEach((item, index) => {
      const fieldName = source.pattern.replace('{index}', index + 1);
      expanded[fieldName] = get(item, source.valueField || source.field);
    });

    return expanded;
  }

  /**
   * Get specific field from array by index (extracted from field name)
   */
  getArrayIndexField(data, source, fieldName) {
    const match = fieldName.match(/(\d+)/);
    if (!match) return '';

    const index = parseInt(match[1]) - 1; // Convert to 0-based index
    const array = get(data, source.arrayPath || 'borrowers', []);
    const item = array[index];

    return item ? get(item, source.field) : '';
  }

  /**
   * Map array to extract specific field from each item
   */
  mapArrayField(array, source) {
    if (!Array.isArray(array)) return [];
    return array.map(item => get(item, source.field));
  }

  /**
   * Check if field name contains dynamic patterns
   */
  isDynamicField(fieldName) {
    return fieldName.includes('{index}') || fieldName.includes('*');
  }

  /**
   * Convert snake_case keys to camelCase
   */
  keysToCamelCase(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      converted[camelKey] = value;
    }
    return converted;
  }

  /**
   * Validate transformation configuration
   */
  validateConfig(config) {
    const errors = [];

    if (!config.transformations || !config.transformations.inbound) {
      errors.push('Missing transformations.inbound configuration');
      return errors;
    }

    for (const [fieldName, sources] of Object.entries(config.transformations.inbound)) {
      if (!Array.isArray(sources)) {
        errors.push(`Field '${fieldName}' must have array of sources`);
        continue;
      }

      sources.forEach((source, index) => {
        if (!source.path && source.default === undefined) {
          errors.push(`Field '${fieldName}' source ${index} missing path or default`);
        }
      });
    }

    return errors;
  }
}

module.exports = { SimpleTransformEngine };