/**
 * Oaktree Pattern: Common application form structure
 * Simple pattern that primarily passes through context data
 */
const oaktreePattern = (loanData, context) => {
  return {
    loanData,
    context,
    // Oaktree-specific data structure
    ...context,
  };
};

module.exports = {
  name: 'oaktree',
  description: 'Oaktree pattern: common application form structure',
  process: oaktreePattern
};