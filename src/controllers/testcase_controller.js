const TestcaseService = require("../services/testcase_service");
const ProblemService = require("../services/problem_service");
const { HttpError } = require("../middlewares/http_error");
const { sendSuccess } = require("./response");

const testcaseService = new TestcaseService();
const problemService = new ProblemService();

function getProblemId(value) {
  if (!/^[1-9]\d*$/.test(String(value ?? ""))) {
    throw new HttpError(400, "problemId must be a positive integer");
  }
  return String(value);
}

async function assertProblemOwner(problemId, userId) {
  const problem = await problemService.get_problem_owner_by_id(problemId);
  if (!problem) throw new HttpError(404, "Problem not found");
  if (String(problem.created_by) !== String(userId)) {
    throw new HttpError(403, "You can only manage test cases for your own problem");
  }
}

function assertTestcasePayload(testcase) {
  if (typeof testcase.input !== "string") {
    throw new HttpError(400, "input must be a string");
  }
  if (typeof testcase.expected_output !== "string") {
    throw new HttpError(400, "expected_output must be a string");
  }
  if (testcase.is_sample !== undefined && typeof testcase.is_sample !== "boolean") {
    throw new HttpError(400, "is_sample must be a boolean");
  }
}

class TestcaseController {
  async getSampleTestcases(req, res) {
    const problemId = getProblemId(req.params.problemId);
    const problem = await problemService.get_problem_by_id(problemId);
    if (!problem) throw new HttpError(404, "Problem not found");

    const testcases = await testcaseService.get_sample_testcases_by_problem_id(problemId);
    return sendSuccess(res, 200, "Sample test cases fetched successfully", testcases);
  }

  async getTestcases(req, res) {
    const problemId = getProblemId(req.params.problemId);
    await assertProblemOwner(problemId, req.user.user_id);
    const testcases = await testcaseService.get_all_testcases_by_problem_id(problemId);
    return sendSuccess(res, 200, "Test cases fetched successfully", testcases);
  }

  async createTestcase(req, res) {
    const problemId = getProblemId(req.params.problemId);
    await assertProblemOwner(problemId, req.user.user_id);
    const testcase = req.body || {};
    assertTestcasePayload(testcase);

    const createdTestcase = await testcaseService.create_testcase(
      problemId,
      req.user.user_id,
      testcase.input,
      testcase.expected_output,
      testcase.is_sample ?? false,
    );
    return sendSuccess(res, 201, "Test case created successfully", createdTestcase);
  }
}

module.exports = TestcaseController;
