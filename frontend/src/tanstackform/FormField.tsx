import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { FormField as FormFieldType, FormFieldProps } from "./types"

export function FormField({ field, value, onChange, onBlur, error, isValidating }: FormFieldProps) {
  // Ensure error is a string, not an object
  const errorMessage = typeof error === 'string' ? error : undefined
  const fieldId = `field-${field.id}`

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <Input
            id={fieldId}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            variant={errorMessage ? 'error' : 'default'}
            aria-describedby={errorMessage ? `${fieldId}-error` : undefined}
          />
        )

      case 'phone':
        return (
          <Input
            id={fieldId}
            name={field.name}
            type="tel"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => {
              // Format phone number as user types
              let val = e.target.value.replace(/\D/g, '')
              if (val.length >= 6) {
                val = `(${val.slice(0, 3)}) ${val.slice(3, 6)}-${val.slice(6, 10)}`
              } else if (val.length >= 3) {
                val = `(${val.slice(0, 3)}) ${val.slice(3)}`
              }
              onChange(val)
            }}
            onBlur={onBlur}
            variant={errorMessage ? 'error' : 'default'}
            aria-describedby={errorMessage ? `${fieldId}-error` : undefined}
          />
        )

      case 'date':
        return (
          <Input
            id={fieldId}
            name={field.name}
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            variant={errorMessage ? 'error' : 'default'}
            aria-describedby={errorMessage ? `${fieldId}-error` : undefined}
          />
        )

      case 'currency':
        return (
          <Input
            id={fieldId}
            name={field.name}
            type="text"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => {
              // Format currency as user types
              let val = e.target.value.replace(/[^\d.]/g, '')
              if (val) {
                const num = parseFloat(val)
                if (!isNaN(num)) {
                  val = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(num)
                }
              }
              onChange(val)
            }}
            onBlur={onBlur}
            variant={errorMessage ? 'error' : 'default'}
            aria-describedby={errorMessage ? `${fieldId}-error` : undefined}
          />
        )

      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            name={field.name}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            variant={errorMessage ? 'error' : 'default'}
            aria-describedby={errorMessage ? `${fieldId}-error` : undefined}
            rows={4}
          />
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={fieldId}
              name={field.name}
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              onBlur={onBlur}
              variant={error ? 'error' : 'default'}
              aria-describedby={error ? `${fieldId}-error` : undefined}
            />
            <Label htmlFor={fieldId} className="text-sm font-normal">
              {field.label}
            </Label>
          </div>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${fieldId}-${option.value}`}
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={onBlur}
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                />
                <div>
                  <Label htmlFor={`${fieldId}-${option.value}`} className="text-sm font-normal">
                    {option.label}
                  </Label>
                  {option.description && (
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )

      case 'dropdown':
        return (
          <Select
            id={fieldId}
            name={field.name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            variant={errorMessage ? 'error' : 'default'}
            aria-describedby={errorMessage ? `${fieldId}-error` : undefined}
          >
            <option value="">{field.placeholder || 'Select an option...'}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )

      default:
        return null
    }
  }

  // For checkbox fields, we don't show a separate label since it's built into the field
  const showLabel = field.type !== 'checkbox'

  return (
    <div className={cn("space-y-2", getGridClasses(field.grid))}>
      {showLabel && (
        <Label htmlFor={fieldId}>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      {renderField()}

      {field.helpText && (
        <p className="text-xs text-muted-foreground">{field.helpText}</p>
      )}

      {isValidating && (
        <p className="text-xs text-muted-foreground">Validating...</p>
      )}

      {errorMessage && (
        <p id={`${fieldId}-error`} className="text-xs text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

function getGridClasses(grid: FormFieldType['grid']): string {
  const classes = []

  if (grid.xs === 12) classes.push('col-span-12')
  else if (grid.xs === 6) classes.push('col-span-6')
  else if (grid.xs === 4) classes.push('col-span-4')
  else if (grid.xs === 3) classes.push('col-span-3')

  if (grid.sm === 12) classes.push('sm:col-span-12')
  else if (grid.sm === 6) classes.push('sm:col-span-6')
  else if (grid.sm === 4) classes.push('sm:col-span-4')
  else if (grid.sm === 3) classes.push('sm:col-span-3')

  if (grid.md === 12) classes.push('md:col-span-12')
  else if (grid.md === 6) classes.push('md:col-span-6')
  else if (grid.md === 4) classes.push('md:col-span-4')
  else if (grid.md === 3) classes.push('md:col-span-3')

  if (grid.lg === 12) classes.push('lg:col-span-12')
  else if (grid.lg === 6) classes.push('lg:col-span-6')
  else if (grid.lg === 4) classes.push('lg:col-span-4')
  else if (grid.lg === 3) classes.push('lg:col-span-3')

  return classes.join(' ')
}