import { FIELD_TYPES, GRID_LAYOUTS } from '../../../shared/constants.js';
import { VALIDATION_PATTERNS } from '../../../shared/validations.js';
import { STEP_IDS, FIELD_IDS } from '../constants.js';

// Personal information fields
export const firstName = {
  id: FIELD_IDS.FIRST_NAME,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.FIRST_NAME,
  label: 'First Name',
  required: true,
  validation: VALIDATION_PATTERNS.NAME_VALIDATION('First name'),
  grid: GRID_LAYOUTS.HALF,
  placeholder: 'Enter your first name'
};

export const lastName = {
  id: FIELD_IDS.LAST_NAME,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.LAST_NAME,
  label: 'Last Name',
  required: true,
  validation: VALIDATION_PATTERNS.NAME_VALIDATION('Last name'),
  grid: GRID_LAYOUTS.HALF,
  placeholder: 'Enter your last name'
};

export const email = {
  id: FIELD_IDS.EMAIL,
  type: FIELD_TYPES.EMAIL,
  name: FIELD_IDS.EMAIL,
  label: 'Email Address',
  required: true,
  validation: VALIDATION_PATTERNS.EMAIL_VALIDATION,
  grid: GRID_LAYOUTS.FULL,
  placeholder: 'Enter your email address'
};

export const mobile = {
  id: FIELD_IDS.MOBILE,
  type: FIELD_TYPES.PHONE,
  name: FIELD_IDS.MOBILE,
  label: 'Mobile Number',
  required: true,
  validation: VALIDATION_PATTERNS.PHONE_VALIDATION,
  grid: GRID_LAYOUTS.FULL,
  placeholder: '(555) 123-4567'
};

// Personal information step
export const personalInfoStep = {
  id: STEP_IDS.PERSONAL_INFO,
  name: 'Personal Information',
  description: 'Basic borrower information',
  order: 1,
  required: true,
  fields: [firstName, lastName, email, mobile]
};

