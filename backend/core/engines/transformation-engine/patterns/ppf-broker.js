// Simple get function to avoid lodash dependency
function get(obj, path, defaultValue = undefined) {
  if (!obj || !path) return defaultValue;

  // Handle quoted keys like ["saaf:DEAL_EXTENSION"] and array indices
  const keys = path
    .replace(/\[\"([^"]+)\"\]/g, ".$1") // Convert ["quoted"] to .quoted
    .replace(/\[\'([^']+)\'\]/g, ".$1") // Convert ['quoted'] to .quoted
    .replace(/\[(\d+)\]/g, ".$1") // Convert [0] to .0
    .split(".")
    .filter((key) => key !== ""); // Remove empty strings

  let result = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = result[key];
  }

  return result === undefined ? defaultValue : result;
}

/**
 * PPF Broker Pattern: Complex multi-source with pricing data
 * Enhanced data structure for PPF broker forms
 */
const ppfBrokerPattern = (loanData, context) => {
  const apiData = get(
    loanData,
    `DEAL.EXTENSION.OTHER["saaf:DEAL_EXTENSION"]["saaf:ApplicationData"]`,
    {}
  );
  const applicationData = get(apiData, "applicationData", {});

  let additionalInfo = get(applicationData, "additionalInfo", {});
  if (Object.keys(additionalInfo).length === 0) {
    additionalInfo = get(context, "additionalInfo", {});
  }

  return {
    loanData,
    context,
    apiData,
    applicationData,
    additionalInfo,
    borrowers: get(
      apiData,
      "borrowers",
      get(additionalInfo, "borrowers", [])
    ),
    propertyAddress: get(
      apiData,
      "propertyAddress",
      get(additionalInfo, "propertyAddress", {})
    ),
    loanInformation: get(additionalInfo, "loanInformation", {}),
    rentAndExpanses: get(additionalInfo, "rentAndExpanses", {}),
    repairAndRehab: get(additionalInfo, "repairAndRehab", {}),
    pricing: get(additionalInfo, "pricing", {}),
    primaryBorrower: context.primaryBorrower || {},
  };
};

module.exports = {
  name: 'ppfBroker',
  description: 'PPF Broker pattern: complex multi-source with pricing data',
  process: ppfBrokerPattern
};