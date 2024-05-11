const db = require("../../db");

async function updateRole(req, res) {
  try {
    const userId = req.params.id;
    const newRole = req.body.role;

    const dbResponse = await db.query("SELECT role FROM users WHERE id = $1;", [
      userId,
    ]);

    if (dbResponse.rowCount === 0) {
      return res.status(404).end();
    }

    if (dbResponse.rows[0].role === "admin") {
      return res.json({
        error: "cant change admin's role",
      });
    }

    await db.query("UPDATE users SET role = $1::users_role WHERE id = $2", [
      newRole,
      userId,
    ]);

    return res.status(200).json({
      status: "ok",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "internal server error",
    });
  }
}

module.exports = updateRole;
