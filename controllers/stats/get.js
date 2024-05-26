const db = require("../../db");

async function get(req, res) {
  const dbResponse = await db.query(
    "SELECT * FROM stats ORDER BY solved_bugs LIMIT 10"
  );
  return res.status(200).json({
    status: "ok",
    stats: dbResponse.rows,
  });
}

module.exports = get;
