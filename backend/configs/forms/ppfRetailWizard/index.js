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
      formType: "WIZARD_FLOW_FORM"
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
    navigation: {
      type: "wizard",
      allowBackward: true,
      allowSkipping: false,
      showProgress: true,
      completionRequired: true,
      phaseNavigation: {
        allowPhaseSkipping: false,
        showPhaseProgress: true
      }
    },
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
    wizardFlow: {
      enablePrefillPropagation: true,
      questionStepType: "question",
      traditionalStepType: "traditional",
      selectionStepType: "selection",
      phases: ["phase1", "phase2", "phase3"],
      pricingIntegration: {
        showPricingOnQuestions: true,
        pricingSteps: ["phase2", "phase3"]
      }
    }
  };

  return mergeConfigs(baseConfig, overrides);
}

// Default export for backward compatibility
export default createPpfRetailWizardConfig();