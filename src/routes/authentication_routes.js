const express = require('express');

const AuthenticationController = require("../controllers/authentication_controller");
const AuthenticationMiddleware = require("../middlewares/authentication_middleware")

const authenticationController = new AuthenticationController();
const authenticationMiddleware = new AuthenticationMiddleware();

const router = express.Router();


router.post(
    "/register",
    authenticationController.register.bind(authenticationController)

)


router.get(
    "/enter",
    authenticationController.enter.bind(authenticationController)
)


router.get(
    "/refresh",
    authenticationController.refresh.bind(authenticationController)
)

router.post(
    "/logout",
    authenticationMiddleware.varify_access_token.bind(authenticationMiddleware),
    authenticationController.logout.bind(authenticationController)
)


module.exports = router;
