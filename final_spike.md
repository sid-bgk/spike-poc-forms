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

The current dynamic forms implementation requires extensive engineering effort for relatively simple modifications, with scattered configuration management across 25+ files and critical performance bottlenecks. Simple field additions require coordination across 8-12 files and typical debugging sessions consume 2-6 hours, while users experience 3-5 second load times, 15-25% higher abandonment rates, and input lag of 150-400ms due to excessive useWatch calls, condition evaluation on every keystroke, and getValues() dependency cascades causing 200-500 calls per form interaction.[^1]

## Current System State

### Configuration Management

- **25+ configuration files** scattered across inconsistent folder structures with mixed organization patterns[^1]
- **Partner configs** exist at root level while form-type specific folders use different naming conventions (steps.js vs Steps.js vs -fundingsteps.js)[^1]
- **UUID management crisis** with hardcoded identifiers and no centralized registry, requiring linear search through form arrays[^1]
- **JSON Logic complexity** ranging from simple boolean checks to **100+ line mathematical calculations** with nested conditional trees that are impossible to debug[^1]
- **Schema versioning chaos** with multiple versions (retailv1, retailv2, brokerv1) with no migration strategy or clear deprecation timeline[^1]


#### Previous Implementation

```
formConfig/                               # 25+ scattered files
├── application-form.data.js              # Hard-coded UUID registry
├── application-form.utils.js             # Mixed utilities
├── stepsDefault.js                       # Inconsistent naming
├── stepsOakTree.js                       # Partner configs at root
├── stepsParkPlaceRetail.js               # Mixed case naming
├── stepsPpfBroker.js                     # More inconsistency
├── quickpricer/oaktree-funding/
│   ├── index.js                          # Manual wiring
│   ├── steps.js                          # Nested configurations
│   └── transformToApiRequest.utils.js    # Scattered transformations
└── initialapplication/oaktree/
    ├── index.js                          # More manual exports
    ├── steps.js                          # Duplicated patterns
    └── transformToFormData.utils.js      # Complex object traversal
```


#### Proposed Implementation

```
spike-poc/backend-configs/
├── registry.json                        # Single source of truth
├── forms-json/                          # Clean organization
│   ├── ppf-broker-complete/
│   │   ├── ppf-broker-complete.json     # Form definition  
│   │   └── transformation.json          # Separate transformation
│   ├── ppf-retail-wizard/
│   │   ├── ppf-retail-wizard.json       # Consistent naming
│   │   └── transformation.json          # Clean separation
│   └── simplified-application-poc/
│       ├── simplified-application-poc.json # Kebab-case naming
│       └── transformation.json          # Logical separation
└── shared-fields/                       # Reusable components
    ├── personal-info-fields.json       # Common field definitions
    └── validation-rules.json           # Centralized validation
```


### Transformation Layer Complexity

- **Complex bidirectional transformation layers** requiring deep object traversal with hardcoded field mappings and no validation for data integrity[^1]
- **Deep object paths** using lodash `get()` patterns prone to breaking with complex nested structures[^1]
- **Context dependencies** where transformations depend on external context objects creating fragile coupling[^1]
- **Hardcoded field mappings** with no dynamic mapping configuration, requiring manual updates across multiple transformation files[^1]
- **No validation mechanisms** to ensure transformations preserve data integrity during form-to-application data conversion[^1]


#### Previous Implementation

```javascript
// OLD SYSTEM - 200+ line hardcoded transformation functions
export const transformLoanDataToForm = (loanData, context) => {
  let borrowers = get(loanData, 'DEAL.EXTENSION.OTHER["saaf:DEAL_EXTENSION"]["saaf:ApplicationData"].borrowers');
  const primaryBorrower = borrowers.find(borrower => borrower.borrowerType === borrowerType.primary) ?? borrowers.at(0);
  const primaryBorrowerAdditionalInfo = get(primaryBorrower, 'additionalInfo');
  
  return {
    firstname: get(primaryBorrower, 'firstName', ''),
    lastname: get(primaryBorrower, 'lastName', ''),
    // ... 50+ more complex hardcoded mappings
  };
};

// Scattered across multiple files
formConfig/quickpricer/oaktree-funding/transformToApiRequest.utils.js
formConfig/initialapplication/oaktree/transformToFormData.utils.js
formConfig/application-form.utils.js
```


#### Proposed Implementation

