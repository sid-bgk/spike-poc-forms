const express = require('express');
const path = require('path');

const router = express.Router();

// Import the centralized form configuration registry
let formConfigModule;

/**
 * Load form configurations using the centralized registry
 */
const loadFormConfigurations = async () => {
  try {
    const configsIndexPath = path.join(__dirname, '../../configs/forms/index.js');
    const moduleUrl = `file://${configsIndexPath.replace(/\\/g, '/')}`;

    formConfigModule = await import(moduleUrl);

    const formIds = formConfigModule.getFormIds();
    console.log(`Loaded ${formIds.length} form configurations: ${formIds.join(', ')}`);
  } catch (error) {
    console.error('Error loading form configurations:', error.message);
    throw error;
  }
};

// Initialize configurations on module load
loadFormConfigurations().catch(err => {
  console.error('Error initializing form configurations:', err);
});

/**
 * GET /api/forms
 * Get all available form configurations
 */
router.get('/', (req, res) => {
  try {
    if (!formConfigModule) {
      return res.status(500).json({
        success: false,
        error: 'Form configurations not loaded'
      });
    }

    const forms = formConfigModule.getFormMetadata();

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
    if (!formConfigModule) {
      return res.status(500).json({
        success: false,
        error: 'Form configurations not loaded'
      });
    }

    const { formId } = req.params;
    const config = formConfigModule.getFormConfig(formId);

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
 * POST /api/forms/:formId/generate
 * Generate form configuration with custom overrides
 */
router.post('/:formId/generate', async (req, res) => {
  try {
    if (!formConfigModule) {
      return res.status(500).json({
        success: false,
        error: 'Form configurations not loaded'
      });
    }

    const { formId } = req.params;
    const overrides = req.body || {};

    // Try to create custom configuration with factory function
    const customConfig = formConfigModule.createFormConfig(formId, overrides);

    if (customConfig) {
      res.json({
        success: true,
        data: customConfig,
        message: `Generated custom configuration for ${formId} with overrides`
      });
    } else {
      // Fallback to base configuration
      const baseConfig = formConfigModule.getFormConfig(formId);

      if (!baseConfig) {
        return res.status(404).json({
          success: false,
          error: `Form configuration not found: ${formId}`
        });
      }

      res.json({
        success: true,
        data: baseConfig,
        message: `Returned base configuration for ${formId} (no factory function available)`
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/forms/:formId/submit
 * Handle form submission and log the response
 */
router.post('/:formId/submit', (req, res) => {
  try {
    const { formId } = req.params;
    const payload = req.body;

    console.log('=== FORM SUBMISSION ===');
    console.log('Form ID:', formId);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('Timestamp:', new Date().toISOString());
    console.log('========================');

    res.json({
      success: true,
      message: 'Form submission received and logged',
      formId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
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
router.post('/reload', async (req, res) => {
  try {
    // Clear module cache for hot reload
    const configsIndexPath = path.join(__dirname, '../../configs/forms/index.js');
    const moduleUrl = `file://${configsIndexPath.replace(/\\/g, '/')}`;

    // Reload the module
    await loadFormConfigurations();

    const formIds = formConfigModule ? formConfigModule.getFormIds() : [];

    res.json({
      success: true,
      message: `Reloaded ${formIds.length} form configurations: ${formIds.join(', ')}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;