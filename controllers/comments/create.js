const db = require("../../db");

async function create(req, res) {
  const { comment } = req.body;
  const bug_id = req.params.id;

  if (!comment.trim() || !bug_id) {
    return res.status(400).end();
  }

  const userEmail = req.authUser.email;
  const dbResponse = await db.query(
    "SELECT id FROM users WHERE email = $1::text",
    [userEmail]
  );
  const userId = dbResponse.rows[0].id;

  await db.query(
    "INSERT INTO comments (bug_id, comment, user_id) VALUES ($1, $2, $3)",
    [bug_id, comment, userId]
  );

  return res.status(200).json({
    status: "ok",
  });
}

module.exports = create;
