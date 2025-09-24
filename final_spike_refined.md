<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# SPIKE - Dynamic Forms Architecture Transformation

Created by: Development Team
Created time: September 24, 2025
Type: Decision Record
Status: Active

Date: September 24, 2025

## Status

Proposed

## Context

The current dynamic forms system exhibits critical architectural debt: **25+ scattered configuration files**, **200-500 getValues() calls per interaction**, **8-12 file coordination** for simple changes, and **2-6 hour debugging sessions**. Users experience 3-5 second load times, 15-25% higher abandonment rates, and input lag of 150-400ms.[^1]

## Current System State

### Configuration Management Crisis

- **25+ configuration files** scattered across inconsistent folder structures[^1]
- **UUID management crisis** with hardcoded identifiers requiring linear search[^1]
- **JSON Logic complexity** ranging from simple checks to **100+ line mathematical calculations**[^1]
- **Schema versioning chaos** with no migration strategy[^1]

#### Previous Implementation
```
formConfig/                               # 25+ scattered files
├── application-form.data.js              # Hard-coded UUID registry
├── stepsDefault.js                       # Inconsistent naming
├── stepsParkPlaceRetail.js               # Mixed case naming
├── quickpricer/oaktree-funding/
│   ├── steps.js                          # Nested configurations
│   └── transformToApiRequest.utils.js    # Scattered transformations
```

#### Proposed Implementation
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

### Transformation Layer Complexity

- **200+ line hardcoded transformation functions** with deep object traversal[^1]
- **Complex bidirectional mappings** requiring manual updates across multiple files[^1]
- **No validation mechanisms** for data integrity during conversion[^1]

#### Previous Implementation
```javascript
// OLD SYSTEM - Complex hardcoded functions
export const transformLoanDataToForm = (loanData, context) => {
  let borrowers = get(loanData, 'DEAL.EXTENSION.OTHER["saaf:DEAL_EXTENSION"]["saaf:ApplicationData"].borrowers');
  const primaryBorrower = borrowers.find(borrower => borrower.borrowerType === borrowerType.primary) ?? borrowers.at(0);

  return {
    firstname: get(primaryBorrower, 'firstName', ''),
    // ... 50+ more complex hardcoded mappings
  };
};
```

#### Proposed Implementation
```json
{
  "inbound": {
    "firstName": [
      {
        "path": "loanData.DEAL.EXTENSION.OTHER['saaf:DEAL_EXTENSION']['saaf:ApplicationData'].borrowers[0].firstName",
        "condition": "notEmpty"
      },
      {
        "path": "additionalInfo.borrowers[0].firstName",
        "condition": "notEmpty"
      },
      {
        "default": ""
      }
    ]
  }
}
```

### Frontend Performance Crisis

- **200-500 getValues() calls** per form interaction with cascading re-renders[^1]
- **15-25 component re-renders** per single field change[^1]
- **Memory leaks** causing 100-200MB growth per session[^1]
- **State management fragmentation** across multiple patterns[^1]

#### Previous Implementation
```typescript
// OLD SYSTEM - Performance killers
const FormComponent = () => {
  const formValues = useWatch(); // Watches entire form
  const { getValues } = useFormContext();

  useEffect(() => {
    evaluateComplexConditions(getValues()); // 100+ line JSON Logic
  }, [formValues]); // Massive dependency array

  const expensiveObject = {
    ...complexCalculations(formValues) // Creates new objects every render
  };
};
```

## Form Library Evaluation

| Feature | TanStack Form | React Hook Form | Formik | Formily | React JSONSchema Form |
|---------|---------------|-----------------|--------|---------|---------------------|
| **Performance** | Selective subscriptions, minimal memory | Minimal re-renders, optimized patterns | Higher re-renders, memory concerns | Optimized for complex forms | Performance issues with large forms |
| **Configuration** | Built-in configuration engine | Manual configuration required | Manual form construction | Enterprise configuration system | Pure JSON Schema approach |
| **Dynamic Forms** | Advanced dynamic field handling | Good dynamic field support | Standard dynamic support | Advanced dynamic capabilities | Basic array support |
| **Enterprise Scale** | Designed for large-scale applications | Medium complexity applications | Limited enterprise features | Enterprise-grade architecture | Not suitable for enterprise scale |
| **Development Speed** | Rapid field modifications | Moderate development speed | Slower development cycles | Configuration-driven development | Development limitations |
| **Bundle & TypeScript** | Compact bundle, extreme type safety | Small bundle, full TypeScript support | Medium bundle, good TypeScript | Larger bundle, full TypeScript | Heavy bundle, basic TypeScript |

**Recommendation: TanStack Form** - Directly addresses DEV-635 requirements with selective subscriptions eliminating getValues dependency cascades and built-in configuration engine aligning with centralized architecture.

## Validation Library Evaluation

