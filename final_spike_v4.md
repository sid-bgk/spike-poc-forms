<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# SPIKE - Dynamic Forms Architecture Transformation

Created by: Development Team
Date: September 24, 2025
Type: Decision Record
Status: Proposed

## Context

The current dynamic forms system exhibits critical architectural debt: **25+ scattered configuration files**, **200-500 getValues() calls per interaction**, **8-12 file coordination** for simple changes, and **2-6 hour debugging sessions**. Users experience 3-5 second load times, 15-25% higher abandonment rates, and input lag of 150-400ms.[^1]

### Current System Issues

**Backend Configuration**:
- **25+ configuration files** scattered across inconsistent folder structures with mixed organization patterns
- **Partner configs** exist at root level while form-type specific folders use different naming conventions (steps.js vs Steps.js vs -fundingsteps.js)
- **Complex bidirectional transformation layers** requiring deep object traversal with hardcoded field mappings and no validation for data integrity

**Frontend Performance**:
- **Critical getValues() dependency issues** causing 200-500 calls per form interaction with cascading re-render effects
- **15-25 component re-renders** per single form field change due to useWatch patterns and dependency chains
- **useWatch overuse** creating render cascades with multiple watch calls across components monitoring entire form state
- **Condition evaluation on every keystroke** with JSON Logic expressions executing complex nested calculations during each user input
- **Memory leaks** from object recreation patterns, closure accumulation, and uncleaned event handler references

## 1. Configuration Architecture

### Core Form Structure
```json
{
  "metadata": {                                    // ✅ Form identification
    "id": "form-identifier",                       //    Unique form ID
    "name": "Human Readable Form Name",            //    Display name
    "version": "1.0.0",                           //    Semantic version
    "description": "Form description text"         //    Purpose description
  },

  "flowConfig": {                                  // ✅ Flow behavior
    "type": "linear|selection|wizard|hybrid|single", //  Flow type
    "navigation": "stepped|wizard|free-form",      //    Navigation style
    "phases": [...],                               //    Multi-phase config
    "selectionStep": { ... }                       //    Selection step config
  },

  "saveConfig": {                                  // ✅ Auto-save behavior
    "enabled": true,                               //    Enable auto-save
    "saveOnStepComplete": true,                    //    Save after each step
    "showSaveStatus": true                         //    Show save indicators
  },

  "steps": [...],                                  // ✅ Form step definitions

  "arrayTemplates": {                              // ✅ Dynamic field arrays
    "borrowers": { ... }                           //    E.g., borrower/coborrower
  }
}
```

### Registry System
```json
{
  "forms": [
    {
      "id": "simplified-application-poc",           // ✅ Unique identifier
      "name": "Simplified Loan Application POC",     // ✅ Human-readable name
      "version": "1.0.0",                           // ✅ Semantic versioning
      "file": "simplified-application-poc/simplified-application-poc.json", // ✅ Form definition path
      "transformation": "simplified-application-poc/transformation.json"     // ✅ Transform logic path
    }
  ]
}
```

### Implementation
```
spike-poc/backend-configs/
├── registry.json                         # Single source of truth
├── forms-json/                          # Clean organization
│   ├── ppf-broker-complete/
│   │   ├── ppf-broker-complete.json     # Form definition
│   │   └── transformation.json          # Separate transformation
│   └── shared-fields/                   # Reusable components
│       ├── personal-info-fields.json   # Common fields
│       └── validation-rules.json       # Centralized validation
```

## 2. Transformation Architecture

### Core Transformation Structure
```json
{
  "inbound": {                                    // ✅ API → Form mappings
    "firstName": [
      {
        "path": "loanData.borrower.firstName",    //    Primary data source
        "condition": "notEmpty"                   //    Only if not empty
      },
      {
        "path": "additionalInfo.firstName",       //    Fallback source
        "condition": "notEmpty"
      },
      {
        "default": ""                             //    Default value
      }
    ]
  },

  "outbound": {                                   // ✅ Form → API mappings
    "firstName": {
      "target": "loanData.borrower.firstName",    //    Target API path
      "transform": "trim",                        //    Value transformation
      "required": true                            //    Submission requirement
    }
  },

  "computed": {                                   // ✅ Calculated fields
    "monthlyPayment": {
      "formula": "loanAmount * interestRate / 12", //   Calculation formula
      "dependencies": ["loanAmount", "interestRate"] // Dependent fields
    }
  }
}
```

### Implementation
```javascript
// Universal transformation engine - replaces 200+ line hardcoded functions
const processInboundMapping = (apiData, transformConfig) => {
  const formData = {};
  for (const [formField, mappings] of Object.entries(transformConfig.inbound)) {
    for (const mapping of mappings) {
      if (mapping.default !== undefined) {
        formData[formField] = mapping.default;
        break;
      }
      const value = resolvePath(apiData, mapping.path);
      const conditionMet = conditionCheckers[mapping.condition]?.(value) ?? true;
      if (conditionMet) {
        formData[formField] = mapping.transform ?
          transformers[mapping.transform](value) : value;
        break;
      }
    }
  }
  return formData;
};
```

## 3. Frontend Architecture

### Form Library Evaluation

