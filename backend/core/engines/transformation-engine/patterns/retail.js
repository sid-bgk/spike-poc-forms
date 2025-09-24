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
 * Retail Pattern: Simpler structure with primary borrower focus
 */
const retailPattern = (loanData, context) => {
  const borrowers = get(
    loanData,
    `DEAL.EXTENSION.OTHER["saaf:DEAL_EXTENSION"]["saaf:ApplicationData"].borrowers`,
    []
  );
  const primaryBorrower =
    borrowers.find((b) => b.borrowerType === "primary") ||
    borrowers[0] ||
    context.primaryBorrower;

  return {
    loanData,
    context,
    borrowers,
    primaryBorrower,
    propertyAddress: get(
      loanData,
      `DEAL.EXTENSION.OTHER["saaf:DEAL_EXTENSION"]["saaf:ApplicationData"].propertyAddress`,
      {}
    ),
    applicationData: get(
      loanData,
      `DEAL.EXTENSION.OTHER["saaf:DEAL_EXTENSION"]["saaf:ApplicationData"].applicationData`,
      {}
    ),
  };
};

module.exports = {
  name: 'retail',
  description: 'Retail pattern: simpler structure with primary borrower focus',
  process: retailPattern
};