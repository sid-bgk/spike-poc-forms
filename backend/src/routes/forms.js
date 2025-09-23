const express = require('express');
const { getConfigById, getAllConfigs } = require('../services/FormService');
const { validateFormSubmission } = require('../middleware/validateFormSubmission');
const { validateStepSubmission } = require('../middleware/validateStepSubmission');

const router = express.Router();

/**
 * GET /api/forms
 * Get all available form configurations
 */
router.get('/', (req, res) => {
  try {
    const forms = getAllConfigs();

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
    const config = getConfigById(formId);

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
 * POST /api/forms/:formId/submit
 * Handle form submission with validation and log the response
 */
router.post('/:formId/submit', validateFormSubmission, (req, res) => {
  try {
    const { formId } = req.params;
    const originalPayload = req.body;
    const validatedData = req.validatedFormData;

    console.log('=== FORM SUBMISSION ===');
    console.log('Form ID:', formId);
    console.log('Original Payload:', JSON.stringify(originalPayload, null, 2));
    console.log('Validated Data:', JSON.stringify(validatedData, null, 2));
    console.log('Timestamp:', new Date().toISOString());
    console.log('========================');

    res.json({
      success: true,
      message: 'Form submission received, validated, and logged',
      formId,
      validatedData,
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
 * POST /api/forms/:formId/save-progress
 * Handle step-wise form progress saving with validation
 */
router.post('/:formId/save-progress', validateStepSubmission, (req, res) => {
  try {
    const { formId } = req.params;
    const { stepId, sessionId } = req.body;
    const validatedData = req.validatedStepData;
    const step = req.step;

    console.log('=== STEP SAVE ===');
    console.log('Form ID:', formId);
    console.log('Step ID:', stepId);
    console.log('Session ID:', sessionId);
    console.log('Step Name:', step.name);
    console.log('Validated Data:', JSON.stringify(validatedData, null, 2));
    console.log('Timestamp:', new Date().toISOString());
    console.log('=================');

    res.json({
      success: true,
      message: 'Step progress saved successfully',
      formId,
      stepId,
      stepName: step.name,
      validatedData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing step save:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;