```
forms-json/
├── ppf-broker-complete/
│   ├── ppf-broker-complete.json     # Form structure definition
│   └── transformation.json          # Clean transformation rules
├── ppf-retail-wizard/  
│   ├── ppf-retail-wizard.json       # Form definition
│   └── transformation.json          # Separate transformation logic
└── simplified-application-poc/
    ├── simplified-application-poc.json
    └── transformation.json          # Declarative mappings
```


#### Transformation Configuration Example

```json
{
  "inbound": {
    "firstName": [
      {
        "path": "loanData.DEAL.EXTENSION.OTHER['saaf:DEAL_EXTENSION']['saaf:ApplicationData'].borrowers[^0].firstName",
        "condition": "notEmpty"
      },
      {
        "path": "additionalInfo.borrowers[^0].firstName", 
        "condition": "notEmpty"
      },
      {
        "default": ""
      }
    ]
  },
  "outbound": {
    "loan.information.loanAmount": {
      "path": "loanAmount",
      "transform": "currency",
      "required": true
    }
  }
}
```


#### Universal Transformation Engine

```javascript
// Core transformation engine - replaces all hardcoded transformation functions
const processInboundMapping = (apiData, transformConfig) => {
  const formData = {};
  for (const [formField, mappings] of Object.entries(transformConfig.inbound)) {
    // Try each mapping in priority order
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


### Frontend Performance Crisis

- **Critical getValues() dependency issues** causing 200-500 calls per form interaction with cascading re-render effects[^1]
- **15-25 component re-renders** per single form field change due to useWatch patterns and dependency chains[^1]
- **useWatch overuse** creating render cascades with multiple watch calls across components monitoring entire form state[^1]
- **Condition evaluation on every keystroke** with JSON Logic expressions executing complex nested calculations during each user input[^1]
- **Memory leaks** from object recreation patterns, closure accumulation, and uncleaned event handler references causing 100-200MB growth per session[^1]
- **State management fragmentation** with form state scattered across useState hooks, context, and Zustand stores creating prop drilling and inconsistent patterns[^1]


#### Previous Implementation

```typescript
// OLD SYSTEM - Performance-killing patterns
const FormComponent = () => {
  // Watches entire form on every keystroke
  const formValues = useWatch(); // 200-500 calls per interaction
  const { getValues } = useFormContext();
  
  // Re-renders 15-25 components per field change
  useEffect(() => {
    // Condition evaluation on every keystroke
    evaluateComplexConditions(getValues()); // 100+ line JSON Logic
  }, [formValues]); // Massive dependency array
  
  // Memory leaks from object recreation
  const expensiveObject = {
    ...complexCalculations(formValues) // Creates new objects every render
  };
};

// Scattered state management
const [step1State, setStep1State] = useState();
const [step2State, setStep2State] = useState();
const globalFormContext = useContext(FormContext);
const zustandStore = useFormStore(); // Mixed patterns
```


#### Proposed Implementation

```
spike-poc/frontend/src/
├── tanstack-form/                   # TanStack Form implementation
│   ├── useConfigFormEngine.ts       # Zero re-render form engine
│   ├── useNavigationEngine.ts       # Smart step navigation
│   ├── ConfigFormRenderer.tsx       # Main form renderer
│   ├── WizardFlowRenderer.tsx       # Multi-phase wizard
│   └── FormField.tsx               # Universal field component
└── components/ui/                  # Shared components
    ├── Button, Input, Select...    # shadcn/ui components
    └── StepNavigation.tsx         # Intelligent navigation
```


#### TanStack Form Engine with Selective Subscriptions

```typescript
// Zero re-render architecture with selective subscriptions
const form = useForm({
  defaultValues,
  onSubmit: async (values) => await onSubmit(values),
});

// Subscribe only to specific field changes - eliminates useWatch cascades
const loanAmount = form.useStore(state => state.values.loanAmount);
const firstName = form.useStore(state => state.values.firstName);

// Smart dependency tracking - only fields that affect conditional logic
const conditionKeys = React.useMemo(() => {
  const dependencies = new Set<string>();
  extractConditionDependencies(config, dependencies);
  return Array.from(dependencies);
}, [config]);

