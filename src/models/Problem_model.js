const pool = require("../db");




// ----------- schema -------------------------------------------------------------------
/*
                                                 Table "public.problems"
     Column     |            Type             | Collation | Nullable |                   Default
----------------+-----------------------------+-----------+----------+----------------------------------------------
 problem_id     | bigint                      |           | not null | nextval('problems_problem_id_seq'::regclass)
 title          | character varying(255)      |           | not null |
 difficulty     | integer                     |           |          |
 time_limit     | integer                     |           | not null |
 memory_limit   | integer                     |           | not null |
 created_by     | bigint                      |           |          |
 statement      | text                        |           | not null |
 input_formate  | text                        |           |          |
 output_formate | text                        |           |          |
 constraints    | text                        |           |          |
 created_at     | timestamp without time zone |           | not null | CURRENT_TIMESTAMP
 updated_at     | timestamp without time zone |           | not null | CURRENT_TIMESTAMP
Indexes:
    "problems_pkey" PRIMARY KEY, btree (problem_id)
Foreign-key constraints:
    "problems_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
Referenced by:
    TABLE "submissions_with_problem" CONSTRAINT "submissions_with_problem_problem_id_fkey" FOREIGN KEY (problem_id) REFERENCES problems(problem_id) ON DELETE CASCADE
    TABLE "testcases" CONSTRAINT "testcases_problem_id_fkey" FOREIGN KEY (problem_id) REFERENCES problems(problem_id) ON DELETE CASCADE

*/
// -------------------------------------------------------------------------------------
const create_problem = async(
 title, difficulty, time_limit, memory_limit, created_by, statement, input_formate, output_formate, constraints
)=>{
    const query = `
        INSERT INTO problems(title, difficulty, time_limit, memory_limit, created_by, statement, input_formate, output_formate, constraints)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING problem_id, created_at, updated_at;
    `

    const values = [title, difficulty, time_limit, memory_limit, created_by, statement, input_formate, output_formate, constraints];
    const result = await pool.query(query, values);
    return result.rows[0];
}

// -------------------------------------------------------------------------------------
const update_problem_by_id = async(
      title , difficulty, time_limit, memory_limit,created_by, statement, input_formate, output_formate, constraints, problem_id
) =>{

    const query = `
        UPDATE problems
        SET title = $1, difficulty = $2,  time_limit = $3, memory_limit = $4 ,created_by = $5 , statement = $6, input_formate = $7 , output_formate = $8, constraints = $9
        WHERE problem_id = $10
        RETURNING problem_id, created_at , updated_at

    `
    const values = [title , difficulty,  time_limit, memory_limit,created_by, statement, input_formate, output_formate, constraints, problem_id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

// -------------------------------------------------------------------------------------


const delete_problem_by_id = async(
    problem_id
) =>{
    const query = `
        DELETE FROM problems
        WHERE problem_id = $1
        RETURNING problem_id, created_at, updated_at

    `
    const values = [problem_id];
    const result = await pool.query(query, values);
    return result.rows[0];
}



const get_problems = async()=>{
    const query = `
        SELECT * FROM problems;
    `
    const values = [];
    const result = await pool.query(query, values);
    return result.rows;

}

const get_problems_by_user_id = async(user_id) => {
    const query = `
        SELECT * FROM problems
        WHERE created_by = $1
        ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
};
const get_problem_by_id = async(
    problem_id
) =>{
    const query = `
        SELECT * FROM problems
        WHERE problem_id = $1;
    `

    const values = [problem_id];
    const result = await pool.query(query, values);
    return result.rows[0];

}

const get_problem_owner_by_id = async(
    problem_id
) =>{
    const query = `
        SELECT created_by FROM problems
        WHERE problem_id = $1;
    `
    const values =[problem_id];
    const result = await pool.query(query, values);
    return result.rows[0];
}




// -------------------------------------------------------------------------------------


module.exports = {
    create_problem,
    update_problem_by_id,
    delete_problem_by_id,
    get_problems,
    get_problems_by_user_id,
    get_problem_by_id,
    get_problem_owner_by_id

}




