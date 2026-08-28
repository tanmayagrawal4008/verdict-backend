const testcaseModel = require("../models/testcase_model");

class TestcaseService {
  async create_testcase(...args) {
    return testcaseModel.create_testcase(...args);
  }

  async get_all_testcases_by_problem_id(problemId) {
    return testcaseModel.get_all_testcases_by_problem_id(problemId);
  }

  async get_sample_testcases_by_problem_id(problemId) {
    return testcaseModel.get_sample_testcases_by_problem_id(problemId);
  }
}

module.exports = TestcaseService;
