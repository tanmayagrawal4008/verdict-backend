const { Worker } = require("bullmq");
const redisConnection = require("./redis_connection");
const judgeService = require("../judge/judge_service");
const SubmissionService = require("../services/submission_service");
const ProblemService = require("../services/problem_service");
const TestcaseService = require("../services/testcase_service");

const submissionService = new SubmissionService();
const problemService = new ProblemService();
const testcaseService = new TestcaseService();

async function processSubmission(job) {
  const submissionId = job.data?.submissionId;
  if (!submissionId) throw new Error("Judge job is missing submissionId");

  try {
    const submission = await submissionService.get_submission_by_id(submissionId);
    if (!submission) throw new Error(`Submission ${submissionId} was not found`);

    await submissionService.update_submission_status_by_id(submissionId, "JUDGING");

    const problem = await problemService.get_problem_by_id(submission.problem_id);
    if (!problem) throw new Error(`Problem ${submission.problem_id} was not found`);

    const testCases = await testcaseService.get_all_testcases_by_problem_id(problem.problem_id);
    const result = await judgeService.judgeSubmission({
      submissionId,
      sourceCode: submission.submitted_code,
      language: submission.submission_language,
      testCases,
      timeLimit: problem.time_limit,
      memoryLimit: problem.memory_limit,
    });

    await submissionService.persist_judge_result(
      submissionId,
      result.verdict,
      result.testResults,
    );
    return result;
  } catch (error) {
    if (submissionId) {
      try {
        await submissionService.update_submission_status_by_id(submissionId, "SYSTEM_ERROR");
      } catch (statusError) {
        console.error(`Could not update submission ${submissionId} status:`, statusError.message);
      }
    }
    throw error;
  }
}


const judgeWorker = new Worker("judge_queue", processSubmission, {
  connection: redisConnection,
  concurrency: 2,
});

judgeWorker.on("completed", (job, result) => {
  console.log(`Submission ${result.submissionId} completed with ${result.verdict}`);
});

judgeWorker.on("failed", (job, error) => {
  console.error(`Judge job ${job?.id} failed:`, error.message);
});

console.log("Judge worker started");

module.exports = judgeWorker;
