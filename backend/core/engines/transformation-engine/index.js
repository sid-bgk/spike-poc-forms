/**
 * Transformation Engine - Main Export
 * Provides a unified interface to the transformation engine and pattern system
 */

const engine = require('./engine');
const patterns = require('./patterns');

module.exports = {
  // Core transformation engine
  ...engine,

  // Pattern registry for direct access
  patternRegistry: patterns,

  // Convenience factory function
  createEngine: engine.createTransformationEngine,

  // Default engine instance
  engine: engine.defaultEngine
};