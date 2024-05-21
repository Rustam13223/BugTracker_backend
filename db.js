const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // default Postgres port
  database:
    process.env.ENV_TYPE === "TEST"
      ? process.env.DB_TEST_DATABASE
      : process.env.DB_DATABASE,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
};
