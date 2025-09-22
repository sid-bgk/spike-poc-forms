// Utility functions for form configuration

/**
 * Deep merge utility for configuration overrides
 * @param {Object} target - Base configuration object
 * @param {...Object} sources - Override objects to merge
 * @returns {Object} Merged configuration
 */
export function mergeConfigs(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeConfigs(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeConfigs(target, ...sources);
}

/**
 * Check if item is a plain object
 * @param {*} item - Item to check
 * @returns {boolean} True if item is a plain object
 */
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}