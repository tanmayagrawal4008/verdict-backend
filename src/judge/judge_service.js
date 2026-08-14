const cppCompiler = require("./compiler/cpp_compiler");
const cppExecutor = require("./executor/cpp_executor");
const outputChecker = require("./checker/output_checker");

class JudgeService {

    async judgeSubmission({
        submissionId,
        sourceCode,
        language,
        testCases,
        timeLimit,
        memoryLimit
    }) {


        // 1. COMPILE


        let compileResult;

        if (language === "CPP") {

            compileResult =
                await cppCompiler.compile(sourceCode);

        } else {

            throw new Error(
                `Unsupported language: ${language}`
            );
        }



        // Compilation failed


        if (!compileResult.success) {

            return {
                submissionId,
                verdict: "COMPILATION_ERROR",
                compileError: compileResult.stderr,
                testResults: []
            };
        }



        // 2. RUN TEST CASES


        const testResults = [];

        let finalVerdict = "ACCEPTED";


        for (const testCase of testCases) {


            // Execute


            const executionResult =
                await cppExecutor.execute({
                    workDir: compileResult.workDir,
                    input: testCase.input,
                    timeLimit,
                    memoryLimit
                });



            // Runtime error / TLE


            if (
                executionResult.verdict !==
                "EXECUTION_SUCCESS"
            ) {

                const testResult = {

                    submissionId,

                    testCaseId:
                        testCase.testCaseId,

                    verdict:
                        executionResult.verdict,

                    actualOutput:
                        executionResult.stdout || "",

                    expectedOutput:
                        testCase.expectedOutput
                };

                testResults.push(testResult);

                finalVerdict =
                    executionResult.verdict;

                break;
            }



            // Check output


            const checkResult =
                outputChecker.check(
                    executionResult.stdout,
                    testCase.expectedOutput
                );


            const testResult = {

                submissionId,

                testCaseId:
                    testCase.testCaseId,

                verdict:
                    checkResult.verdict,

                actualOutput:
                    executionResult.stdout,

                expectedOutput:
                    testCase.expectedOutput
            };


            testResults.push(testResult);



            // Wrong Answer


            if (
                checkResult.verdict !==
                "ACCEPTED"
            ) {

                finalVerdict =
                    checkResult.verdict;

                break;
            }
        }



        // 3. RETURN FINAL RESULT


        return {

            submissionId,

            verdict: finalVerdict,

            testResults

        };
    }
}

module.exports = new JudgeService();