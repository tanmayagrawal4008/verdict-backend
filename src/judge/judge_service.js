const cppCompiler = require("./compiler/cpp_compiler");
const cppExecutor = require("./executor/cpp_executor");
const outputChecker = require("./checker/output_checker");

class JudgeService {
  validateAndNormalizeJob({
    submissionId,
    sourceCode,
    language,
    testCases,
    timeLimit,
    memoryLimit,
  }) {
    if (!submissionId) throw new Error("submissionId is required");
    if (typeof sourceCode !== "string" || sourceCode.trim() === "") {
      throw new Error("sourceCode must be a non-empty string");
    }
    const normalizedLanguage = language === "C++" ? "CPP" : language;
    if (normalizedLanguage !== "CPP") throw new Error(`Unsupported language: ${language}`);
    if (!Array.isArray(testCases) || testCases.length === 0) {
      throw new Error("At least one test case is required");
    }
    if (!Number.isFinite(timeLimit) || timeLimit <= 0) {
      throw new Error("timeLimit must be a positive number in milliseconds");
    }
    if (!Number.isFinite(memoryLimit) || memoryLimit <= 0) {
      throw new Error("memoryLimit must be a positive number in megabytes");
    }

    return {
      submissionId,
      sourceCode,
      language: normalizedLanguage,
      timeLimit,
      memoryLimit,
      testCases: testCases.map((testCase, index) => {
        const testCaseId = testCase.testCaseId ?? testCase.testcase_id;
        const expectedOutput = testCase.expectedOutput ?? testCase.expected_output;

        const invalidInput = testCase.input !== null
          && testCase.input !== undefined
          && typeof testCase.input !== "string";
        if (!testCaseId || invalidInput || typeof expectedOutput !== "string") {
          throw new Error(`Invalid test case at index ${index}`);
        }

        return { testCaseId, input: testCase.input ?? "", expectedOutput };
      }),
    };
  }

  async judgeSubmission(job) {
    const {
      submissionId,
      sourceCode,
      testCases,
      timeLimit,
      memoryLimit,
    } = this.validateAndNormalizeJob(job);

    let compileResult;

    try {
      compileResult = await cppCompiler.compile(sourceCode);
      if (!compileResult.success) {
        return {
          submissionId,
          verdict: "COMPILATION_ERROR",
          compileError: compileResult.stderr,
          testResults: [],
        };
      }

      const testResults = [];
      let finalVerdict = "ACCEPTED";

      for (const testCase of testCases) {
        const executionResult = await cppExecutor.execute({
          workDir: compileResult.workDir,
          input: testCase.input,
          timeLimit,
          memoryLimit,
        });

        if (executionResult.verdict !== "EXECUTION_SUCCESS") {
          testResults.push({
            submissionId,
            testCaseId: testCase.testCaseId,
            verdict: executionResult.verdict,
            actualOutput: executionResult.stdout || "",
            expectedOutput: testCase.expectedOutput,
          });
          finalVerdict = executionResult.verdict;
          break;
        }

        const checkResult = outputChecker.check(
          executionResult.stdout,
          testCase.expectedOutput,
        );
        testResults.push({
          submissionId,
          testCaseId: testCase.testCaseId,
          verdict: checkResult.verdict,
          actualOutput: executionResult.stdout,
          expectedOutput: testCase.expectedOutput,
        });

        if (checkResult.verdict !== "ACCEPTED") {
          finalVerdict = checkResult.verdict;
          break;
        }
      }

      return { submissionId, verdict: finalVerdict, testResults };
    } finally {
      if (compileResult?.workDir) {
        await cppCompiler.cleanup(compileResult.workDir);
      }
    }
  }
}

module.exports = new JudgeService();
