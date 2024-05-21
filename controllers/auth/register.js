const db = require("../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { firstName, secondName, email, password, token } = req.body;

  if (process.env.ENABLE_CAPTCHA === "true" && !(await verifyCaptcha(token))) {
    return res.json({
      error: "error verifying captcha",
    });
  }

  const expectedUser = await db.query(
    "SELECT * FROM users WHERE email = $1::text",
    [email]
  );

  if (expectedUser.rowCount > 0) {
    return res.status(409).json({
      error: "already exist",
    });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  await db.query(
    `INSERT INTO users (first_name, second_name, email, password_hash) VALUES($1, $2, $3, $4)`,
    [firstName, secondName, email, encryptedPassword]
  );

  const accessToken = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1d",
  });

  return res.status(200).json({
    accessToken,
    firstName,
    secondName,
    email,
  });
}

module.exports = register;
