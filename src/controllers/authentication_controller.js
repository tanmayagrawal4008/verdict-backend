const AuthenticationService = require("../services/authentication_service");
const { HttpError } = require("../middlewares/http_error");
const { sendSuccess } = require("./response");

const authenticationService = new AuthenticationService();

class AuthenticationController {
  async register(req, res) {
    const { username, email, password } = req.body || {};
    if (
      !username ||
      !email ||
      !password ||
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      throw new HttpError(400, "username, email and password are required");
    }

    const user = await authenticationService.register(username.trim(), email.trim(), password);
    return sendSuccess(res, 201, "User registered successfully", user);
  }

  async login(req, res) {
    const { email, password } = req.body || {};
    if (
      !email ||
      !password ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password.trim()
    ) {
      throw new HttpError(400, "email and password are required");
    }

    const tokens = await authenticationService.enter(email.trim(), password);
    return sendSuccess(res, 200, "Login successful", tokens);
  }

  async refresh(req, res) {
    const refreshToken =
      req.body?.refresh_token ||
      req.headers?.refresh_token ||
      req.headers?.["refresh-token"];

    if (!refreshToken || typeof refreshToken !== "string" || !refreshToken.trim()) {
      throw new HttpError(400, "refresh_token is required");
    }

    const token = await authenticationService.refresh(refreshToken.trim());
    return sendSuccess(res, 200, "Access token generated successfully", token);
  }

  async logout(req, res) {
    const result = await authenticationService.logout(req.user?.user_id);
    return sendSuccess(res, 200, result?.message || "Logout successful");
  }
}

module.exports = AuthenticationController;

