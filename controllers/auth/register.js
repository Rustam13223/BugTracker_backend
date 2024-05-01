const db = require("../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

async function register(req, res) {
  const { firstName, secondName, email, password, token } = req.body;

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.reCAPTCHA_SECRET_KEY}&response=${token}`
    );

    if (!response.data.success) {
      return res.status(500).json({
        error: "captcha ignored",
      });
    }
  } catch (error) {
    return res.status(500).send("Error verifying reCAPTCHA");
  }

  const expectedUser = await db.query(
    "SELECT * FROM users WHERE email = $1::text",
    [email]
  );

  if (expectedUser.rowCount > 0) {
    return res.json({
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
