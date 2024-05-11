const db = require("../db");

async function adminOnly(req, res, next) {
  try {
    const email = req.authUser.email;

    const dbResponse = await db.query(
      "SELECT role FROM users WHERE email = $1::text",
      [email]
    );

    if (dbResponse.rowCount === 0) {
      return res.status(404).json({
        error: "not found",
      });
    }

    if (dbResponse.rows[0].role === "admin") {
      next();
    } else {
      return res.json({
        error: "requires permitions",
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).end();
  }
}

module.exports = adminOnly;
