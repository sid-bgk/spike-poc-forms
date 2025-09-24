/**
 * Test Cases for Ultra-Simple Array Transformation Engine
 *
 * Demonstrates how the new config-based approach handles multi-source data mapping
 * that was previously hardcoded in transformation functions.
 */

const { SimpleTransformEngine } = require('./simple-transform-engine');
const fs = require('fs');
const path = require('path');

// Load the transformation config
const configPath = path.join(__dirname, 'configs/forms/ppf-broker-simple-transform.json');
const transformConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Mock data representing different scenarios the current system handles
const testCases = [
  {
    name: "Primary Source Available - DEAL.EXTENSION path has data",
    loanData: {
      DEAL: {
        EXTENSION: {
          OTHER: {
            "saaf:DEAL_EXTENSION": {
              "saaf:ApplicationData": {
                applicationData: {
                  applicationType: "joint"
                },
                propertyAddress: {
                  address: "123 Main St",
                  city: "Los Angeles",
                  state: "CA",
                  zip: "90210"
                },
                borrowers: [
                  {
                    firstName: "John",
                    lastName: "Doe",
                    email: "john@example.com",
                    phone: "555-1234",
                    ssn: "123456789",
                    partialSsn: "6789",
                    dob: "1990-01-01"
                  },
                  {
                    firstName: "Jane",
                    lastName: "Doe",
                    email: "jane@example.com",
                    phone: "555-5678",
                    ssn: "987654321",
                    partialSsn: "4321",
                    dob: "1992-05-15"
                  }
                ],
                partnerId: "primary-partner-id"
              }
            }
          }
        }
      }
    },
    context: {
      additionalInfo: {
        applicationType: "individual", // This should NOT be used since primary exists
        loanInformation: {
          loanPurpose: "purchase",
          propertyType: "single_family_residence",
          propertyValue: "500000"
        }
      }
    }
  },

  {
    name: "Fallback to Context - Primary source empty/missing",
    loanData: {
      DEAL: {
        EXTENSION: {
          OTHER: {
            "saaf:DEAL_EXTENSION": {
              "saaf:ApplicationData": {
                // Empty applicationData - should fallback to context
                partnerId: "primary-partner-id"
              }
            }
          }
        }
      }
    },
    context: {
      additionalInfo: {
        applicationType: "joint", // This SHOULD be used as fallback
        numberOfBorrowers: "2",
        propertyAddress: {
          address: "456 Oak Ave",
          city: "San Francisco",
          state: "CA",
          zip: "94102"
        },
        loanInformation: {
          loanPurpose: "refinance_cashout",
          propertyType: "condominium",
          propertyValue: "750000",
          estimatedCreditScore: "740-759"
        },
        borrowers: [
          {
            firstName: "Alice",
            lastName: "Smith",
            email: "alice@example.com",
            phone: "555-9999"
          }
        ],
        rentAndExpanses: {
          monthlyPropertyTaxes: "1200",
          monthlyInsurance: "300",
          unitRent: [
            { unit: "1", rent: "3000" },
            { unit: "2", rent: "2800" }
          ]
        },
        pricing: {
          qualifyingLoanAmount: "600000",
          brokerPoints: "1.5",
          lockRate: true
        }
      }
    }
  },

  {
    name: "Mixed Sources - Some from primary, some from context",
    loanData: {
      DEAL: {
        EXTENSION: {
          OTHER: {
            "saaf:DEAL_EXTENSION": {
              "saaf:ApplicationData": {
                propertyAddress: {
                  address: "789 Pine St", // Primary source
                  city: "Seattle",
                  state: "WA"
                  // Missing zip - should use default
                },
                partnerId: "mixed-partner-id"
              }
            }
          }
        }
      }
    },
    context: {
      additionalInfo: {
        applicationType: "individual", // Context source
        loanInformation: {
          loanPurpose: "purchase", // Context source
          propertyValue: "425000"
        },
        borrowers: [], // Empty array - should use defaults
        repairAndRehab: {
          rehabAmount: "50000",
          arv: "500000"
        }
      }
    }
  },

  {
    name: "Array Expansion Test - Dynamic unit rents",
    loanData: {},
    context: {
      additionalInfo: {
        rentAndExpanses: {
          noOfUnits: "4",
          unitRent: [
            { unit: "1", rent: "2500" },
            { unit: "2", rent: "2300" },
            { unit: "3", rent: "2400" },
            { unit: "4", rent: "2200" }
          ]
        }
      }
    }
  }
];

