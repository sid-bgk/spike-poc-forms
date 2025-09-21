const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// In-memory store for form configurations
let formConfigs = new Map();

/**
 * Load all form configurations from the configs directory
 */
const loadFormConfigurations = () => {
  const configsDir = path.join(__dirname, '../../configs/forms');

  if (!fs.existsSync(configsDir)) {
    console.warn('Forms config directory not found:', configsDir);
    return;
  }

  const configFiles = fs.readdirSync(configsDir).filter(file => file.endsWith('.json'));

  configFiles.forEach(file => {
    try {
      const configPath = path.join(configsDir, file);
      const configContent = fs.readFileSync(configPath, 'utf8');
      const formConfig = JSON.parse(configContent);

      // Store configuration using the metadata.id as key
      if (formConfig.metadata && formConfig.metadata.id) {
        formConfigs.set(formConfig.metadata.id, formConfig);
        console.log(`Loaded form configuration: ${formConfig.metadata.id}`);
      } else {
        console.warn(`Form configuration in ${file} missing metadata.id`);
      }
    } catch (error) {
      console.error(`Error loading form configuration from ${file}:`, error.message);
    }
  });

  console.log(`Loaded ${formConfigs.size} form configurations`);
};

// Initialize configurations on module load
loadFormConfigurations();

/**
 * GET /api/forms
 * Get all available form configurations
 */
router.get('/', (req, res) => {
  try {
    const forms = Array.from(formConfigs.values()).map(config => ({
      id: config.metadata.id,
      name: config.metadata.name,
      description: config.metadata.description,
      version: config.metadata.version
    }));

    res.json({
      success: true,
      data: forms,
      total: forms.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/forms/:formId
 * Get form configuration by ID
 */
router.get('/:formId', (req, res) => {
  try {
    const { formId } = req.params;
    const config = formConfigs.get(formId);

    if (!config) {
      return res.status(404).json({
        success: false,
        error: `Form configuration not found: ${formId}`
      });
    }

    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/forms/reload
 * Reload form configurations from disk (useful for development)
 */
router.post('/reload', (req, res) => {
  try {
    formConfigs.clear();
    loadFormConfigurations();

    res.json({
      success: true,
      message: `Reloaded ${formConfigs.size} form configurations`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;