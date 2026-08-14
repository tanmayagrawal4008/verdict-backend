class OutputChecker {

    check(actualOutput, expectedOutput) {

        const actual = actualOutput.trim();
        const expected = expectedOutput.trim();

        if (actual === expected) {

            return {
                verdict: "ACCEPTED"
            };
        }

        return {
            verdict: "WRONG_ANSWER"
        };
    }
}

module.exports = new OutputChecker();