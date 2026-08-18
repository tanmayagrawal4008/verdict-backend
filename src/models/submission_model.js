const pool = require("../db");




/*

CREATE TABLE submissions_with_problem(
	submission_id BIGSERIAL PRIMARY KEY,
	problem_id BIGINT NOT NULL REFERENCES problems(problem_id) ON DELETE CASCADE,
	submitted_by BIGINT NOT NULL REFERENCES users(user_id) ,
    submitted_code TEXT NOT NULL,
	submission_status VARCHAR(255) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	
)


*/
const create_sumbission = async(
    problem_id, submitted_by, submitted_code,   language, submission_status
) =>{
    const query = `
        INSERT INTO submissions_with_problem(problem_id, submitted_by,submitted_code, language,  submission_status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING submission_id, problem_id, language, submitted_by, submission_status, created_at, updated_at;
    `
    const values = [problem_id, submitted_by, submitted_code, language,  submission_status];
    const result = pool.query(query, values);
    return result.rows[0];
}


const update_submission_status_by_id = async(
    submission_id, submission_status
) =>{
    const query = `
        UPDATE submissions_with_problem
        SET submission_status = $2
        WHERE submission_id = $1
        RETURNING submission_id, submission_status
    `


    const values = [submission_id, submission_status];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const get_submissions_by_problem_id = async(
    problem_id
) =>{
    const query = `
        SELECT submission_id, problem_id, submission_status, submitted_by, created_at, updated_at
        FROM submissions_with_problem
        WHERE problem_id = $1;
    `

    const values  = [problem_id];
    const result = await pool.query(query, values);
    return result.rows;
}


const get_submissions_by_user_id = async(
    user_id
) =>{
    const query = `
        SELECT submission_id, problem_id, submission_status, submitted_by, created_at, updated_at
        FROM submissions_with_problem
        WHERE created_by = $1;
    `
    const values =[user_id];
    const result = await pool.query(query, values);
    return result.rows;
}


const get_submission_by_id = async(
    submission_id
) =>{
    const query = `
        SELECT submission_id, problem_id, submission_status, submitted_code, language submitted_by, created_at ,updated_at
        FROM submissions_with_problem
        WHERE submission_id = $1;
    `

    const values = [submission_id];
    const result = await pool.query(query, values);
    return result.rows[0];
}


const get_submission_owner_by_id = async (
    submission_id
)=>{
    const query = `
        SELECT submitted_by FROM submissions_with_problem
        WHERE submission_id = $1;
    `

    const values  = [submission_id];
    const result = await pool.query(query, values);
    return result.rows[0];
}



module.exports = {
    create_sumbission,
    update_submission_status_by_submission_id,
    get_submissions_by_problem_id,
    get_submissions_by_user_id,
    get_submission_by_id,
    get_submission_owner_by_id,



}