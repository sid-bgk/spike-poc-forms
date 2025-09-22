# TanStack Form Config Renderer

A powerful, reusable form rendering system built with TanStack Form, Zod validation, and shadcn/ui components. This system allows you to define complex multi-step forms using a simple configuration object.

## Features

- **Configuration-driven forms**: Define forms using JSON/TypeScript configuration
- **Multi-step form support**: Built-in step navigation with progress tracking
- **Type-safe validation**: Zod schema validation with comprehensive error handling
- **Responsive design**: Grid-based layout with Tailwind CSS
- **Field types**: Support for text, email, phone, date, currency, radio, checkbox, dropdown, and textarea fields
- **Real-time validation**: Field-level and form-level validation with visual feedback
- **Accessibility**: ARIA attributes and proper form accessibility
- **Custom styling**: Built with shadcn/ui components for consistent design

## Quick Start

### 1. Basic Usage

```tsx
import { ConfigFormRenderer } from "./tanstackform";
import { myFormConfig } from "./config/my-form-config";

function MyForm() {
  const handleSubmit = async (data) => {
    console.log("Form data:", data);
    // Handle form submission
  };

  return (
    <ConfigFormRenderer
      config={myFormConfig}
      onSubmit={handleSubmit}
      defaultValues={{ firstName: "", email: "" }}
    />
  );
}
```

### 2. Form Configuration Structure

```typescript
export const myFormConfig = {
  metadata: {
    id: "my-form",
    name: "My Application Form",
    formType: "APPLICATION_FORM",
  },
  steps: [
    {
      id: "personal-info",
      name: "Personal Information",
      description: "Please provide your basic information",
      order: 1,
      fields: [
        {
          id: "firstName",
          name: "firstName",
          type: "text",
          label: "First Name",
          required: true,
          placeholder: "Enter your first name",
          helpText: "Your legal first name",
          validation: ["required", { minLength: 2 }],
          grid: { xs: 12, sm: 6 },
        },
        // ... more fields
      ],
    },
    // ... more steps
  ],
};
```

## Field Types

### Text Input

```typescript
{
  type: "text",
  validation: ["required", { minLength: 2 }, { maxLength: 50 }]
}
```

### Email Input

```typescript
{
  type: "email",
  validation: ["required", "email"]
}
```

### Phone Input (US Format)

```typescript
{
  type: "phone",
  validation: ["required", "phoneUS"]
}
```

### Date Input

```typescript
{
  type: "date",
  validation: ["required", "date"]
}
```

### Currency Input

```typescript
{
  type: "currency",
  validation: ["required", "currency", { min: 1000 }, { max: 500000 }]
}
```

### Radio Buttons

```typescript
{
  type: "radio",
  options: [
    { value: "option1", label: "Option 1", description: "Description" },
    { value: "option2", label: "Option 2" }
  ],
  validation: ["required", { oneOf: ["option1", "option2"] }]
}
```

### Checkbox

```typescript
{
  type: "checkbox",
  validation: ["required"] // For required checkboxes
}
```

### Dropdown/Select

```typescript
{
  type: "dropdown",
  placeholder: "Select an option...",
  options: [
    { value: "value1", label: "Label 1" },
    { value: "value2", label: "Label 2" }
  ],
  validation: [{ oneOf: ["value1", "value2"] }]
}
```

### Textarea

```typescript
{
  type: "textarea",
  validation: [{ maxLength: 500 }]
}
```

## Validation Rules

The system supports comprehensive validation using Zod schemas:

### Basic Validation

- `"required"` - Field is required
- `"email"` - Valid email format
- `"phoneUS"` - US phone format (555) 123-4567
- `"date"` - Valid date
- `"currency"` - Valid currency amount
- `"zipCodeUS"` - US ZIP code format

### Length Validation

- `{ minLength: 5 }` - Minimum character length
- `{ maxLength: 100 }` - Maximum character length

### Numeric Validation

- `{ min: 18 }` - Minimum value
- `{ max: 100 }` - Maximum value

### Pattern Validation

- `{ pattern: "^[A-Za-z]+$" }` - Custom regex pattern

### Enum Validation

- `{ oneOf: ["option1", "option2"] }` - Must be one of specified values

## Grid Layout

The system uses a 12-column grid system with responsive breakpoints:

```typescript
grid: {
  xs: 12,    // Full width on extra small screens
  sm: 6,     // Half width on small screens and up
  md: 4,     // One-third width on medium screens and up
  lg: 3      // One-quarter width on large screens and up
}
```

## Advanced Features

### Conditional Fields

```typescript
{
  id: "conditionalField",
  dependencies: ["otherField"], // Field depends on other fields
  // ... other config
}
```

### Step Navigation

The system automatically handles:

- Step progress indicators
- Previous/Next navigation
- Step validation before navigation
- Submit button on final step

### Form State Management

Access form state in development mode:

- Current values
- Validation errors
- Step progress
- Submission state

## API Reference

### ConfigFormRenderer Props

```typescript
interface ConfigFormRendererProps {
  config: FormConfig;
  onSubmit: (data: FormData) => void | Promise<void>;
  defaultValues?: Partial<FormData>;
  className?: string;
}
```

### FormConfig Type

```typescript
interface FormConfig {
  metadata: {
    id: string;
    name: string;
    formType: string;
  };
  steps: FormStep[];
}
```

### FormStep Type

```typescript
interface FormStep {
  id: string;
  name: string;
  description: string;
  order: number;
  fields: FormField[];
}
```

### FormField Type

```typescript
interface FormField {
  id: string;
  name: string;
  type:
    | "text"
    | "email"
    | "phone"
    | "date"
    | "currency"
    | "radio"
    | "checkbox"
    | "dropdown"
    | "textarea";
  label: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  validation?: ValidationRule[];
  options?: Array<{ value: string; label: string; description?: string }>;
  dependencies?: string[];
  grid: { xs: number; sm?: number; md?: number; lg?: number };
}
```

## Examples

See `DemoFormExample.tsx` for a complete working example using the demo configuration.

## Development

The form renderer is built with:

- **TanStack Form**: Form state management and validation
- **Zod**: Schema validation
- **shadcn/ui**: Component library
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety

To extend the system:

1. Add new field types in `FormField.tsx`
2. Add validation rules in `validation.ts`
3. Update types in `types.ts`
4. Test with demo configuration
