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
        const error = new Error("Email already exists");
        error.statusCode = 409;
        throw error;
      }
      // check if username already exist
      const username_check_result = await check_if_username_exist(username);
      if (username_check_result.length != 0) {
        const error = new Error("username already exists");
        error.statusCode = 409;
        throw error;
      }

      const password_hash = await bcrypt.hash(password, BCRYPT_HASH_KEY);
      const result = await create_user(username, email, password_hash);
        return result;
    } catch (error) {
        error.location = "services error";
        throw error;
      
    }
  }

  async enter(email, password) {
    try {
      const email_check_result = await check_if_email_exist(email);
      if (email_check_result.length == 0) {
        const error = new Error("Email doesn't exists");
        error.statusCode = 409;
        throw error;
        }


      const user = await get_user_by_email(email);

      const is_password_correct = await bcrypt.compare(password, user.password);

      if (!is_password_correct) {
        const error = new Error("wrong password");
        error.statusCode = 409;
        throw error;
      }

      const access_token =  jwt.sign(
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
      return {
        access_token : access_token,
        refresh_token : refresh_token
      };
    } catch (error) {
      error.location = "services error";
      throw error;
    }
  }


  

    async varify_auth_token(access_token){



        try {
            
            const decoded = jwt.varify(
                access_token,
                process.env.JWT_ACCESS_SECRET
            )
            return decoded;
        } catch (error) {
            error.location = "service error";
            error.message = "wrong token";
            error.statusCode = 409;
            throw error;
            
        }
        

    }
 
    async refresh(refresh_token){
        try {
        
            const decoded = jwt.verify(
                refresh_token,
                process.env.JWT_REFRESH_SECRET
            );



            const user_id = decoded.user_id;
            const username = decoded.username;
            const access_token = jwt.sign(
                {
                    user_id : user_id,
                    username : username
                },
                process.env.JWT_ACCESS_SECRET,
                {
                    expiresIn : "15m"
                }
            )


            return {
                access_token : access_token
            }

        } catch (error) {
            console.log(error);
            error.statusCode  = 409;
            error.location = "services error";
            error.message = "wrong token";
            throw error;
        }
    }



    async logout(email){
        return {
            message : "logout successful"
        }
    }




}

module.exports = AuthenticationService;
