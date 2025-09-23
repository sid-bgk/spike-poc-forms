const path = require("path");
const { validateFormData } = require("../utils/zodSchemaGenerator");
const { getConfigById } = require("../services/FormService");

/**
 * Middleware to validate form submission data against form configuration
 */
async function validateFormSubmission(req, res, next) {
  try {
    const { formId } = req.params;
    const formData = req.body;

    // Get form configuration
    const formConfig = getConfigById(formId);
    if (!formConfig) {
      return res.status(404).json({
        success: false,
        error: `Form configuration not found: ${formId}`,
      });
    }

    // Validate form data
    const validationResult = validateFormData(formConfig, formData);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        validationErrors: validationResult.errors,
        formId,
      });
    }

    // Add validated data to request for use in route handler
    req.validatedFormData = validationResult.data;
    req.formConfig = formConfig;

    next();
  } catch (error) {
    console.error("Error in form validation middleware:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error during validation",
    });
  }
}

module.exports = { validateFormSubmission };
