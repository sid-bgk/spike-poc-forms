# SAAF Form Engine Configuration Architecture Guide

## Overview

The SAAF Form Engine is a centralized, configuration-driven system for managing dynamic forms with complex conditional logic, validation, and multi-step flows. This guide provides a comprehensive understanding of how configurations are structured and processed.

## Architecture Overview

```
spike_poc/backend/
├── configs/                    # Configuration storage
│   └── forms/                 # Form configuration files
│       ├── simplified-application.json
│       ├── ppf-retail-wizard.json
│       └── ppf-broker-complete.json
├── src/
│   ├── engine/                # Core processing engines
│   │   ├── formEngine.js      # Main orchestrator
│   │   ├── conditionalEngine.js  # JSON-Logic conditions
│   │   ├── validationEngine.js   # Field validation
│   │   ├── transformationEngine.js # Data transformation
│   │   ├── arrayFieldEngine.js   # Dynamic arrays
│   │   └── wizardEngine.js       # Wizard flow processing
│   ├── routes/               # API endpoints
│   │   └── forms.js          # REST API routes
│   └── server.js             # Express server setup
├── package.json
└── server.js                 # Main entry point
```

## Configuration Structure

### 1. Form Configuration Schema

Every form configuration follows this top-level structure:

```json
{
  "metadata": {
    "id": "form-identifier",
    "name": "Human Readable Name",
    "version": "1.0.0",
    "description": "Form description",
    "formType": "APPLICATION_FORM | WIZARD_FLOW_FORM | MULTI_FLOW_FORM"
  },
  "steps": [...],
  "navigation": {...},
  "validation": {...},
  "transformations": {...}
}
```

#### Key Form Types:

- **APPLICATION_FORM**: Traditional multi-step forms with static navigation
- **WIZARD_FLOW_FORM**: Dynamic wizard with phases and intelligent navigation
- **MULTI_FLOW_FORM**: Multiple flows based on user selection

### 2. Step Configuration

Each step represents a logical grouping of fields:

```json
{
  "id": "step-identifier",
  "name": "Step Display Name",
  "description": "Step description",
  "order": 1,
  "required": true,
  "phase": "phase1",              // For wizard forms
  "stepType": "question",         // For wizard steps
  "category": "Qualifying Info",  // For categorization
  "showPricer": true,            // Show pricing widget
  "hideContinueButton": true,    // Auto-advance on selection
  "conditions": [...],           // Conditional visibility
  "fields": [...]
}
```

### 3. Field Configuration

Fields are the building blocks of forms:

```json
{
  "id": "fieldId",
  "type": "text | email | phone | dropdown | radio | options | optionsCards | label",
  "name": "fieldName",
  "label": "Field Label",
  "required": true,
  "validation": ["required", "email", "phoneUS", "zipCode"],
  "grid": { "xs": 12, "sm": 6 },
  "placeholder": "Enter value...",
  "options": [...],              // For dropdown/radio fields
  "conditions": [...],           // Conditional visibility
  "requiredConditions": [...],   // Conditional requirements
  "disabledConditions": [...],   // Conditional disabled state
  "style": {...}                 // Custom styling
}
```

#### Field Types:

- **text**: Basic text input
- **email**: Email validation
- **phone**: Phone number with formatting
- **dropdown**: Select dropdown
- **radio**: Radio button group
- **options**: Button-style options
- **optionsCards**: Card-based selection with descriptions
- **label**: Display-only text/headers

### 4. Conditional Logic

