const express = require('express')
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;


const AuthenticationService = require('./services/authentication_service');





app.get('/', (req,res )=>{
    res.send("varificaition response")

})


//start server


app.listen(PORT , ()=>{
    console.log(`express server running at  port ${PORT }`);
    const obj = new AuthenticationService();
    // obj.register('agrawaltanmay17', 'agrawaltanmay236@gmail.com', 'Tanmay@123');

    obj.enter('agrawaltanmay236@gmail.com', 'Tanmay@123');


})



