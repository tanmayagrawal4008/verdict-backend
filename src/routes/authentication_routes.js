const express = require("express");
const AuthenticationController = require("../controllers/authentication_controller");
const AuthenticationMiddleware = require("../middlewares/authentication_middleware");
const asyncHandler = require("../middlewares/async_handler");
const errorMiddleware = require("../middlewares/error_middleware");

const router = express.Router();
const controller = new AuthenticationController();
const authenticationMiddleware = new AuthenticationMiddleware();

router.post("/register", asyncHandler(controller.register.bind(controller)));
router.post("/login", asyncHandler(controller.login.bind(controller)));
router.post("/refresh", asyncHandler(controller.refresh.bind(controller)));
router.post(
  "/logout",
  asyncHandler(authenticationMiddleware.verifyAccessToken.bind(authenticationMiddleware)),
  asyncHandler(controller.logout.bind(controller)),
);

router.use(errorMiddleware);

module.exports = router;
