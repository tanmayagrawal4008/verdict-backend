const express = require('express')
const app = express();
const PORT  = 3000;


app.get('/', (req,res )=>{
    res.send("varificaition response")

})


//start server
app.listen(PORT, ()=>{
    console.log(`express server running at  port ${PORT }`)
})



