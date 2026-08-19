const express = require("express");
const MeController = require("../controllers/me_controller");
const AuthenticationMiddleware = require("../middlewares/authentication_middleware");
const asyncHandler = require("../middlewares/async_handler");
const errorMiddleware = require("../middlewares/error_middleware");

const router = express.Router();
const controller = new MeController();
const authenticationMiddleware = new AuthenticationMiddleware();
const requireAuth = asyncHandler(authenticationMiddleware.verifyAccessToken.bind(authenticationMiddleware));

router.get("/problems", requireAuth, asyncHandler(controller.getProblems.bind(controller)));
router.get("/submissions", requireAuth, asyncHandler(controller.getSubmissions.bind(controller)));

router.use(errorMiddleware);

module.exports = router;
