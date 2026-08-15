const judgeQueue =
    require("./src/queue/judge_queue");


async function main() {

    const job = await judgeQueue.add(
        "judge-submission",
        {
            submissionId: 1,

            language: "CPP",

            sourceCode: `
#include <iostream>

int main() {

    int a, b;

    std::cin >> a >> b;

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
                }
            ],

            timeLimit: 2000,

            memoryLimit: "256m"
        }
    );


    console.log("Job added:", job.id);
}


main();