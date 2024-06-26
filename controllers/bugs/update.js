const db = require("../../db");
const updateStats = require("../stats/update");
const mail = require("../../email");

async function update(req, res) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).end();
  }

  try {
    const { title, description, status, assigned_to, severity } = req.body;

    if (title?.trim()) {
      await db.query("UPDATE bugs SET title = $1::text WHERE id = $2", [
        title,
        id,
      ]);
    }
    if (description?.trim()) {
      await db.query("UPDATE bugs SET description = $1::text WHERE id = $2", [
        description,
        id,
      ]);
    }
    if (status) {
      await db.query("UPDATE bugs SET status = $1::bug_status WHERE id = $2", [
        status,
        id,
      ]);
    }
    if (assigned_to) {
      await db.query("UPDATE bugs SET assigned_to = $1 WHERE id = $2", [
        assigned_to,
        id,
      ]);

      if (process.env.ENV_TYPE !== "TEST") {
        const dbResponse = await db.query(
          "SELECT email FROM users WHERE id = $1",
          [assigned_to]
        );

        const assignedToMail = dbResponse.rows[0]?.email;

        mail.sendMail({
          from: process.env.GMAIL_LOGIN,
          to: assignedToMail,
          subject: `[New Bug] #${id}`,
          text: "Hi! A new bug has been assigned to you.",
        });
      }
    }
    if (severity) {
      await db.query("UPDATE bugs SET severity = $1::severity WHERE id = $2", [
        severity,
        id,
      ]);
    }

    if (status === "done") {
      await updateStats(id);
    }

    return res.status(200).json({
      status: "ok",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: "internal server error",
    });
  }
}

module.exports = update;
