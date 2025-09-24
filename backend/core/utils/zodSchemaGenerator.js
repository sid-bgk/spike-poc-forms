const { z } = require('zod');
const jsonLogic = require('json-logic-js');

/**
 * Maps validation rules from form config to Zod schema methods
 */
const VALIDATION_RULE_MAP = {
  required: (value, message) => ({ method: 'min', params: [1, message || 'This field is required'] }),
  minLength: (value, message) => ({ method: 'min', params: [value, message || `Minimum length is ${value}`] }),
  maxLength: (value, message) => ({ method: 'max', params: [value, message || `Maximum length is ${value}`] }),
  email: (value, message) => ({ method: 'email', params: [message || 'Please enter a valid email address'] }),
  phoneUS: (value, message) => ({
    method: 'regex',
    params: [/^(\+1|1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/, message || 'Please enter a valid US phone number']
  }),
  zipCode: (value, message) => ({
    method: 'regex',
    params: [/^\d{5}(-\d{4})?$/, message || 'Please enter a valid ZIP code']
  })
};

/**
 * Creates a base Zod schema based on field type
 */
function createBaseSchema(fieldType) {
  switch (fieldType) {
    case 'email':
      return z.string();
    case 'phone':
      return z.string();
    case 'text':
      return z.string();
    case 'dropdown':
    case 'radio':
      return z.string();
    case 'checkbox':
      return z.boolean();
    case 'date':
      return z.string();
    case 'currency':
      return z.string();
    case 'hidden':
      return z.string();
    default:
      return z.string();
  }
}

/**
 * Applies validation rules to a Zod schema
 */
function applyValidationRules(schema, validationRules, fieldType) {
  if (!validationRules || !Array.isArray(validationRules)) {
    return schema;
  }

  let enhancedSchema = schema;

  for (const rule of validationRules) {
    const { rule: ruleName, value, message } = rule;
    const mapping = VALIDATION_RULE_MAP[ruleName];

    if (mapping) {
      const { method, params } = mapping(value, message);

      if (enhancedSchema[method]) {
        enhancedSchema = enhancedSchema[method](...params);
      }
    }
  }

  return enhancedSchema;
}

/**
 * Evaluates if a field should be included based on conditions
 */
function shouldIncludeField(field, formData) {
  if (!field.conditions || !Array.isArray(field.conditions)) {
    return true;
  }

  // Evaluate each condition - field is shown if ANY condition is true
  return field.conditions.some(condition => {
    try {
      return jsonLogic.apply(condition, formData);
    } catch (error) {
      console.warn(`Error evaluating condition for field ${field.id}:`, error);
      return false;
    }
  });
}

/**
 * Checks if a field is required based on its validation rules
 */
function isFieldRequired(field) {
  if (!field.validation || !Array.isArray(field.validation)) {
    return field.required || false;
  }

  return field.required || field.validation.some(rule => rule.rule === 'required');
}

/**
 * Generates a dynamic Zod schema from form configuration
 */
function generateZodSchema(formConfig, formData = {}) {
  const schemaFields = {};

  // Process all steps and their fields
  for (const step of formConfig.steps || []) {
    // Check if step should be included based on conditions
    if (step.conditions && !step.conditions.some(condition => {
      try {
        return jsonLogic.apply(condition, formData);
      } catch (error) {
        console.warn(`Error evaluating step condition for ${step.id}:`, error);
        return false;
      }
    })) {
      continue;
    }

    for (const field of step.fields || []) {
      // Skip label and hidden fields from validation
      if (field.type === 'label') {
        continue;
      }

      // Check if field should be included based on conditions
      if (!shouldIncludeField(field, formData)) {
        continue;
      }

      // Create base schema
      let fieldSchema = createBaseSchema(field.type);

      // Apply validation rules
      fieldSchema = applyValidationRules(fieldSchema, field.validation, field.type);

      // If field is not required, make it optional
      if (!isFieldRequired(field)) {
        fieldSchema = fieldSchema.optional();
      }

      schemaFields[field.name] = fieldSchema;
    }
  }

  return z.object(schemaFields);
}

/**
 * Validates form data against a form configuration
 */
function validateFormData(formConfig, formData) {
  try {
    // Generate schema based on current form data to handle conditional fields
    const schema = generateZodSchema(formConfig, formData);

    // Validate the data
    const result = schema.safeParse(formData);

    if (result.success) {
      return {
        success: true,
        data: result.data
      };
    } else {
      return {
        success: false,
        errors: result.error.format()
      };
    }
  } catch (error) {
    return {
      success: false,
      errors: {
        _errors: [`Validation error: ${error.message}`]
      }
    };
  }
}

module.exports = {
  generateZodSchema,
  validateFormData,
  shouldIncludeField,
  isFieldRequired
};