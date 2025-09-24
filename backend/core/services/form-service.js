const fs = require('fs');
const path = require('path');

// Cache for loaded configurations
let configCache = null;
let registryCache = null;
let sharedFieldsCache = {};

/**
 * Load and resolve a shared field reference
 * @param {string} refPath - The reference path (e.g., "../shared-fields/personal-info-fields.json#/first_name")
 * @param {string} baseDir - The base directory for resolving relative paths
 * @returns {Object|null} The resolved field definition
 */
function loadSharedField(refPath, baseDir) {
  try {
    const [filePath, fieldPath] = refPath.split('#');
    const fullPath = path.resolve(baseDir, filePath);

    // Load shared fields file if not cached
    if (!sharedFieldsCache[fullPath]) {
      if (!fs.existsSync(fullPath)) {
        console.error(`Shared field file not found: ${fullPath}`);
        return null;
      }
      const fieldData = fs.readFileSync(fullPath, 'utf8');
      sharedFieldsCache[fullPath] = JSON.parse(fieldData);
    }

    // Navigate to specific field using fieldPath (e.g., "/first_name" or "/name/minLength")
    const pathParts = fieldPath.substring(1).split('/'); // Remove leading "/" and split
    let result = sharedFieldsCache[fullPath];

    for (const part of pathParts) {
      if (result && typeof result === 'object') {
        result = result[part];
      } else {
        return null;
      }
    }

    return result || null;
  } catch (error) {
    console.error(`Error loading shared field ${refPath}:`, error.message);
    return null;
  }
}

/**
 * Recursively resolve field references in a configuration object
 * @param {Object} obj - The configuration object to process
 * @param {string} baseDir - The base directory for resolving relative paths
 * @returns {Object} The object with resolved field references
 */
function resolveFieldReferences(obj, baseDir) {
  if (Array.isArray(obj)) {
    return obj.map(item => resolveFieldReferences(item, baseDir));
  }

  if (obj && typeof obj === 'object') {
    // If this object has a $ref property, resolve it
    if (obj.$ref) {
      const sharedField = loadSharedField(obj.$ref, baseDir);
      if (sharedField) {
        // Merge shared field with any local overrides (excluding $ref)
        const { $ref, ...localOverrides } = obj;
        const merged = { ...sharedField, ...localOverrides };

        // Recursively resolve any nested references in the merged object
        return resolveFieldReferences(merged, baseDir);
      } else {
        console.warn(`Failed to resolve field reference: ${obj.$ref}`);
        return obj; // Return original if reference fails
      }
    }

    // Recursively process all object properties
    const resolved = {};
    for (const [key, value] of Object.entries(obj)) {
      resolved[key] = resolveFieldReferences(value, baseDir);
    }
    return resolved;
  }

  return obj; // Return primitive values as-is
}

/**
 * Load all form configurations from JSON files
 */
function loadConfigurations() {
  try {
    const formsJsonDir = path.join(__dirname, '../../configs/forms-json');
    const registryPath = path.join(formsJsonDir, 'registry.json');

    if (!fs.existsSync(registryPath)) {
      throw new Error('Registry file not found. Run the conversion script first.');
    }

    // Load registry
    const registryData = fs.readFileSync(registryPath, 'utf8');
    registryCache = JSON.parse(registryData);

    // Load all form configurations
    configCache = {};

    registryCache.forms.forEach(form => {
      const configPath = path.join(formsJsonDir, form.file);
      if (fs.existsSync(configPath)) {
        const configData = fs.readFileSync(configPath, 'utf8');
        let config = JSON.parse(configData);

        // Resolve field references
        const baseDir = path.dirname(configPath);
        config = resolveFieldReferences(config, baseDir);

        configCache[form.id] = config;
      }
    });

    console.log(`Loaded ${Object.keys(configCache).length} form configurations from JSON`);
    return true;
  } catch (error) {
    console.error('Error loading form configurations:', error.message);
    return false;
  }
}

/**
 * Get form configuration by ID
 * @param {string} id - Form configuration ID
 * @returns {Object|null} Form configuration or null if not found
 */
function getConfigById(id) {
  // Initialize cache if not loaded
  if (!configCache) {
    const loaded = loadConfigurations();
    if (!loaded) return null;
  }

  return configCache[id] || null;
}

/**
 * Get all available form configurations
 * @returns {Array} Array of form metadata objects
 */
function getAllConfigs() {
  // Initialize cache if not loaded
  if (!configCache || !registryCache) {
    const loaded = loadConfigurations();
    if (!loaded) return [];
  }

  return registryCache.forms.map(form => ({
    id: form.id,
    name: form.name,
    version: form.version,
    description: configCache[form.id]?.metadata?.description || 'No description available'
  }));
}

module.exports = {
  getConfigById,
  getAllConfigs
};