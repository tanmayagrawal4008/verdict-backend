const judgeQueue = require("../queue/judge_queue");
const submissionModel = require("../models/submission_model");
const submissionOnTestcaseModel = require("../models/submission_on_testcase");

class SubmissionService {
  async create_submission(problemId, submittedCode, language, submittedBy) {
    const submissionLanguage = language === "CPP" ? "C++" : language;
    const submission = await submissionModel.create_submission(
      problemId,
      submittedCode,
      submissionLanguage,
      submittedBy,
      "PENDING",
    );

    try {
      await judgeQueue.add(
        "judge-submission",
        { submissionId: submission.submission_id },
        { jobId: `submission-${submission.submission_id}` },
      );
      return submission;
    } catch (error) {
      try {
        await submissionModel.update_submission_status_by_id(submission.submission_id, "QUEUE_ERROR");
      } catch (updateError) {
        console.error(`Could not mark submission ${submission.submission_id} as QUEUE_ERROR:`, updateError.message);
      }
      const queueError = new Error("Submission queue is temporarily unavailable");
      queueError.statusCode = 503;
      queueError.status = 503;
      throw queueError;
    }
  }


  async update_submission_status_by_id(submissionId, status) {
    return submissionModel.update_submission_status_by_id(submissionId, status);
  }

  async persist_judge_result(submissionId, verdict, testResults) {
    return submissionModel.persist_judge_result(submissionId, verdict, testResults);
  }

  async get_result_by_submission_and_testcase_ids(submissionId, testcaseId) {
    return submissionOnTestcaseModel.get_result_by_submission_and_testcase_ids(submissionId, testcaseId);
  }

  async get_submission_by_id(submissionId) {
    return submissionModel.get_submission_by_id(submissionId);
  }

  async get_submission_owner_by_id(submissionId) {
    return submissionModel.get_submission_owner_by_id(submissionId);
  }

  async get_submissions_by_user_id(userId) {
    return submissionModel.get_submissions_by_user_id(userId);
  }
}

module.exports = SubmissionService;
