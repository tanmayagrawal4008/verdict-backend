const pool = require("../db");



// -- schema -----
/*

                                               Table "public.testcases"
     Column      |            Type             | Collation | Nullable |                    Default
-----------------+-----------------------------+-----------+----------+------------------------------------------------
 testcase_id     | bigint                      |           | not null | nextval('testcases_testcase_id_seq'::regclass)
 problem_id      | bigint                      |           | not null |
 created_by      | bigint                      |           | not null |
 input           | text                        |           | not null |
 expected_output | text                        |           | not null |
 is_sample       | boolean                     |           |          | false
 created_at      | timestamp without time zone |           | not null | CURRENT_TIMESTAMP
 updated_at      | timestamp without time zone |           | not null | CURRENT_TIMESTAMP
Indexes:
    "testcases_pkey" PRIMARY KEY, btree (testcase_id)
Foreign-key constraints:
    "testcases_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(user_id)
    "testcases_problem_id_fkey" FOREIGN KEY (problem_id) REFERENCES problems(problem_id) ON DELETE CASCADE
Referenced by:
    TABLE "submission_on_testcase" CONSTRAINT "submission_on_testcase_testcase_id_fkey" FOREIGN KEY (testcase_id) REFERENCES testcases(testcase_id) ON DELETE CASCADE

*/
const create_testcase = async(
    problem_id, created_by, input, expected_output, is_sample
)=>{
    const query = `
        INSERT INTO testcases(problem_id, created_by, input, expected_output, is_sample)
        VALUES($1, $2 , $3, $4, $5)
        RETURNING testcase_id, problem_id, created_by, input, expected_output, is_sample, created_at, updated_at;
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



const get_all_testcases_by_problem_id = async(
    problem_id
) =>{
    const query = `
        SELECT testcase_id, problem_id, input, expected_output
        FROM testcases
        WHERE problem_id = $1;
    `
    const values = [problem_id];
    const result = await pool.query(query,values);
    return result.rows;
}

const get_sample_testcases_by_problem_id = async(
    problem_id
)=>{
    const query = `
        SELECT testcase_id, problem_id, input, expected_output, is_sample
        FROM testcases
        WHERE problem_id = $1 AND is_sample = true;
    `

    const values =[problem_id];
    const result = await pool.query(query, values);
    return result.rows;
}



module.exports = {
    create_testcase,
    update_testcase_by_id,
    delete_testcase_by_id,
    get_user_by_testcase_id,
    get_all_testcases_by_problem_id,
    get_sample_testcases_by_problem_id
}

