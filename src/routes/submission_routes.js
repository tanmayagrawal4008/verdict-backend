const express = require("express");
const SubmissionController = require("../controllers/submission_controller");
const AuthenticationMiddleware = require("../middlewares/authentication_middleware");
const asyncHandler = require("../middlewares/async_handler");
const errorMiddleware = require("../middlewares/error_middleware");

const router = express.Router();
const controller = new SubmissionController();
const authenticationMiddleware = new AuthenticationMiddleware();

router.get(
  "/:submissionId",
  asyncHandler(authenticationMiddleware.verifyAccessToken.bind(authenticationMiddleware)),
  asyncHandler(controller.getSubmissionById.bind(controller)),
);

router.use(errorMiddleware);

module.exports = router;
