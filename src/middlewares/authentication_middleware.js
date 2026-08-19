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

      req.user = await authenticationService.varify_auth_token(token);
      return next();
    } catch (error) {
      error.statusCode = 401;
      return next(error);
    }
  }
}

module.exports = AuthenticationMiddleware;
