const express = require("express");
const ProblemController = require("../controllers/problem_controller");
const SubmissionController = require("../controllers/submission_controller");
const TestcaseController = require("../controllers/testcase_controller");
const AuthenticationMiddleware = require("../middlewares/authentication_middleware");
const asyncHandler = require("../middlewares/async_handler");
const errorMiddleware = require("../middlewares/error_middleware");

const router = express.Router();
const problemController = new ProblemController();
const submissionController = new SubmissionController();
const testcaseController = new TestcaseController();
const authenticationMiddleware = new AuthenticationMiddleware();
const requireAuth = asyncHandler(authenticationMiddleware.verifyAccessToken.bind(authenticationMiddleware));

router.get("/", asyncHandler(problemController.getProblems.bind(problemController)));
router.get("/:problemId", asyncHandler(problemController.getProblemById.bind(problemController)));
router.get(
  "/:problemId/sample-testcases",
  asyncHandler(testcaseController.getSampleTestcases.bind(testcaseController)),
);
router.post("/", requireAuth, asyncHandler(problemController.createProblem.bind(problemController)));
router.patch("/:problemId", requireAuth, asyncHandler(problemController.updateProblemById.bind(problemController)));
router.delete("/:problemId", requireAuth, asyncHandler(problemController.deleteProblemById.bind(problemController)));
router.get(
  "/:problemId/testcases",
  requireAuth,
  asyncHandler(testcaseController.getTestcases.bind(testcaseController)),
);
router.post(
  "/:problemId/testcases",
  requireAuth,
  asyncHandler(testcaseController.createTestcase.bind(testcaseController)),
);
router.post(
  "/:problemId/submissions",
  requireAuth,
  asyncHandler(submissionController.createSubmission.bind(submissionController)),
);

router.use(errorMiddleware);

module.exports = router;
