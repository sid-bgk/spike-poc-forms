import { SHARED_FIELD_IDS } from '../../shared/constants.js';

// Form-specific field IDs - extends shared constants
export const FIELD_IDS = {
  // Use shared field IDs for common fields
  FIRST_NAME: SHARED_FIELD_IDS.FIRST_NAME,
  LAST_NAME: SHARED_FIELD_IDS.LAST_NAME,
  EMAIL: SHARED_FIELD_IDS.EMAIL,
  MOBILE: SHARED_FIELD_IDS.MOBILE,
  PROPERTY_CITY: SHARED_FIELD_IDS.PROPERTY_CITY,
  PROPERTY_STATE: SHARED_FIELD_IDS.PROPERTY_STATE,
  PROPERTY_ZIP: SHARED_FIELD_IDS.PROPERTY_ZIP,
  APPLICATION_TYPE: SHARED_FIELD_IDS.APPLICATION_TYPE,

  // Form-specific unique fields
  LIVED_MORE_THAN_2_YEARS: 'lived_more_than_2_years',
  PREVIOUS_CITY: 'previous_city',
  PREVIOUS_STATE: 'previous_state',
  PREVIOUS_ZIP: 'previous_zip',
  PREVIOUS_ADDRESS_LABEL: 'previous_address_label',

  // Joint borrower specific fields
  JOINT_PROPERTY_CITY: 'joint_property_city',
  JOINT_PROPERTY_STATE: 'joint_property_state',
  JOINT_PROPERTY_ZIP: 'joint_property_zip',
  JOINT_LIVED_MORE_THAN_2_YEARS: 'joint_lived_more_than_2_years',
  JOINT_PREVIOUS_CITY: 'joint_previous_city',
  JOINT_PREVIOUS_STATE: 'joint_previous_state',
  JOINT_PREVIOUS_ZIP: 'joint_previous_zip',
  JOINT_PREVIOUS_ADDRESS_LABEL: 'joint_previous_address_label'
};

// Step IDs specific to this form
export const STEP_IDS = {
  PERSONAL_INFO: 'personal-info',
  PROPERTY_INFO: 'property-info',
  ACCOUNT_TYPE: 'account-type',
  JOINT_PROPERTY_INFO: 'joint-property-info'
};