| Feature | TanStack Form | React Hook Form | Formik | Formily | React JSONSchema Form |
|---------|---------------|-----------------|--------|---------|---------------------|
| **Performance** | Selective subscriptions, minimal memory | Minimal re-renders, optimized patterns | Higher re-renders, memory concerns | Optimized for complex forms | Performance issues with large forms |
| **Configuration** | Built-in configuration engine | Manual configuration required | Manual form construction | Enterprise configuration system | Pure JSON Schema approach |
| **Dynamic Forms** | Advanced dynamic field handling | Good dynamic field support | Standard dynamic support | Advanced dynamic capabilities | Basic array support |
| **Enterprise Scale** | Designed for large-scale applications | Medium complexity applications | Limited enterprise features | Enterprise-grade architecture | Not suitable for enterprise scale |
| **Bundle & TypeScript** | Compact bundle, extreme type safety | Small bundle, full TypeScript support | Medium bundle, good TypeScript | Larger bundle, full TypeScript | Heavy bundle, basic TypeScript |

### Validation Library Evaluation

| Capability | Zod | Yup |
|------------|-----|-----|
| **TypeScript Integration** | Native TypeScript-first API | Type definitions provided separately |
| **Performance** | Fast parsing and validation | Moderate performance |
| **Error Reporting** | Detailed error objects with path details | Less structured error messages |
| **Bundle Size** | Smaller footprint | Larger footprint |

**Recommendations**: TanStack Form + Zod for optimal performance and type safety.

### TanStack Form Implementation (Primary)
```typescript
// Extract condition dependencies from form config
const conditionKeys = React.useMemo(() => {
  const set = new Set<string>();
  for (const step of augmentedSteps) {
    step.conditions?.forEach((r) => extractVarsFromLogic(r, set));
    for (const field of step.fields) {
      field.conditions?.forEach((r) => extractVarsFromLogic(r, set));
    }
  }
  set.add("applicationType");
  return set;
}, [augmentedSteps, config]);

// Subscribe only to condition-affecting fields
const conditionKeySignature = useStore(form.store, (s) => {
  const pairs = Array.from(conditionKeys).map((k) => [
    k,
    (s.values as any)[k],
  ]);
  return JSON.stringify(pairs);
});

// Compute visible fields efficiently
const visibleFields = React.useMemo(() => {
  const valuesSnapshot = form.state.values as FormData;
  return baseFields.filter((field) =>
    evaluateConditions(field.conditions, valuesSnapshot)
  );
}, [currentStep.fields, conditionKeySignature, config]);
```

### React Hook Form Alternative (Optimized)
```typescript
// Extract fields that affect conditional logic
const conditionKeys = React.useMemo(() => {
  const set = new Set<string>();
  extractConditionDependencies(config, set);
  return Array.from(set);
}, [config]);

// Watch ONLY condition-driving fields
const watchedConditionValues = methods.watch(conditionKeys);

// Compute visible fields efficiently
const visibleFields = React.useMemo(() => {
  const values = methods.getValues();
  return currentStep.fields.filter(field =>
    evaluateConditions(field.conditions, values)
  );
}, [currentStep.fields, watchedConditionValues, evaluateConditions]);
```

### Frontend Structure
```
spike-poc/frontend/src/
├── tanstackform/                    # TanStack Form (Primary)
│   ├── useConfigFormEngine.ts       # Zero re-render engine
│   ├── useNavigationEngine.ts       # Smart navigation
│   ├── ConfigFormRenderer.tsx       # Main renderer
│   ├── WizardFlowRenderer.tsx       # Multi-phase wizard
│   └── FormField.tsx               # Universal field component
├── rhfform/                        # React Hook Form (Alternative)
│   ├── useRHFConfigFormEngine.ts    # Optimized RHF engine
│   ├── RHFConfigFormRenderer.tsx    # RHF renderer
│   └── RHFFormField.tsx            # RHF components
└── components/ui/                  # Shared components
    └── Button, Input, Select...    # shadcn/ui components
```

## Decision & Consequences

**Primary Recommendation**: Three-tier architecture with TanStack Form as core frontend solution.

### Positive Outcomes
- **90% performance improvement** through selective subscriptions[^2]
- **Development time reduction** from 3 hours to 15 minutes[^3]
- **Memory optimization** reducing growth from 100-200MB to 5-10MB[^2]
- **Debugging transformation** from 2-6 hours to 30 minutes[^4]

### Risk Mitigation
- **Backward compatibility** for gradual migration
- **Comprehensive documentation** and training materials
- **Automated testing suite** preventing regressions
- **A/B testing** between old and new systems

## Conclusion

The three-tier architecture with **TanStack Form** provides complete resolution of configuration chaos, transformation complexity, and frontend performance issues. With 90% performance gains, 95% reduction in development coordination, and elimination of scalability constraints, this investment provides foundational benefits for long-term platform growth.

```
<div style="text-align: center">⁂</div>
```

[^1]: DEV-635-Dynamic-Forms-Spike-Analysis-V3-COMPREHENSIVE.md
[^2]: FRONTEND-ARCHITECTURE.md
[^3]: BACKEND-FORM-CONFIGS-ARCHITECTURE.md
[^4]: TRANSFORMATION-ARCHITECTURE.md