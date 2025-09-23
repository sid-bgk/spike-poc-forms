import { loanProgramSelectionStep } from './stepModules/loanProgramSelection.js';
import {
  loanPurposeQuestionStep,
  propertyTypeQuestionStep,
  propertyStateQuestionStep,
  creditScoreQuestionStep,
  propertyValueQuestionStep,
  rentalUseQuestionStep,
  rtlLoanTypeQuestionStep,
  projectsCompletedQuestionStep,
  citizenshipQuestionStep,
  purchasePriceQuestionStep,
  outstandingBalanceQuestionStep
} from './stepModules/questionSteps.js';
import {
  qualifyingInformationSummaryStep,
  propertyInformationStep,
  borrowerInformationStep
} from './stepModules/traditionalSteps.js';
import { TRANSFORMATIONS } from './transformations.js';
import { mergeConfigs } from '../../shared/utils.js';

/**
 * Creates a PPF Retail Wizard form configuration
 * @param {Object} overrides - Configuration overrides at any level
 * @returns {Object} Complete form configuration
 */
export function createPpfRetailWizardConfig(overrides = {}) {
  const baseConfig = {
    metadata: {
      id: "ppf-retail-wizard",
      name: "PPF Retail Wizard Flow",
      version: "1.0.0",
      description: "Park Place Finance retail flow with question wizard followed by traditional steps",
    },
    // New unified flow configuration (Phase 1)
    flowConfig: {
      type: "wizard",
      navigation: "wizard",
      phases: [
        { id: "phase1", name: "Loan Type Selection", type: "selection", description: "Choose loan program" },
        { id: "phase2", name: "Question Wizard", type: "wizard", description: "Quick qualifying questions" },
        { id: "phase3", name: "Traditional Form Steps", type: "traditional", description: "Complete application" },
      ],
    },
    flowPhases: {
      phase1: {
        id: "loan-type-selection",
        name: "Loan Type Selection",
        type: "selection",
        description: "Choose your loan program"
      },
      phase2: {
        id: "question-wizard",
        name: "Question Wizard",
        type: "wizard",
        description: "Quick qualifying questions - one at a time"
      },
      phase3: {
        id: "traditional-steps",
        name: "Traditional Form Steps",
        type: "traditional",
        description: "Complete application with pre-filled data"
      }
    },
    steps: [
      loanProgramSelectionStep,
      loanPurposeQuestionStep,
      propertyTypeQuestionStep,
      propertyStateQuestionStep,
      creditScoreQuestionStep,
      propertyValueQuestionStep,
      rentalUseQuestionStep,
      rtlLoanTypeQuestionStep,
      projectsCompletedQuestionStep,
      citizenshipQuestionStep,
      purchasePriceQuestionStep,
      outstandingBalanceQuestionStep,
      qualifyingInformationSummaryStep,
      propertyInformationStep,
      borrowerInformationStep
    ],
    // Navigation now implied via flowConfig; omit legacy root-level navigation
    validation: {
      globalRules: [
        {
          type: "creditScoreValidation",
          field: "estimatedCreditScore",
          rule: "minCreditScore",
          value: "660",
          message: "Unfortunately we require a 660+ credit score"
        }
      ]
    },
    transformations: TRANSFORMATIONS,
    // Retain transformations only
  };

  return mergeConfigs(baseConfig, overrides);
}

// Default export for backward compatibility
export default createPpfRetailWizardConfig();
