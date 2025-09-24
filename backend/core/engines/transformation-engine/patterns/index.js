/**
 * Pattern Registry for Transformation Engine
 * Central registry for all available data preparation patterns
 */

const ppfBroker = require('./ppf-broker');
const retail = require('./retail');
const oaktree = require('./oaktree');

// Pattern registry - maps pattern names to their processing functions
const patterns = {
  [ppfBroker.name]: ppfBroker.process,
  [retail.name]: retail.process,
  [oaktree.name]: oaktree.process
};

/**
 * Register a new pattern dynamically
 * @param {Object} pattern - Pattern object with name, description, and process function
 * @param {string} pattern.name - Pattern name
 * @param {string} pattern.description - Pattern description
 * @param {Function} pattern.process - Pattern processing function
 */
const registerPattern = (pattern) => {
  if (!pattern.name || !pattern.process) {
    throw new Error('Pattern must have name and process function');
  }
  patterns[pattern.name] = pattern.process;
};

/**
 * Get a pattern by name
 * @param {string} name - Pattern name
 * @returns {Function|null} Pattern processing function or null if not found
 */
const getPattern = (name) => patterns[name] || null;

/**
 * Get all available pattern names
 * @returns {string[]} Array of pattern names
 */
const getAllPatterns = () => Object.keys(patterns);

/**
 * Check if a pattern exists
 * @param {string} name - Pattern name
 * @returns {boolean} True if pattern exists
 */
const hasPattern = (name) => patterns.hasOwnProperty(name);

/**
 * Get pattern metadata
 * @returns {Object[]} Array of pattern metadata objects
 */
const getPatternInfo = () => [
  { name: ppfBroker.name, description: ppfBroker.description },
  { name: retail.name, description: retail.description },
  { name: oaktree.name, description: oaktree.description }
];

module.exports = {
  patterns,
  registerPattern,
  getPattern,
  getAllPatterns,
  hasPattern,
  getPatternInfo
};