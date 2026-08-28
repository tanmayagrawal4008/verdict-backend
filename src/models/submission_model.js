const pool = require("../db");



const create_submission = async(
    problem_id, submitted_code, submission_language, submitted_by, submission_status
) =>{
    const query = `
        INSERT INTO submissions_with_problem(problem_id, submitted_code, submission_language, submitted_by, submission_status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING submission_id, problem_id, submission_language, submitted_by, submission_status, created_at, updated_at;
    `
    const values = [problem_id, submitted_code, submission_language, submitted_by, submission_status];
    const result = await pool.query(query, values);
    return result.rows[0];
}


const update_submission_status_by_id = async (
  submission_id, submission_status
) => {
  const query = `
        UPDATE submissions_with_problem
        SET submission_status = $2, updated_at = CURRENT_TIMESTAMP
        WHERE submission_id = $1
        RETURNING submission_id, submission_status, updated_at;
    `;

  const values = [submission_id, submission_status];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const get_submissions_by_problem_id = async (problem_id) => {
  const query = `
        SELECT submission_id, problem_id, submission_language, submission_status, submitted_by, created_at, updated_at
        FROM submissions_with_problem
        WHERE problem_id = $1
        ORDER BY created_at DESC;
    `;

  const values = [problem_id];
  const result = await pool.query(query, values);
  return result.rows;
};

const get_submissions_by_user_id = async (user_id) => {
  const query = `
        SELECT submission_id, problem_id, submission_language, submission_status, submitted_by, created_at, updated_at
        FROM submissions_with_problem
        WHERE submitted_by = $1
        ORDER BY created_at DESC;
    `;
  const values = [user_id];
  const result = await pool.query(query, values);
  return result.rows;
};

const get_submission_by_id = async (submission_id) => {
  const query = `
        SELECT submission_id, problem_id, submission_status, submitted_code,
               submission_language, submitted_by, created_at, updated_at,
               (
                 SELECT (
                   SELECT COUNT(*)
                   FROM testcases AS earlier_testcase
                   WHERE earlier_testcase.problem_id = submissions_with_problem.problem_id
                     AND earlier_testcase.testcase_id < result.testcase_id
                 ) + 1
                 FROM submission_on_testcase AS result
                 WHERE result.submission_id = submissions_with_problem.submission_id
                   AND result.submission_status <> 'ACCEPTED'
                 ORDER BY result.testcase_id ASC
                 LIMIT 1
               ) AS failed_testcase_number
        FROM submissions_with_problem
        WHERE submission_id = $1;
    `;

  const values = [submission_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const get_submission_owner_by_id = async (submission_id) => {
  const query = `
        SELECT submitted_by FROM submissions_with_problem
        WHERE submission_id = $1;
    `;

  const values = [submission_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const persist_judge_result = async (submission_id, verdict, test_results) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      "DELETE FROM submission_on_testcase WHERE submission_id = $1;",
      [submission_id],
    );

    for (const testResult of (test_results || [])) {
      await client.query(
        `
                    INSERT INTO submission_on_testcase(
                        submission_id, testcase_id, output, submission_status
                    )
                    VALUES ($1, $2, $3, $4);
                `,
        [
          submission_id,
          testResult.testCaseId,
          testResult.actualOutput ?? "",
          testResult.verdict,
        ],
      );
    }

    const updateResult = await client.query(
      `
                UPDATE submissions_with_problem
                SET submission_status = $2, updated_at = CURRENT_TIMESTAMP
                WHERE submission_id = $1
                RETURNING submission_id, submission_status, updated_at;
            `,
      [submission_id, verdict],
    );
    await client.query("COMMIT");
    return updateResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};




module.exports = {

    create_submission,
    update_submission_status_by_id,
    get_submissions_by_problem_id,
    get_submissions_by_user_id,
    get_submission_by_id,
    get_submission_owner_by_id,
    persist_judge_result,



}
