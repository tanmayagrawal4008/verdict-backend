const judgeService = require("./src/judge/judge_service");

async function main() {

    const result = await judgeService.judgeSubmission({

        submissionId: 1,

        language: "CPP",

        sourceCode: `
#include <iostream>

int main() {

    int a, b;
    int c[10];
    std::cin >> a >> b;
    c[11] = 2;
    std::cout << a + b;
    return 0;
}
`,

        testCases: [
            {
                testCaseId: 1,
                input: "2 3",
                expectedOutput: "5"
            },
            {
                testCaseId: 2,
                input: "10 20",
                expectedOutput: "30"
            },
            {
                testCaseId: 3,
                input: "100 200",
                expectedOutput: "300"
            }
        ],

        timeLimit: 2000,

        memoryLimit: "256m"
    });

    console.dir(result, {
        depth: null
    });
}

main();