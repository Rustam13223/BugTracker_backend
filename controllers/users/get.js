const db = require("../../db");

async function get(req, res) {
  const dbResponse = await db.query("SELECT * FROM users");

  return res.status(200).json({
    status: "ok",
    users: dbResponse.rows,
  });
}

module.exports = get;
