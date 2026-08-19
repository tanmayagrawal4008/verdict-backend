const ProblemService = require("../services/problem_service");
const { HttpError } = require("../middlewares/http_error");
const { sendSuccess } = require("./response");

const problemService = new ProblemService();

function getProblemId(value) {
  if (!/^[1-9]\d*$/.test(String(value))) {
    throw new HttpError(400, "problemId must be a positive integer");
  }
  return String(value);
}

function assertProblemPayload(problem) {
  const requiredFields = ["title", "difficulty", "time_limit", "memory_limit", "statement"];
  const missingField = requiredFields.find((field) => problem[field] === undefined || problem[field] === "");
  if (missingField) throw new HttpError(400, `${missingField} is required`);
}

class ProblemController {
  async getProblems(req, res) {
    const problems = await problemService.get_problems();
    return sendSuccess(res, 200, "Problems fetched successfully", problems);
  }

  async getProblemById(req, res) {
    const problem = await problemService.get_problem_by_id(getProblemId(req.params.problemId));
    if (!problem) throw new HttpError(404, "Problem not found");
    return sendSuccess(res, 200, "Problem fetched successfully", problem);
  }

  async createProblem(req, res) {
    const problem = req.body || {};
    assertProblemPayload(problem);

    const result = await problemService.create_problem(
      problem.title, problem.difficulty, problem.time_limit, problem.memory_limit,
      req.user.user_id, problem.statement, problem.input_formate,
      problem.output_formate, problem.constraints,
    );
    return sendSuccess(res, 201, "Problem created successfully", result.rows ? result.rows[0] : result);
  }

  async updateProblemById(req, res) {
    const problemId = getProblemId(req.params.problemId);
    const existingProblem = await problemService.get_problem_by_id(problemId);
    if (!existingProblem) throw new HttpError(404, "Problem not found");
    if (String(existingProblem.created_by) !== String(req.user.user_id)) {
      throw new HttpError(403, "You can only update your own problem");
    }

    const problem = { ...existingProblem, ...(req.body || {}) };
    assertProblemPayload(problem);
    const updatedProblem = await problemService.update_problem_by_id(
      problem.title, problem.difficulty, problem.time_limit, problem.memory_limit,
      existingProblem.created_by, problem.statement, problem.input_formate,
      problem.output_formate, problem.constraints, problemId,
    );
    return sendSuccess(res, 200, "Problem updated successfully", updatedProblem);
  }

  async deleteProblemById(req, res) {
    const problemId = getProblemId(req.params.problemId);
    const owner = await problemService.get_problem_owner_by_id(problemId);
    if (!owner) throw new HttpError(404, "Problem not found");
    if (String(owner.created_by) !== String(req.user.user_id)) {
      throw new HttpError(403, "You can only delete your own problem");
    }

    const deletedProblem = await problemService.delete_problem_by_id(problemId);
    return sendSuccess(res, 200, "Problem deleted successfully", deletedProblem);
  }
}

module.exports = ProblemController;
