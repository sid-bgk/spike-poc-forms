const path = require('path');
const { validateFormData } = require('../utils/zodSchemaGenerator');

/**
 * Middleware to validate form submission data against form configuration
 */
async function validateFormSubmission(req, res, next) {
  try {
    const { formId } = req.params;
    const formData = req.body;

    // Load form configurations if not already loaded
    let formConfigModule;
    try {
      const configsIndexPath = path.join(__dirname, '../../configs/forms/index.js');
      const moduleUrl = `file://${configsIndexPath.replace(/\\/g, '/')}`;
      formConfigModule = await import(moduleUrl);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Form configurations could not be loaded'
      });
    }

    // Get form configuration
    const formConfig = formConfigModule.getFormConfig(formId);
    if (!formConfig) {
      return res.status(404).json({
        success: false,
        error: `Form configuration not found: ${formId}`
      });
    }

    // Validate form data
    const validationResult = validateFormData(formConfig, formData);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        validationErrors: validationResult.errors,
        formId
      });
    }

    // Add validated data to request for use in route handler
    req.validatedFormData = validationResult.data;
    req.formConfig = formConfig;

    next();
  } catch (error) {
    console.error('Error in form validation middleware:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during validation'
    });
  }
}

module.exports = { validateFormSubmission };