


const pool = require("../db");


const test = async ()=>{
    const result = await pool.query(
    "SELECT NOW()"
    )
    console.log(result.rows);
    

}

test();



