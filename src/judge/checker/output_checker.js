class OutputChecker {
  normalize(output) {
    return String(output ?? "")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n")
      .trim();
  }

  check(actualOutput, expectedOutput) {
    const actual = this.normalize(actualOutput);
    const expected = this.normalize(expectedOutput);

    if (actual === expected) {
      return {
        verdict: "ACCEPTED",
      };
    }

    return {
      verdict: "WRONG_ANSWER",
    };
  }
}


module.exports = new OutputChecker();