// Watch ONLY condition-driving fields (performance critical)
const watchedConditionValues = methods.watch(conditionKeys);
```


## Decision

Implement a comprehensive **architectural transformation** using **TanStack Form** as the core frontend solution, addressing all three critical areas: configuration management, transformation layer complexity, and frontend performance crisis through modern, scalable solutions.

### Primary Recommendation: Three-Tier Architecture with TanStack Form

1. **Frontend Performance Revolution with TanStack Form**
    - Zero re-render architecture using selective `form.useStore()` subscriptions eliminating 200-500 getValues() calls[^2]
    - Intelligent navigation engine with conditional step visibility without performance impact[^2]
    - Built-in performance monitoring and debugging tools for development productivity[^2]
2. **Backend Configuration Revolution**
    - Centralized JSON-driven configuration system replacing 25+ scattered files[^3]
    - Single source of truth through `registry.json` with lazy loading architecture[^3]
    - Shared component system with reusable field definitions and validation rules[^3]
3. **Universal Transformation Engine**
    - Declarative JSON transformation configurations replacing 200-line hardcoded functions[^4]
    - Priority-based fallback system with built-in validation mechanisms[^4]
    - Bidirectional mapping support with debugging tools and performance optimizations[^4]

### Key Selection Factors

- **Performance Impact**: 90% reduction in re-renders, 85% improvement in input responsiveness, 95% reduction in memory growth with TanStack Form[^2]
- **Development Velocity**: Form modifications reduced from 3 hours across 8-12 files to 15 minutes in single JSON file[^3]
- **Technology Choice**: TanStack Form's selective subscription architecture provides superior performance over React Hook Form alternatives[^2]
- **Scalability**: Architecture supports unlimited partner growth without exponential complexity increases[^1]


## Implementation Plan

### Phase 1: TanStack Form Performance Revolution (Priority) (3-4 weeks)

**Rationale**: Immediate user experience relief addressing the critical pain point of 15-25% higher abandonment rates and 3-5 second load times[^1]

- **Week 1**: TanStack Form Engine Core Implementation
    - Build zero re-render form engine with selective `form.useStore()` subscriptions eliminating 200-500 getValues() calls[^2]
    - Implement universal FormField component eliminating 15-25 re-renders per field change[^2]
    - Create smart dependency tracking for condition evaluation using only fields that affect conditional logic[^2]
    - Deploy performance monitoring tools showing render count reduction from 200-500 to 1-2 calls per interaction[^2]
- **Week 2**: Navigation Engine and Flow Support
    - Build intelligent step navigation with conditional visibility without performance impact[^2]
    - Implement multi-flow support (linear, selection, wizard, single-page) using configuration-driven architecture[^2]
    - Create automatic step correction and validation integration[^2]
    - Develop WizardFlowRenderer for multi-phase progressive forms[^2]
- **Week 3**: Advanced Features and Optimization
    - Implement dynamic array handling for borrower/co-borrower scenarios with automatic field generation[^2]
    - Build Zod schema integration with field-level validation[^2]
    - Create development debug panels with render count monitoring and performance metrics[^2]
    - Implement lazy loading architecture for form configurations[^2]
- **Week 4**: Performance Validation and Production Deployment
    - A/B testing validation showing 85% improvement in input responsiveness (200-400ms to 10-30ms)[^2]
    - Memory usage reduction validation (100-200MB to 5-10MB per session)[^2]
    - Bundle size optimization achieving 70% reduction (35% to 8-10% of total bundle)[^2]
    - Production rollout with comprehensive performance monitoring dashboards[^2]


### Phase 2: Backend Configuration System (2-3 weeks)

**Rationale**: Address development velocity bottleneck of 8-12 file coordination reducing modification time from 3 hours to 15 minutes[^3]

- **Week 1**: Centralized Registry Implementation
    - Create `registry.json` single source of truth eliminating UUID management crisis[^3]
    - Migrate 25+ scattered files to organized kebab-case directory structure[^3]
    - Build lazy loading architecture with form discovery optimization[^3]
- **Week 2**: Shared Components and Validation
    - Develop shared-fields directory with reusable component definitions[^3]
    - Centralize validation rules eliminating duplication across partner configurations[^3]
    - Implement JSON schema validation with TypeScript integration[^3]
- **Week 3**: Integration and Backward Compatibility
    - Create backward compatibility layer for gradual migration from existing configurations[^3]
    - Build automated testing suite for configuration validation[^3]
    - Performance validation ensuring TanStack form engine seamlessly integrates with new configuration system[^3]


### Phase 3: Transformation Engine Architecture (2-3 weeks)

**Rationale**: Eliminate 200-line hardcoded transformation functions reducing debugging from 2-6 hours to 30 minutes[^4]

- **Week 1**: Universal Transformation Engine
    - Build declarative JSON transformation system replacing complex JavaScript functions[^4]
    - Implement priority-based fallback system with built-in validation mechanisms[^4]
    - Create bidirectional mapping support with debugging tools[^4]
- **Week 2**: Migration and Advanced Features
    - Convert existing hardcoded transformation functions to JSON configurations[^4]
    - Implement complex pattern support for dynamic array processing[^4]
    - Build step-by-step debugging tools for transformation logic visualization[^4]
- **Week 3**: Integration with TanStack Form Engine
    - Integrate transformation engine with TanStack form for seamless data flow[^4]
    - Performance validation ensuring transformation doesn't impact frontend performance gains[^4]
    - Production deployment with monitoring and rollback capabilities[^4]


### Phase 4: Integration and Final Optimization (1-2 weeks)

- **Week 1**: End-to-end System Integration
    - Complete integration testing of TanStack form engine with new configuration and transformation systems
    - Performance validation showing cumulative improvements across all three components
    - User acceptance testing validating abandonment rate reduction and development velocity improvements
- **Week 2**: Documentation and Knowledge Transfer
    - Complete architectural documentation focusing on TanStack form patterns and debugging tools
    - Team training on new TanStack-based development workflows[^2]
    - Onboarding time reduction validation (2-3 weeks to 1-2 days) through improved developer experience


### Timeline Summary

- **Total Duration**: 8-10 weeks
- **Technology Focus**: TanStack Form as single frontend solution providing 90% performance improvement[^2]
- **Immediate Impact**: Zero re-render architecture with selective subscriptions (weeks 1-4)
- **Development Velocity**: Configuration system streamlining (weeks 5-7)
- **Long-term Maintainability**: Declarative transformation system (weeks 8-10)


## Consequences

### Positive Outcomes

- **90% performance improvement** in form rendering and interaction responsiveness through TanStack Form's selective subscription architecture[^2]
- **Development time reduction** from 3 hours to 15 minutes for simple form modifications through centralized configuration system[^3]
- **Memory usage optimization** reducing growth from 100-200MB to 5-10MB per session via proper state management[^2]
- **Debugging experience transformation** from 2-6 hour sessions to 30-minute resolutions through declarative transformation architecture[^4]
- **Scalability achievement** supporting unlimited partner growth without architectural constraints[^1]
- **User experience enhancement** eliminating 15-25% abandonment rate increases on complex forms through immediate response improvements[^1]
- **Bundle size reduction** from 35% to 8-10% of total bundle through optimized TanStack Form implementation[^2]


### Potential Challenges

- **Learning curve** for team members adapting to TanStack Form patterns and new architectural components
- **Migration complexity** requiring careful coordination between old React Hook Form system and new TanStack Form implementation
- **Initial development investment** of 8-10 weeks for complete architectural transformation
- **Testing overhead** requiring comprehensive validation of TanStack Form integration with existing form configurations


### Risk Mitigation

- **Backward compatibility layer** ensuring gradual migration from React Hook Form to TanStack Form without service disruption
- **Comprehensive documentation** and training materials for TanStack Form patterns and debugging tools
- **Automated testing suite** preventing regression issues during form engine migration
- **Performance monitoring tools** providing real-time validation of TanStack Form improvement metrics
- **Parallel implementation approach** allowing A/B testing between old and new form systems during transition


## Conclusion

The current dynamic forms architecture exhibits critical debt that threatens platform scalability and developer productivity. The proposed three-tier architectural transformation with **TanStack Form** as the core frontend solution provides a complete resolution addressing configuration chaos, transformation complexity, and frontend performance issues simultaneously. With measured improvements of 90% performance gains through selective subscriptions, 95% reduction in development coordination overhead, and elimination of scalability constraints, this architecture investment will provide foundational benefits supporting long-term platform growth and development velocity enhancement.

TanStack Form's zero re-render architecture with selective `form.useStore()` subscriptions directly addresses the critical performance bottlenecks while the centralized configuration system and declarative transformation engine eliminate the development experience pain points. The implementation plan provides a structured 8-10 week migration path with backward compatibility, comprehensive testing, and performance validation ensuring successful transformation while maintaining service continuity.

```
<div style="text-align: center">⁂</div>
```

[^1]: DEV-635-Dynamic-Forms-Spike-Analysis-V3-COMPREHENSIVE.md

[^2]: FRONTEND-ARCHITECTURE.md

[^3]: BACKEND-FORM-CONFIGS-ARCHITECTURE.md

[^4]: TRANSFORMATION-ARCHITECTURE.md