Uses [JSON Logic](http://jsonlogic.com/) for powerful conditional expressions:

```json
{
  "conditions": [
    {
      "===": [{"var": "applicationType"}, "joint"]
    }
  ]
}
```

Common operators:
- `===`, `!==`: Equality/inequality
- `>`, `<`, `>=`, `<=`: Comparisons
- `and`, `or`: Logical operators
- `var`: Reference field values
- `in`: Check if value in array

### 5. Validation Rules

Built-in validation types:
- `required`: Field must have value
- `email`: Valid email format
- `phoneUS`: US phone number format
- `zipCode`: US ZIP code format
- `minLength:n`: Minimum length
- `maxLength:n`: Maximum length

### 6. Data Transformations

Map between form fields and database schema:

```json
{
  "transformations": {
    "inbound": {
      "borrower.personal.firstName": "firstName",
      "property.current.city": "propertyCity"
    },
    "outbound": {
      "firstName": "borrower.personal.firstName",
      "propertyCity": "property.current.city"
    }
  }
}
```

## Engine Architecture

### 1. Form Engine (`formEngine.js`)

Main orchestrator that:
- Loads and validates configurations
- Processes forms with current values
- Manages step visibility and navigation
- Handles validation and transformations

Key methods:
- `processForm(formId, formValues)`: Get visible steps/fields
- `validateFormData(formId, formData, stepId)`: Validate data
- `transformToDatabase(formId, formData)`: Convert to DB format
- `getNextStep(formId, currentStepId, formValues)`: Navigation

### 2. Conditional Engine (`conditionalEngine.js`)

Evaluates JSON Logic conditions:
- Step visibility: `evaluateStepConditions(step, formValues)`
- Field visibility: `evaluateFieldConditions(field, formValues)`
- Required state: `evaluateFieldRequired(field, formValues)`
- Disabled state: `evaluateFieldDisabled(field, formValues)`

### 3. Wizard Engine (`wizardEngine.js`)

Handles multi-phase wizard flows:
- Phase management and progression
- Dynamic step ordering
- Question-by-question navigation
- Progress calculation across phases

### 4. Array Field Engine (`arrayFieldEngine.js`)

Manages dynamic arrays (borrowers, properties, etc.):
- Generates dynamic steps based on count
- Handles array validation
- Transforms array data structures

### 5. Transformation Engine (`transformationEngine.js`)

Data mapping between forms and database:
- Nested path mapping (lodash get/set)
- Bidirectional transformations
- Complex object restructuring

### 6. Validation Engine (`validationEngine.js`)

Field and form validation:
- Built-in validation rules
- Custom validation logic
- Cross-field validation
- Error message generation

## API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/forms` | List all available forms |
| GET | `/api/forms/:formId` | Get form configuration |
| POST | `/api/forms/:formId/process` | Process form with values |
| POST | `/api/forms/:formId/validate` | Validate form data |

### Navigation Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/forms/:formId/navigation/next` | Get next step |
| POST | `/api/forms/:formId/navigation/previous` | Get previous step |
| POST | `/api/forms/:formId/progress` | Get completion progress |

### Advanced Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/forms/:formId/dependencies` | Field dependency graph |
| POST | `/api/forms/:formId/affected-fields` | Fields affected by change |
| POST | `/api/forms/:formId/transform/outbound` | Transform to DB format |
| POST | `/api/forms/:formId/transform/inbound` | Transform to form format |

### Wizard-Specific Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/forms/:formId/wizard/phases` | Get phase status |
| GET | `/api/forms/:formId/multi-flow/info` | Multi-flow information |
| POST | `/api/forms/:formId/multi-flow/process` | Process specific flow |

## Configuration Examples

### 1. Simple Application Form

```json
{
  "metadata": {
    "id": "simple-app",
    "formType": "APPLICATION_FORM"
  },
  "steps": [
    {
      "id": "personal-info",
      "name": "Personal Information",
      "order": 1,
      "fields": [
        {
          "id": "firstName",
          "type": "text",
          "name": "firstName",
          "label": "First Name",
          "required": true,
          "validation": ["required", "minLength:2"]
        }
      ]
    }
  ]
}
```

### 2. Conditional Fields

```json
{
  "id": "applicationType",
  "type": "radio",
  "options": [
    {"value": "individual", "label": "Individual"},
    {"value": "joint", "label": "Joint"}
  ]
},
{
  "id": "jointInfo",
  "type": "text",
  "label": "Co-borrower Info",
  "conditions": [
    {"===": [{"var": "applicationType"}, "joint"]}
  ]
}
```

### 3. Wizard Form with Phases

```json
{
  "metadata": {
    "formType": "WIZARD_FLOW_FORM"
  },
  "flowPhases": {
    "phase1": {
      "id": "selection",
      "type": "selection"
    },
    "phase2": {
      "id": "wizard",
      "type": "wizard"
    },
    "phase3": {
      "id": "traditional",
      "type": "traditional"
    }
  },
  "steps": [
    {
      "phase": "phase1",
      "stepType": "selection",
      "hideContinueButton": true
    }
  ]
}
```

## Development Guidelines

### Adding New Form Configurations

1. Create JSON file in `configs/forms/`
2. Follow schema structure
3. Test with API endpoints
4. Validate conditional logic

### Extending Field Types

1. Add type handling in `formEngine.js`
2. Update validation rules if needed
3. Document new type behavior

### Adding Validation Rules

1. Extend `validationEngine.js`
2. Add rule to validation array
3. Test with various inputs

### Custom Conditional Logic

1. Use JSON Logic operators
2. Reference fields with `{"var": "fieldName"}`
3. Test complex conditions thoroughly

## Testing and Debugging

### API Testing

Use the included testing files:
- `API_TESTING.md`: Basic API examples
- `WIZARD_API_TESTING.md`: Wizard-specific tests

### Debugging Tips

1. **Check Form Loading**: Verify configurations load without errors
2. **Test Conditions**: Use `/process` endpoint to test conditional logic
3. **Validate Data**: Use `/validate` endpoint for field validation
4. **Check Dependencies**: Use `/dependencies` for field relationships

### Common Issues

1. **Circular Dependencies**: Check field conditions for loops
2. **Invalid JSON Logic**: Validate conditional expressions
3. **Missing Fields**: Ensure referenced fields exist
4. **Order Issues**: Check step ordering for wizard forms

## Performance Considerations

### Configuration Loading

- Configurations loaded once at startup
- Stored in memory for fast access
- Hot-reload not implemented (restart required)

### Processing Optimization

- Conditional evaluation cached where possible
- Minimal field re-processing on changes
- Lazy step generation for large forms

### API Response Size

- Only return visible steps/fields
- Exclude internal metadata
- Compress large option arrays

## Future Extensibility

### Planned Features

1. **Dynamic Validation**: Runtime validation rule creation
2. **Form Versioning**: Support multiple form versions
3. **A/B Testing**: Form variant testing
4. **Analytics**: Form interaction tracking
5. **Hot Reload**: Configuration updates without restart

### Extension Points

1. **Custom Field Types**: Plugin architecture for new field types
2. **Validation Plugins**: Custom validation rule engines
3. **Transform Plugins**: Custom data transformation logic
4. **Rendering Hooks**: Frontend component customization

## Troubleshooting

### Configuration Errors

- Check JSON syntax
- Validate required fields
- Verify field ID uniqueness
- Test conditional expressions

### Runtime Issues

- Monitor server logs
- Test API endpoints individually
- Validate form data structure
- Check field dependencies

### Performance Issues

- Profile conditional evaluation
- Monitor memory usage
- Optimize large option arrays
- Cache expensive operations

This architecture provides a flexible, maintainable foundation for complex form management while keeping configurations declarative and engine-agnostic.