const AuthenticationService = require("../services/authentication_service");

const authenticationService = new AuthenticationService();

class AuthenticationController{
    async register(req, res){
        try {


            
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;

            if(!username || !email || !password){
                return res.status(409).json({
                    error : "invalid request"
                })
            }
            const result = await authenticationService.register(username, email, password);
            return res.status(201).json({
                message : "user registered successfully",
                data : result
            })
            
        } catch (error) {

            console.error(error);
            return res.status(error.statusCode).json({
                message : error.message
            })
        }
    }


    async enter(req, res){
        try {
            const email = req.body.email;
            const password = req.body.password;
            const result = await authenticationService.enter(email, password);
            return res.status(201).json({
                message : "user entered successfully",
                data : result
            })
        } catch (error) {
            console.error(error);
            return res.status(error.statusCode).json({
                message : error.message
            })
        }
    }

    async refresh(req, res){
        try {
            const refresh_token = req.headers.refresh_token;
            const result = await authenticationService.refresh(refresh_token);
            res.status(201).json({
                message : "access token generated successfully",
                data :  result
            })


        } catch (error) {
            console.log(error);
            return res.status(error.statusCode).json({
                error : error
            }
            )
        }
    }

    async logout(req, res){
        try {
            const email = req.user.email
            const result = authenticationService.logout(email);
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message : "internal server error, not logged out"
            })
        }
    }



}

module.exports = AuthenticationController;
