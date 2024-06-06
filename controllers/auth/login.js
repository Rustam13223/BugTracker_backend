const db = require("../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const verifyCaptcha = require("./verifyCaptcha");

async function login(req, res) {
  const { email, password, token } = req.body;

  if (process.env.ENABLE_CAPTCHA === "true" && !(await verifyCaptcha(token))) {
    return res.json({
      error: "error verifying captcha",
    });
  }

  let expectedUser = await db.query(
    "SELECT * FROM users WHERE email = $1::text",
    [email]
  );

  if (expectedUser.rowCount < 1) {
    return res.status(400).json({
      error: "Incorrect data",
    });
  }

  expectedUser = expectedUser.rows[0];

  const passwordMatch = await bcrypt.compare(
    password,
    expectedUser.password_hash
  );

  if (!passwordMatch) {
    return res.status(400).json({
      error: "Incorrect data",
    });
  }

  const accessToken = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1d",
  });

  return res.status(200).json({
    accessToken,
    firstName: expectedUser.first_name,
    secondName: expectedUser.second_name,
    email,
    role: expectedUser.role,
  });
}

module.exports = login;
