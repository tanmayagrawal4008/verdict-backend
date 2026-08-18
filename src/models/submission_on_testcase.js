const pool = require("../db");


/*
                           Table "public.submission_on_testcase"
      Column       |            Type             | Collation | Nullable |      Default
-------------------+-----------------------------+-----------+----------+-------------------
 submission_id     | bigint                      |           | not null |
 testcase_id       | bigint                      |           | not null |
 output            | text                        |           |          |
 submission_status | character varying(255)      |           | not null |
 created_at        | timestamp without time zone |           | not null | CURRENT_TIMESTAMP
 updated_at        | timestamp without time zone |           | not null | CURRENT_TIMESTAMP


*/
 const create_submission_on_testcase = async(
    submission_id, testcase_id, output, submission_status
)=>{
    const query = `
        INSERT INTO submission_on_testcase(submission_id, testcase_id, output, submission_status)
        VALUES ($1, $2, $3, $4)
        RETURNING 

    `

    const values = [submission_id, testcase_id, output, submission_status]
    const reuslt = await pool.query(query, values);
    return result.rows[0];

    
}



const get_result_by_submission_and_testcase_ids = async(
    submission_id, testcase_id
) =>{
    const query = `
        SELECT sumbission_id, testcase_id, output, submission_status, created_at, updated_at
        FROM submission_on_testcase
        WHERE submission_id = $1 AND testcase_id = $2;

    `

    const values = [submission_id, testcase_id];
    const result = await pool.query(query, values);
    return result.rows[0];
}  




