import { FIELD_TYPES, GRID_LAYOUTS, US_STATES, YES_NO_OPTIONS } from '../../../shared/constants.js';
import { VALIDATION_PATTERNS } from '../../../shared/validations.js';
import { STEP_IDS, FIELD_IDS } from '../constants.js';

// Joint borrower property fields
export const jointPropertyCity = {
  id: FIELD_IDS.JOINT_PROPERTY_CITY,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.JOINT_PROPERTY_CITY,
  label: "Co-borrower City",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.THIRD,
  placeholder: "Enter co-borrower city"
};

export const jointPropertyState = {
  id: FIELD_IDS.JOINT_PROPERTY_STATE,
  type: FIELD_TYPES.DROPDOWN,
  name: FIELD_IDS.JOINT_PROPERTY_STATE,
  label: "Co-borrower State",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.THIRD,
  options: US_STATES
};

export const jointPropertyZip = {
  id: FIELD_IDS.JOINT_PROPERTY_ZIP,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.JOINT_PROPERTY_ZIP,
  label: "Co-borrower ZIP Code",
  required: true,
  validation: VALIDATION_PATTERNS.ZIP_CODE_VALIDATION,
  grid: GRID_LAYOUTS.THIRD,
  placeholder: "12345"
};

export const jointLivedMoreThan2Years = {
  id: FIELD_IDS.JOINT_LIVED_MORE_THAN_2_YEARS,
  type: FIELD_TYPES.RADIO,
  name: FIELD_IDS.JOINT_LIVED_MORE_THAN_2_YEARS,
  label: "Has co-borrower lived here for more than 2 years?",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.FULL,
  options: YES_NO_OPTIONS
};

export const jointPreviousAddressLabel = {
  id: FIELD_IDS.JOINT_PREVIOUS_ADDRESS_LABEL,
  type: FIELD_TYPES.LABEL,
  name: FIELD_IDS.JOINT_PREVIOUS_ADDRESS_LABEL,
  text: "Co-borrower Previous Address",
  grid: GRID_LAYOUTS.FULL,
  style: { fontWeight: "bold", marginTop: "16px", marginBottom: "8px" },
  conditions: [
    { "===": [{"var": FIELD_IDS.JOINT_LIVED_MORE_THAN_2_YEARS}, "no"] }
  ]
};

export const jointPreviousCity = {
  id: FIELD_IDS.JOINT_PREVIOUS_CITY,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.JOINT_PREVIOUS_CITY,
  label: "Co-borrower Previous City",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.THIRD,
  placeholder: "Enter co-borrower previous city"
};

export const jointPreviousState = {
  id: FIELD_IDS.JOINT_PREVIOUS_STATE,
  type: FIELD_TYPES.DROPDOWN,
  name: FIELD_IDS.JOINT_PREVIOUS_STATE,
  label: "Co-borrower Previous State",
  required: true,
  validation: [
    {
      rule: "required",
      message: "This field is required"
    }
  ],
  grid: GRID_LAYOUTS.THIRD,
  options: US_STATES
};

export const jointPreviousZip = {
  id: FIELD_IDS.JOINT_PREVIOUS_ZIP,
  type: FIELD_TYPES.TEXT,
  name: FIELD_IDS.JOINT_PREVIOUS_ZIP,
  label: "Co-borrower Previous ZIP Code",
  required: true,
  validation: VALIDATION_PATTERNS.ZIP_CODE_VALIDATION,
  grid: GRID_LAYOUTS.THIRD,
  placeholder: "12345"
};

// Joint property step
export const jointPropertyStep = {
  id: STEP_IDS.JOINT_PROPERTY_INFO,
  name: "Joint Property Information",
  description: "Co-borrower property details",
  order: 4,
  required: false,
  conditions: [
    { "===": [{"var": FIELD_IDS.APPLICATION_TYPE}, "joint"] }
  ],
  fields: [
    jointPropertyCity,
    jointPropertyState,
    jointPropertyZip,
    jointLivedMoreThan2Years,
    jointPreviousAddressLabel,
    {
      ...jointPreviousCity,
      conditions: [
        { "===": [{"var": FIELD_IDS.JOINT_LIVED_MORE_THAN_2_YEARS}, "no"] }
      ]
    },
    {
      ...jointPreviousState,
      conditions: [
        { "===": [{"var": FIELD_IDS.JOINT_LIVED_MORE_THAN_2_YEARS}, "no"] }
      ]
    },
    {
      ...jointPreviousZip,
      conditions: [
        { "===": [{"var": FIELD_IDS.JOINT_LIVED_MORE_THAN_2_YEARS}, "no"] }
      ]
    }
  ]
};