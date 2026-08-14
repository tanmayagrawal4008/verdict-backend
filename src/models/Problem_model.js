const pool = require("../db");


// -------------------------------------------------------------------------------------
const create_problem = async(
    problem_code, title, time_limit, memory_limit, create_by, statement, input_formate, output_formate, constraints
)=>{
    const query = `
        INSERT INTO problems(problem_code, title, time_limit, memeory_limit, created_by, statement, input_formate, output_formate, constraints)
        VALUES($1, $2, $3, $4, $5 , $6, $7, $8, $9)
        RETURNING problem_id, problem_code, created_at, updated_at;
    `

    const values = [problem_code, title, time_limit, memory_limit, create_by, statement, input_formate, output_formate, constraints];
    const result = await pool.query(query, values);
    return result;
}

// -------------------------------------------------------------------------------------
const update_problem_by_id = async(
      title , time_limit, memory_limit,created_by, statement, input_formate, output_formate, constraints, problem_code
) =>{

    const query = `
        UPDATE problems
        SET title = $1, time_limit = $2, memory_limit = $3 ,created_by = $4 , statement = $5, input_formate = $6 , output_formate = $7, constraints = $8
        WHERE problem_code = $9
        RETURNING problem_id, problem_code, created_at , updated_at

    `
    const values = [title , time_limit, memory_limit,created_by, statement, input_formate, output_formate, constraints, problem_code];
    const result = pool.query(query, values);
    return result.rows[0];
}

// -------------------------------------------------------------------------------------


const delete_problem_by_code = async(
    problem_code
) =>{
    const query = `
        DELETE FROM problems
        WHERE problem_code = $1
        RETURNING problem_id, problem_code, created_at, updated_at

    `
    const values = [problem_code];
    const result = pool.query(query, values);
    return result.rows[0];
}

// -------------------------------------------------------------------------------------