| Capability | Zod | Yup |
|------------|-----|-----|
| **TypeScript Integration** | Native TypeScript-first API | Type definitions provided separately |
| **Performance** | Fast parsing and validation | Moderate performance |
| **Error Reporting** | Detailed error objects with path details | Less structured error messages |
| **Schema Composition** | Composable via `extend` and `merge` | Composable via `concat` and `.shape()` |
| **Transformations** | Built-in `transform()` support | Supported via `transform()` |
| **Bundle Size** | Smaller footprint | Larger footprint |
| **Learning Curve** | Moderate (TypeScript idiomatic) | Low (fluent API familiar) |

**Recommendation: Zod** - Native TypeScript integration, detailed error reporting, and compact bundle make it ideal for type-safe form configurations and performance-sensitive validation.

## Decision

Implement **TanStack Form** as the primary frontend solution with centralized configuration and declarative transformation architecture.

### Primary Architecture: Three-Tier Solution

1. **Frontend Performance Revolution with TanStack Form**
   - Zero re-render architecture using selective `form.useStore()` subscriptions[^2]
   - Built-in performance monitoring and debugging tools[^2]

2. **Backend Configuration Revolution**
   - Centralized JSON-driven configuration replacing 25+ scattered files[^3]
   - Single source of truth through `registry.json`[^3]

3. **Universal Transformation Engine**
   - Declarative JSON transformation replacing 200-line hardcoded functions[^4]
   - Priority-based fallback system with validation mechanisms[^4]

## Implementation Examples

### TanStack Form Engine (Recommended)
```typescript
// Zero re-render architecture with selective subscriptions
const form = useForm({
  defaultValues,
  onSubmit: async (values) => await onSubmit(values),
});

// Subscribe only to specific field changes - eliminates useWatch cascades
const loanAmount = form.useStore(state => state.values.loanAmount);
const firstName = form.useStore(state => state.values.firstName);

// Smart dependency tracking - only fields affecting conditional logic
const conditionKeys = React.useMemo(() => {
  const dependencies = new Set<string>();
  extractConditionDependencies(config, dependencies);
  return Array.from(dependencies);
}, [config]);
```

### React Hook Form Alternative (Optimized)
```typescript
// Selective watching - only condition-driving fields
const conditionKeys = React.useMemo(() => {
  const set = new Set<string>();
  extractConditionDependencies(config, set);
  return Array.from(set);
}, [config]);

// Watch ONLY fields that affect conditional logic (performance critical)
const watchedConditionValues = methods.watch(conditionKeys);

// Compute visible fields efficiently
const visibleFields = React.useMemo(() => {
  const values = methods.getValues();
  return currentStep.fields.filter(field =>
    evaluateConditions(field.conditions, values)
  );
}, [currentStep.fields, watchedConditionValues, evaluateConditions]);
```

### Frontend Architecture
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

### Universal Transformation Engine
```javascript
// Replaces all hardcoded transformation functions
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
        formData[formField] = mapping.transform ? transformers[mapping.transform](value) : value;
        break;
      }
    }
  }
  return formData;
};
```

## Implementation Plan

### Phase 1: TanStack Form Performance Revolution (3-4 weeks)
- **Week 1**: Zero re-render form engine with selective subscriptions
- **Week 2**: Navigation engine and multi-flow support
- **Week 3**: Advanced features and Zod validation integration
- **Week 4**: Performance validation and production deployment

### Phase 2: Backend Configuration System (2-3 weeks)
- **Week 1**: Centralized registry eliminating UUID crisis
- **Week 2**: Shared components and validation rules
- **Week 3**: Integration and backward compatibility

### Phase 3: Transformation Engine Architecture (2-3 weeks)
- **Week 1**: Universal transformation engine
- **Week 2**: Migration and advanced pattern support
- **Week 3**: Integration with TanStack form engine

### Phase 4: Integration and Optimization (1-2 weeks)
- **Week 1**: End-to-end system integration testing
- **Week 2**: Documentation and team training

**Total Duration**: 8-10 weeks

## Consequences

### Positive Outcomes
- **90% performance improvement** through selective subscriptions[^2]
- **Development time reduction** from 3 hours to 15 minutes[^3]
- **Memory optimization** reducing growth from 100-200MB to 5-10MB[^2]
- **Debugging transformation** from 2-6 hours to 30 minutes[^4]
- **User experience enhancement** eliminating 15-25% abandonment increases[^1]

### Risk Mitigation
- **Backward compatibility** for gradual migration
- **Comprehensive documentation** and training materials
- **Automated testing suite** preventing regressions
- **A/B testing** between old and new systems

## Conclusion

The proposed three-tier architecture with **TanStack Form** provides complete resolution of configuration chaos, transformation complexity, and frontend performance issues. With 90% performance gains, 95% reduction in development coordination, and elimination of scalability constraints, this investment provides foundational benefits for long-term platform growth.

```
<div style="text-align: center">⁂</div>
```

[^1]: DEV-635-Dynamic-Forms-Spike-Analysis-V3-COMPREHENSIVE.md
[^2]: FRONTEND-ARCHITECTURE.md
[^3]: BACKEND-FORM-CONFIGS-ARCHITECTURE.md
[^4]: TRANSFORMATION-ARCHITECTURE.md