const pool = require("../db");


// --- schema ---

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
Indexes:
    "submission_on_testcase_pkey" PRIMARY KEY, btree (submission_id, testcase_id)
Foreign-key constraints:
    "submission_on_testcase_submission_id_fkey" FOREIGN KEY (submission_id) REFERENCES submissions_with_problem(submission_id) ON DELETE CASCADE
    "submission_on_testcase_testcase_id_fkey" FOREIGN KEY (testcase_id) REFERENCES testcases(testcase_id) ON DELETE CASCADE
*/
 const create_submission_on_testcase = async(
    submission_id, testcase_id, output, submission_status
)=>{
    const query = `
        INSERT INTO submission_on_testcase(submission_id, testcase_id, output, submission_status)
        VALUES ($1, $2, $3, $4)
        RETURNING submission_id, testcase_id, submission_status,created_at, updated_at

    `

    const values = [submission_id, testcase_id, output, submission_status]
    const result = await pool.query(query, values);
    return result.rows[0];


}



const get_result_by_submission_and_testcase_ids = async(
    submission_id, testcase_id
) =>{
    const query = `
        SELECT submission_id, testcase_id, output, submission_status, created_at, updated_at
        FROM submission_on_testcase
        WHERE submission_id = $1 AND testcase_id = $2;

    `

    const values = [submission_id, testcase_id];
    const result = await pool.query(query, values);
    return result.rows[0];
}  

const delete_results_by_submission_id = async(submission_id) => {
    const query = `
        DELETE FROM submission_on_testcase
        WHERE submission_id = $1;
    `;
    await pool.query(query, [submission_id]);
};


module.exports = {
    create_submission_on_testcase,
    get_result_by_submission_and_testcase_ids,
    delete_results_by_submission_id,
};
