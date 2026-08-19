const ProblemService = require("../services/problem_service");
const SubmissionService = require("../services/submission_service");
const { sendSuccess } = require("./response");

const problemService = new ProblemService();
const submissionService = new SubmissionService();

class MeController {
  async getProblems(req, res) {
    const problems = await problemService.get_problems_by_user_id(req.user.user_id);
    return sendSuccess(res, 200, "Your problems fetched successfully", problems);
  }

  async getSubmissions(req, res) {
    const submissions = await submissionService.get_submissions_by_user_id(req.user.user_id);
    return sendSuccess(res, 200, "Your submissions fetched successfully", submissions);
  }
}

module.exports = MeController;
