const db = require("../../db");
const mail = require("../../email");

async function create(req, res) {
  let { title, description, severity, assignedTo } = req.body;

  const timestamp = Date.now();

  const userEmail = req.authUser.email;
  const dbResponse = await db.query(
    "SELECT id FROM users WHERE email = $1::text",
    [userEmail]
  );
  const userId = dbResponse.rows[0].id;

  let assignedToUserid = null;
  if (assignedTo != "-") {
    const dbResponse = await db.query(
      "SELECT id FROM users WHERE email = $1::text",
      [assignedTo]
    );

    assignedToUserid = dbResponse.rows[0]?.id || null;

    if (process.env.ENV_TYPE !== "TEST") {
      if (assignedToUserid) {
        mail.sendMail({
          from: process.env.GMAIL_LOGIN,
          to: assignedTo,
          subject: `[New Bug] ${title}`,
          text:
            "Hi! A new bug has been assigned to you. Description: " +
            description,
        });
      }
    }
  }

  if (!["low", "medium", "high"].includes(severity)) {
    severity = "low";
  }

  if (title.trim() === "") {
    title = "No title";
  }

  await db.query(
    "INSERT INTO bugs (title, description, status, reporter, assigned_to, created, severity) VALUES ($1, $2, $3, $4, $5, to_timestamp($6 / 1000.0), $7)",
    [
      title,
      description,
      "opened",
      userId,
      assignedToUserid,
      timestamp,
      severity,
    ]
  );

  return res.status(200).json({
    status: "ok",
  });
}

module.exports = create;
