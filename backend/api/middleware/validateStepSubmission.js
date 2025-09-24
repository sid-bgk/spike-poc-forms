const { validateFormData } = require("../../core/utils/zodSchemaGenerator");
const { getConfigById } = require("../../core/services/form-service");

/**
 * Middleware to validate step submission data against form configuration
 */
async function validateStepSubmission(req, res, next) {
  try {
    const { formId } = req.params;
    const { stepId, data: stepData } = req.body;

    // Get form configuration
    const formConfig = getConfigById(formId);
    if (!formConfig) {
      return res.status(404).json({
        success: false,
        error: `Form configuration not found: ${formId}`
      });
    }

    // Find the specific step
    const step = formConfig.steps.find(s => s.id === stepId);
    if (!step) {
      return res.status(404).json({
        success: false,
        error: `Step not found: ${stepId}`
      });
    }

    // Create a temporary form config with only this step for validation
    const stepConfig = {
      ...formConfig,
      steps: [step]
    };

    // Validate step data using existing validation system
    const validationResult = validateFormData(stepConfig, stepData);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: "Step validation failed",
        validationErrors: validationResult.errors,
        stepId,
        formId
      });
    }

    // Add validated data to request for use in route handler
    req.validatedStepData = validationResult.data;
    req.step = step;
    req.formConfig = formConfig;

    next();
  } catch (error) {
    console.error("Error in step validation middleware:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error during step validation"
    });
  }
}

module.exports = { validateStepSubmission };