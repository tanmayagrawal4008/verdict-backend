const {
  create_user,
  update_user_password,
  delete_user,
  check_if_email_exist,
  check_if_username_exist,
  get_user_by_email,
} = require("../models/authentication_model.js");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const BCRYPT_HASH_KEY = 12;

class AuthenticationService {
  async register(username, email, password) {
    try {
      // check if email already exist
      const email_check_result = await check_if_email_exist(email);
      if (email_check_result.length != 0) {
        console.log("email already exist");
        return "email already exist";
      }
      // check if username already exist
      const username_check_result = await check_if_username_exist(username);
      if (username_check_result.length != 0) {
        console.log("username already exists");
        return "username already exist";
      }
      const password_hash = await bcrypt.hash(password, BCRYPT_HASH_KEY);
      const result = await create_user(username, email, password_hash);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      console.log("user not created");
      return "user not created";
    }
  }

  async enter(email, password) {
    try {
      const email_check_result = await check_if_email_exist(email);
      if (email_check_result.length == 0) {
        console.log("email doesn't exist");
        return "email doesn't exist";
      }

      const user = await get_user_by_email(email);

      const is_password_correct = await bcrypt.compare(password, user.password);

      if (!is_password_correct) {
        console.log("password is incorrect");
      }

      const access_token = jwt.sign(
        {
          user_id: user.user_id,
          username: user.username,
        },
        process.env.JWT_ACCESS_SECRET,
        {
          expiresIn: "15m",
        },
      );
      const refresh_token = jwt.sign(
        {
          user_id: user.user_id,
          username: user.username,
        },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: "7d",
        },
      );

      console.log("access and refresh tokens are generated");
    } catch (error) {
      console.log(error);
      console.log("not entered");
      return "not enterred";
    }
  }


    async varify_auth_token(access_token){
        const decoded = jwt.varify(
            access_token,
            process.env.JWT_ACCESS_SECRET
        )
        console.log(decoded);
    }
    async unregister(user_id){
        try {
            const result = await delete_user(user_id);
            return result.rows[0];
        } catch (error) {
            console.log(error);
            console.log("user not deleted");
            return "user not deleted";
        }
    }


    

}

module.exports = AuthenticationService;
