import * as React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import type { RegisterOptions } from 'react-hook-form'
import { createZodFieldValidator } from '../tanstackform/zodValidation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { FormField as FormFieldType } from '../tanstackform/types'

interface Props {
  field: FormFieldType
}

export function RHFFormField({ field }: Props) {
  const { register, control, formState: { errors } } = useFormContext()

  const error = (errors as any)?.[field.name]?.message as string | undefined
  const fieldId = `field-${field.id}`

  const rules = React.useMemo(() => buildRules(field), [field])

  const showLabel = field.type !== 'checkbox'

  return (
    <div className={cn('space-y-2', getGridClasses(field.grid))}>
      {showLabel && (
        <Label htmlFor={fieldId}>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      {renderInput()}

      {field.helpText && (
        <p className="text-xs text-muted-foreground">{field.helpText}</p>
      )}

      {error && (
        <p id={`${fieldId}-error`} className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )

  function renderInput() {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <Input
            id={fieldId}
            type={field.type}
            placeholder={field.placeholder}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            variant={error ? 'error' : 'default'}
            {...register(field.name, rules)}
          />
        )

      case 'date':
        return (
          <Input
            id={fieldId}
            type="date"
            aria-describedby={error ? `${fieldId}-error` : undefined}
            variant={error ? 'error' : 'default'}
            {...register(field.name, rules)}
          />
        )

      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            placeholder={field.placeholder}
            rows={4}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            variant={error ? 'error' : 'default'}
            {...register(field.name, rules)}
          />
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Controller
              name={field.name}
              control={control}
              rules={rules}
              render={({ field: ctl }) => (
                <Checkbox
                  id={fieldId}
                  checked={!!ctl.value}
                  onChange={(e: any) => ctl.onChange(e.target?.checked ?? e)}
                  onBlur={ctl.onBlur}
                  variant={error ? 'error' : 'default'}
                  aria-describedby={error ? `${fieldId}-error` : undefined}
                />
              )}
            />
            <Label htmlFor={fieldId} className="text-sm font-normal">
              {field.label}
            </Label>
          </div>
        )

      case 'radio':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={rules}
            render={({ field: ctl }) => (
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`${fieldId}-${option.value}`}
                      name={ctl.name}
                      value={option.value}
                      checked={ctl.value === option.value}
                      onChange={() => ctl.onChange(option.value)}
                      onBlur={ctl.onBlur}
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
            )}
          />
        )

      case 'dropdown':
        return (
          <Select
            id={fieldId}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            variant={error ? 'error' : 'default'}
            {...register(field.name, rules)}
          >
            <option value="">{field.placeholder || 'Select an option...'}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )

      case 'phone':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={rules}
            render={({ field: ctl }) => (
              <Input
                id={fieldId}
                type="tel"
                placeholder={field.placeholder}
                value={formatPhone(ctl.value || '')}
                onChange={(e) => ctl.onChange(e.target.value.replace(/\D/g, ''))}
                onBlur={ctl.onBlur}
                aria-describedby={error ? `${fieldId}-error` : undefined}
                variant={error ? 'error' : 'default'}
              />
            )}
          />
        )

      case 'currency':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={rules}
            render={({ field: ctl }) => (
              <Input
                id={fieldId}
                type="text"
                placeholder={field.placeholder}
                value={formatCurrency(ctl.value)}
                onChange={(e) => ctl.onChange(parseCurrency(e.target.value))}
                onBlur={ctl.onBlur}
                aria-describedby={error ? `${fieldId}-error` : undefined}
                variant={error ? 'error' : 'default'}
              />
            )}
          />
        )

      default:
        return null
    }
  }
}

function buildRules(field: FormFieldType): RegisterOptions {
  const validator = createZodFieldValidator(field.validation || [], field.type)
  return {
    validate: (v: any) => {
      const msg = validator({ value: v })
      return msg == null ? true : msg
    },
  }
}

// mergeValidate removed; zod-based single validate function used instead

function formatPhone(v: string): string {
  const digits = (v || '').replace(/\D/g, '')
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

function parseCurrency(input: string): number | '' {
  const cleaned = (input || '').toString().replace(/[^\d.]/g, '')
  if (!cleaned) return ''
  const num = Number(cleaned)
  return isNaN(num) ? '' : num
}

function formatCurrency(v: any): string {
  if (v === '' || v == null || isNaN(Number(v))) return ''
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(v))
  } catch {
    return String(v)
  }
}

function getGridClasses(grid: FormFieldType['grid']): string {
  const classes = [] as string[]
  if (!grid) return ''
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
