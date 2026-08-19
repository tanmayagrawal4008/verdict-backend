class OutputChecker {

    check(actualOutput, expectedOutput) {

        const actual = String(actualOutput ?? "").trim();
        const expected = String(expectedOutput ?? "").trim();

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
