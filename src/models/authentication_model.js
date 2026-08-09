const pool = require("../db");

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
        WHERE id = $1
        RETURNING user_id, username,  updated_at;
    `;

  const values = [id, newPassword];
  const result = await pool.query(query, values);
  return result.rows[0];
};
const delete_user = async (id) => {
  const query = `
        DELETE FROM users
        WHERE id = $1
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
