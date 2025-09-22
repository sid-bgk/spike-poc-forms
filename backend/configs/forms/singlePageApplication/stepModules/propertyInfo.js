import { FIELD_TYPES, GRID_LAYOUTS, US_STATES, YES_NO_OPTIONS } from '../../../shared/constants.js';
import { VALIDATION_PATTERNS } from '../../../shared/validations.js';
import { STEP_IDS, FIELD_IDS } from '../constants.js';

// Property address fields
export const propertyCity = {
  id: FIELD_IDS.PROPERTY_CITY,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.PROPERTY_CITY,
  label: 'City',
  required: true,
  validation: VALIDATION_PATTERNS.CITY_VALIDATION('property city'),
  grid: GRID_LAYOUTS.THIRD,
  placeholder: 'Enter city'
};

export const propertyState = {
  id: FIELD_IDS.PROPERTY_STATE,
  type: FIELD_TYPES.DROPDOWN,
  name: FIELD_IDS.PROPERTY_STATE,
  label: 'State',
  required: true,
  validation: VALIDATION_PATTERNS.STATE_VALIDATION,
  grid: GRID_LAYOUTS.THIRD,
  options: US_STATES
};

export const propertyZip = {
  id: FIELD_IDS.PROPERTY_ZIP,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.PROPERTY_ZIP,
  label: 'ZIP Code',
  required: true,
  validation: VALIDATION_PATTERNS.ZIP_CODE_VALIDATION,
  grid: GRID_LAYOUTS.THIRD,
  placeholder: '12345'
};

// Residency question
export const livedMoreThan2Years = {
  id: FIELD_IDS.LIVED_MORE_THAN_2_YEARS,
  type: FIELD_TYPES.RADIO,
  name: FIELD_IDS.LIVED_MORE_THAN_2_YEARS,
  label: 'Have you lived here for more than 2 years?',
  required: true,
  validation: [
    {
      rule: 'required',
      message: 'Please select whether you have lived here for more than 2 years'
    }
  ],
  grid: GRID_LAYOUTS.FULL,
  options: YES_NO_OPTIONS
};

// Previous address fields
export const previousAddressLabel = {
  id: FIELD_IDS.PREVIOUS_ADDRESS_LABEL,
  type: FIELD_TYPES.LABEL,
  name: FIELD_IDS.PREVIOUS_ADDRESS_LABEL,
  text: 'Previous Address',
  grid: GRID_LAYOUTS.FULL,
  style: { fontWeight: 'bold', marginTop: '16px', marginBottom: '8px' },
  conditions: [{ '===': [{ var: FIELD_IDS.LIVED_MORE_THAN_2_YEARS }, 'no'] }]
};

export const previousCity = {
  id: FIELD_IDS.PREVIOUS_CITY,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.PREVIOUS_CITY,
  label: 'Previous City',
  required: true,
  validation: [
    {
      rule: 'required',
      message: 'This field is required'
    }
  ],
  grid: GRID_LAYOUTS.THIRD,
  placeholder: 'Enter previous city'
};

export const previousState = {
  id: FIELD_IDS.PREVIOUS_STATE,
  type: FIELD_TYPES.DROPDOWN,
  name: FIELD_IDS.PREVIOUS_STATE,
  label: 'Previous State',
  required: true,
  validation: [
    {
      rule: 'required',
      message: 'This field is required'
    }
  ],
  grid: GRID_LAYOUTS.THIRD,
  options: US_STATES
};

export const previousZip = {
  id: FIELD_IDS.PREVIOUS_ZIP,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.PREVIOUS_ZIP,
  label: 'Previous ZIP Code',
  required: true,
  validation: VALIDATION_PATTERNS.ZIP_CODE_VALIDATION,
  grid: GRID_LAYOUTS.THIRD,
  placeholder: '12345'
};

// Property information step
export const propertyInfoStep = {
  id: STEP_IDS.PROPERTY_INFO,
  name: 'Property Information',
  description: 'Current property details',
  order: 2,
  required: true,
  fields: [
    propertyCity,
    propertyState,
    propertyZip,
    livedMoreThan2Years,
    previousAddressLabel,
    {
      ...previousCity,
      conditions: [{ '===': [{ var: FIELD_IDS.LIVED_MORE_THAN_2_YEARS }, 'no'] }]
    },
    {
      ...previousState,
      conditions: [{ '===': [{ var: FIELD_IDS.LIVED_MORE_THAN_2_YEARS }, 'no'] }]
    },
    {
      ...previousZip,
      conditions: [{ '===': [{ var: FIELD_IDS.LIVED_MORE_THAN_2_YEARS }, 'no'] }]
    }
  ]
};

