const ProblemService = require("../services/problem_service");
const SubmissionService = require("../services/submission_service");
const { HttpError } = require("../middlewares/http_error");
const { sendSuccess } = require("./response");

const problemService = new ProblemService();
const submissionService = new SubmissionService();

function positiveId(value, name) {
  if (!/^[1-9]\d*$/.test(String(value ?? ""))) {
    throw new HttpError(400, `${name} must be a positive integer`);
  }
  return String(value);
}

class SubmissionController {
  async createSubmission(req, res) {
    const problemId = positiveId(req.params.problemId, "problemId");
    const { submitted_code, language } = req.body || {};
    if (
      !submitted_code ||
      !language ||
      typeof submitted_code !== "string" ||
      typeof language !== "string" ||
      !submitted_code.trim() ||
      !language.trim()
    ) {
      throw new HttpError(400, "submitted_code and language are required");
    }

    const trimmedLanguage = language.trim();
    if (trimmedLanguage !== "CPP" && trimmedLanguage !== "C++") {
      throw new HttpError(400, "Only C++ submissions are currently supported");
    }

    const problem = await problemService.get_problem_by_id(problemId);
    if (!problem) throw new HttpError(404, "Problem not found");

    const submission = await submissionService.create_submission(
      problemId,
      submitted_code,
      trimmedLanguage,
      req.user.user_id,
    );
    return sendSuccess(res, 201, "Submission created successfully", submission);
  }

  async getSubmissionById(req, res) {
    const submissionId = positiveId(req.params.submissionId, "submissionId");
    const submission = await submissionService.get_submission_by_id(submissionId);
    if (!submission) throw new HttpError(404, "Submission not found");
    if (String(submission.submitted_by) !== String(req.user.user_id)) {
      throw new HttpError(403, "You can only view your own submission");
    }
    return sendSuccess(res, 200, "Submission fetched successfully", submission);
  }
}

module.exports = SubmissionController;