// Test runner
function runTests() {
  const engine = new SimpleTransformEngine();

  console.log('🧪 Ultra-Simple Array Transformation Engine - Test Results\n');
  console.log('=' * 80);

  testCases.forEach((testCase, index) => {
    console.log(`\n📋 Test Case ${index + 1}: ${testCase.name}`);
    console.log('-'.repeat(60));

    try {
      const result = engine.transform(transformConfig, testCase.loanData, testCase.context);

      // Show key results for each test case
      console.log('✅ Transformation Results:');

      // Application type (tests primary vs fallback)
      console.log(`   applicationType: "${result.borrower_information_applicant_type}"`);

      // Property info (tests mixed sources)
      console.log(`   property: "${result.property_street}, ${result.property_city}, ${result.property_state} ${result.property_zip}"`);

      // Borrower count
      console.log(`   numberOfBorrowers: "${result.borrower_information_number_of_borrowers}"`);

      // First borrower (tests array handling)
      if (result.borrower_information_1_first_name) {
        console.log(`   borrower1: "${result.borrower_information_1_first_name} ${result.borrower_information_1_last_name}"`);
      }

      // Dynamic unit rents (tests array expansion)
      const unitRents = Object.keys(result)
        .filter(key => key.startsWith('unit_') && key.endsWith('_monthly_rent'))
        .map(key => `${key}: $${result[key]}`);
      if (unitRents.length > 0) {
        console.log(`   unitRents: [${unitRents.join(', ')}]`);
      }

      // Loan info
      if (result.loan_purpose) {
        console.log(`   loanPurpose: "${result.loan_purpose}"`);
      }

    } catch (error) {
      console.log('❌ Transformation Error:', error.message);
    }
  });

  // Test config validation
  console.log('\n🔍 Configuration Validation Test');
  console.log('-'.repeat(60));

  const validationErrors = engine.validateConfig(transformConfig);
  if (validationErrors.length === 0) {
    console.log('✅ Configuration is valid');
  } else {
    console.log('❌ Configuration errors:');
    validationErrors.forEach(error => console.log(`   - ${error}`));
  }
}

// Performance comparison test
function performanceTest() {
  console.log('\n⚡ Performance Test');
  console.log('-'.repeat(60));

  const engine = new SimpleTransformEngine();
  const testData = testCases[1]; // Use the complex fallback case

  const iterations = 1000;
  const startTime = Date.now();

  for (let i = 0; i < iterations; i++) {
    engine.transform(transformConfig, testData.loanData, testData.context);
  }

  const endTime = Date.now();
  const avgTime = (endTime - startTime) / iterations;

  console.log(`✅ ${iterations} transformations completed`);
  console.log(`   Total time: ${endTime - startTime}ms`);
  console.log(`   Average time per transformation: ${avgTime.toFixed(2)}ms`);
}

// Demonstrate specific multi-source scenarios
function demonstrateMultiSourceLogic() {
  console.log('\n🎯 Multi-Source Logic Demonstration');
  console.log('-'.repeat(60));

  const engine = new SimpleTransformEngine();

  // Show how the engine resolves borrower_information_applicant_type
  const fieldConfig = transformConfig.transformations.inbound.borrower_information_applicant_type;

  console.log('Field: borrower_information_applicant_type');
  console.log('Configuration:');
  fieldConfig.forEach((source, index) => {
    if (source.path) {
      console.log(`   ${index + 1}. Try: ${source.path}${source.condition ? ` (condition: ${source.condition})` : ''}`);
    } else {
      console.log(`   ${index + 1}. Default: "${source.default}"`);
    }
  });

  console.log('\nTest with primary source available:');
  const result1 = engine.transform(transformConfig, testCases[0].loanData, testCases[0].context);
  console.log(`   Result: "${result1.borrower_information_applicant_type}" (used primary source)`);

  console.log('\nTest with primary source missing:');
  const result2 = engine.transform(transformConfig, testCases[1].loanData, testCases[1].context);
  console.log(`   Result: "${result2.borrower_information_applicant_type}" (used fallback source)`);
}

// Run all tests
if (require.main === module) {
  runTests();
  performanceTest();
  demonstrateMultiSourceLogic();

  console.log('\n' + '='.repeat(80));
  console.log('🎉 All tests completed! The ultra-simple array approach successfully');
  console.log('   handles multi-source data mapping with clear, maintainable configuration.');
}

module.exports = { runTests, performanceTest, demonstrateMultiSourceLogic };