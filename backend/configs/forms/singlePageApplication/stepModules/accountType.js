import { FIELD_TYPES, GRID_LAYOUTS, APPLICATION_TYPE_OPTIONS } from '../../../shared/constants.js';
import { STEP_IDS, FIELD_IDS } from '../constants.js';

// Application type field
export const applicationType = {
  id: FIELD_IDS.APPLICATION_TYPE,
  type: FIELD_TYPES.RADIO,
  name: FIELD_IDS.APPLICATION_TYPE,
  label: 'Application Type',
  required: true,
  validation: [
    {
      rule: 'required',
      message: 'This field is required'
    }
  ],
  grid: GRID_LAYOUTS.FULL,
  options: APPLICATION_TYPE_OPTIONS
};

// Account type step
export const accountTypeStep = {
  id: STEP_IDS.ACCOUNT_TYPE,
  name: 'Account Type',
  description: 'Application type selection',
  order: 3,
  required: true,
  fields: [applicationType]
};

