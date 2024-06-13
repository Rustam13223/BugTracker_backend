const db = require("../../db");

async function update(bugId) {
  const dbResponse = await db.query(
    "SELECT assigned_to FROM bugs WHERE id = $1",
    [bugId]
  );

  const { assigned_to } = dbResponse.rows[0];

  if (assigned_to) {
    await db.query(
      `INSERT INTO stats AS st VALUES ($1, 1)
         ON CONFLICT (user_id) DO UPDATE 
          SET solved_bugs = st.solved_bugs + 1;`,
      [assigned_to]
    );
  }
}

module.exports = update;
