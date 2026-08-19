const pool = require("../db");





// ------ schema --------
/*
                                               Table "public.users"
   Column   |            Type             | Collation | Nullable |                Default
------------+-----------------------------+-----------+----------+----------------------------------------
 user_id    | integer                     |           | not null | nextval('users_user_id_seq'::regclass)
 username   | character varying(20)       |           |          |
 email      | character varying(255)      |           |          |
 password   | character varying(255)      |           |          |
 created_at | timestamp without time zone |           | not null | now()
 updated_at | timestamp without time zone |           | not null | now()
Indexes:
    "users_pkey" PRIMARY KEY, btree (user_id)
Referenced by:
    TABLE "problems" CONSTRAINT "problems_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
    TABLE "submissions_with_problem" CONSTRAINT "submissions_with_problem_submitted_by_fkey" FOREIGN KEY (submitted_by) REFERENCES users(user_id)
    TABLE "testcases" CONSTRAINT "testcases_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(user_id)
*/
const create_user = async (username, email, password) => {
  const query = `
        INSERT INTO users(username, email, password)
        VALUES($1, $2, $3)
        RETURNING user_id, username, email,created_at;
    `;
  const values = [username, email, password];
  const result = await pool.query(query, values);
  return result.rows[0];
};
const update_user_password = async (id, newPassword) => {
  const query = `
        UPDATE users
        SET password = $2
        WHERE user_id = $1
        RETURNING user_id, username,  updated_at;
    `;

  const values = [id, newPassword];
  const result = await pool.query(query, values);
  return result.rows[0];
};
const delete_user = async (id) => {
  const query = `
        DELETE FROM users
        WHERE user_id = $1
        RETURNING user_id, username;
    
    `;
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const check_if_username_exist = async (username) => {
  const query = `
        SELECT user_id, username, email FROM users
        WHERE username = $1;
    `;
  const values = [username];
  const result = await pool.query(query, values);
  return result.rows;
};

const check_if_email_exist = async (email) => {
  const query = `
        SELECT user_id, username, email FROM users
        WHERE email = $1;
    `;
  const values = [email];
  const result = await pool.query(query, values);
  return result.rows;
};

const get_user_by_email = async (email) => {
  const query = `
        SELECT user_id, username, email, password FROM users
        WHERE email = $1;
    `;

  const values = [email];
  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = {
  create_user,
  update_user_password,
  delete_user,
  check_if_email_exist,
  check_if_username_exist,
  get_user_by_email,
};
