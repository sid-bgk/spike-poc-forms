const fs = require('fs');
const path = require('path');

// Cache for loaded configurations
let configCache = null;
let registryCache = null;

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
        configCache[form.id] = JSON.parse(configData);
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