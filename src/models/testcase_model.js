const pool = require("../db");

const create_testcase = async(
    problem_id, created_by, input, expected_output, is_sample
)=>{
    const query = `
        INSERT INTO testcases(problem_id, created_by, input, expected_output, is_sample)
        VALUES($1, $2 , $3, $4, $5)
        RETURNING problem_id, created_by, input, expected_output, is_sample, created_at, updated_at;
    `

    const values = [problem_id, created_by, input, expected_output, is_sample]
    const result  = await pool.query(query, values);
    return result.rows[0];


}

const update_testcase_by_id = async(
    testcase_id , problem_id, input, expected_output, is_sample
) =>{
    const query = `
        UPDATE testcases
        SET problem_id = $2, input = $3, expected_output = $4, is_sample = $5
        WHERE testcase_id = $1
        RETURNING testcase_id, problem_id, created_by, created_at, updated_at
    `

    const values = [testcase_id, problem_id, input, expected_output, is_sample];
    const result = await pool.query(query, values);
    return result.rows[0]
}


const delete_testcase_by_id = async(
    testcase_id
) =>{
    const query = `
        DELETE FROM testcases
        WHERE testcase_id = $1
        RETURNING testcase_id, problem_id, created_by, created_at, updated_at;
    `


    const values = [testcase_id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const get_user_by_testcase_id = async(
    testcase_id
)=>{
    const query = `
        SELECT created_by, testcase_id FROM testcases
        WHERE testcase_id = $1;
    `
    const values = [testcase_id];
    const result = await pool.query(query, values);
    return result.rows[0];
}



const get_all_testcases_by_problem_code = async(
    problem_code
) =>{
    const query = `
        SELECT testcase_id, problem_id, problem_code , input, expected_output
        FROM testcases
        WHERE problem_code = $1;
    `
    const values = [problem_code];
    const result = await pool.query(query,values);
    return result.rows;
}

const get_sample_testcases_by_problem_code = async(
    problem_code
)=>{
    const query = `
        SELECT testcase_id, problem_id, problem_code, input, expected_output, is_sample
        FROM testcases
        WHERE problem_code = $1 AND is_sample = true;
    `

    const values =[problem_code];
    const result = await pool.query(query, values);
    return result.rows;
}



module.exports = {
    create_testcase,
    update_testcase_by_id,
    delete_testcase_by_id,
    get_user_by_testcase_id,
    get_all_testcases_by_problem_code,
    get_sample_testcases_by_problem_code
}



