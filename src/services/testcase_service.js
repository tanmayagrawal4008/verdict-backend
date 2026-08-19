const testcaseModel = require("../models/testcase_model");

class TestcaseService {
  async get_all_testcases_by_problem_id(problemId) {
    return testcaseModel.get_all_testcases_by_problem_id(problemId);
  }
}

module.exports = TestcaseService;
