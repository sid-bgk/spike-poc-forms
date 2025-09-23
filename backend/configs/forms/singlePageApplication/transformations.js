import { FIELD_IDS } from './constants.js';

// Transformation mappings for single page application
export const TRANSFORMATIONS = {
  inbound: {
    'borrower.personal.firstName': FIELD_IDS.FIRST_NAME,
    'borrower.personal.lastName': FIELD_IDS.LAST_NAME,
    'borrower.personal.email': FIELD_IDS.EMAIL,
    'borrower.personal.mobile': FIELD_IDS.MOBILE,
    'property.current.city': FIELD_IDS.PROPERTY_CITY,
    'property.current.state': FIELD_IDS.PROPERTY_STATE,
    'property.current.zip': FIELD_IDS.PROPERTY_ZIP,
    'property.residencyInfo.livedMoreThan2Years': FIELD_IDS.LIVED_MORE_THAN_2_YEARS,
    'property.previous.city': FIELD_IDS.PREVIOUS_CITY,
    'property.previous.state': FIELD_IDS.PREVIOUS_STATE,
    'property.previous.zip': FIELD_IDS.PREVIOUS_ZIP,
    'application.type': FIELD_IDS.APPLICATION_TYPE,
    'jointBorrower.property.current.city': FIELD_IDS.JOINT_PROPERTY_CITY,
    'jointBorrower.property.current.state': FIELD_IDS.JOINT_PROPERTY_STATE,
    'jointBorrower.property.current.zip': FIELD_IDS.JOINT_PROPERTY_ZIP,
    'jointBorrower.property.residencyInfo.livedMoreThan2Years': FIELD_IDS.JOINT_LIVED_MORE_THAN_2_YEARS,
    'jointBorrower.property.previous.city': FIELD_IDS.JOINT_PREVIOUS_CITY,
    'jointBorrower.property.previous.state': FIELD_IDS.JOINT_PREVIOUS_STATE,
    'jointBorrower.property.previous.zip': FIELD_IDS.JOINT_PREVIOUS_ZIP
  },

  outbound: {
    [FIELD_IDS.FIRST_NAME]: 'borrower.personal.firstName',
    [FIELD_IDS.LAST_NAME]: 'borrower.personal.lastName',
    [FIELD_IDS.EMAIL]: 'borrower.personal.email',
    [FIELD_IDS.MOBILE]: 'borrower.personal.mobile',
    [FIELD_IDS.PROPERTY_CITY]: 'property.current.city',
    [FIELD_IDS.PROPERTY_STATE]: 'property.current.state',
    [FIELD_IDS.PROPERTY_ZIP]: 'property.current.zip',
    [FIELD_IDS.LIVED_MORE_THAN_2_YEARS]: 'property.residencyInfo.livedMoreThan2Years',
    [FIELD_IDS.PREVIOUS_CITY]: 'property.previous.city',
    [FIELD_IDS.PREVIOUS_STATE]: 'property.previous.state',
    [FIELD_IDS.PREVIOUS_ZIP]: 'property.previous.zip',
    [FIELD_IDS.APPLICATION_TYPE]: 'application.type',
    [FIELD_IDS.JOINT_PROPERTY_CITY]: 'jointBorrower.property.current.city',
    [FIELD_IDS.JOINT_PROPERTY_STATE]: 'jointBorrower.property.current.state',
    [FIELD_IDS.JOINT_PROPERTY_ZIP]: 'jointBorrower.property.current.zip',
    [FIELD_IDS.JOINT_LIVED_MORE_THAN_2_YEARS]: 'jointBorrower.property.residencyInfo.livedMoreThan2Years',
    [FIELD_IDS.JOINT_PREVIOUS_CITY]: 'jointBorrower.property.previous.city',
    [FIELD_IDS.JOINT_PREVIOUS_STATE]: 'jointBorrower.property.previous.state',
    [FIELD_IDS.JOINT_PREVIOUS_ZIP]: 'jointBorrower.property.previous.zip'
  }
};

