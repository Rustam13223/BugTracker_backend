const db = require("../../db");

async function get(req, res) {
  if (!req.params.id) {
    return res.status(400).end();
  }

  const dbResponse = await db.query(
    'SELECT user_id as "userId", comment, created_at as "createdAt" from comments where bug_id = $1 order by created_at',
    [req.params.id]
  );

  return res.status(200).json({
    status: "ok",
    comments: dbResponse.rows,
  });
}

module.exports = get;
