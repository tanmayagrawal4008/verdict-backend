const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  create_user,
  check_if_email_exist,
  check_if_username_exist,
  get_user_by_email,
} = require("../models/authentication_model");

const BCRYPT_HASH_KEY = Number(process.env.BCRYPT_HASH_KEY) || 10;

function serviceError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = statusCode;
  return error;
}

class AuthenticationService {
  async register(username, email, password) {
    if ((await check_if_email_exist(email)).length > 0) {
      throw serviceError(409, "Email already exists");
    }
    if ((await check_if_username_exist(username)).length > 0) {
      throw serviceError(409, "Username already exists");
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_HASH_KEY);
    return create_user(username, email, passwordHash);
  }

  async enter(email, password) {
    const user = await get_user_by_email(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw serviceError(401, "Invalid email or password");
    }

    return {
      access_token: this.createAccessToken(user),
      refresh_token: this.createRefreshToken(user),
    };
  }

  createAccessToken(user) {
    return jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );
  }

  createRefreshToken(user) {
    return jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );
  }

  async verify_auth_token(accessToken) {
    try {
      return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    } catch {
      throw serviceError(401, "Invalid or expired access token");
    }
  }

  async varify_auth_token(accessToken) {
    return this.verify_auth_token(accessToken);
  }


  async refresh(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      return {
        access_token: this.createAccessToken({
          user_id: decoded.user_id,
          username: decoded.username,
        }),
      };
    } catch {
      throw serviceError(401, "Invalid or expired refresh token");
    }
  }

  async logout() {
    return { message: "Logout successful" };
  }
}

module.exports = AuthenticationService;
