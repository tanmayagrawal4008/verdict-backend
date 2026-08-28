const AuthenticationService = require("../services/authentication_service");
const { HttpError } = require("./http_error");

const authenticationService = new AuthenticationService();

class AuthenticationMiddleware {
  async verifyAccessToken(req, res, next) {
    try {
      const authorization = req.headers.authorization;
      if (!authorization) {
        throw new HttpError(401, "Access token is required");
      }

      const [scheme, token] = authorization.split(" ");
      if (scheme !== "Bearer" || !token) {
        throw new HttpError(401, "Authorization header must use Bearer token");
      }

      const verifyToken = authenticationService.verify_auth_token || authenticationService.varify_auth_token;
      req.user = await verifyToken.call(authenticationService, token);
      return next();
    } catch (error) {
      if (!error.statusCode && !error.status) {
        error.statusCode = 401;
      }
      return next(error);
    }
  }
}

module.exports = AuthenticationMiddleware;

