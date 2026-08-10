const AuthenticationService = require("../services/authentication_service");

const authenticationService = new AuthenticationService();
class AuthenticaionMiddleware {
  async varify_access_token(req, res, next) {
    try {
      const auth_header = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          message: "Access token required",
        });
      }

      const [scheme, token] = authHeader.split(" ");

      if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
          message: "Invalid authorization header",
        });
      }

      console.log(auth_header);

      const decoded = await authenticationService.varify_auth_token(token);
      req.user = decoded;

      next();

    } catch (error) {

         return res.status(401).json({
            message: "Invalid or expired access token"
        });
    }

  }





}



module.exports = AuthenticaionMiddleware;
