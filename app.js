const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

const mail = require("./email");

app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

const authRoute = require("./routes/auth");
const bugsRoute = require("./routes/bugs");
const usersRoute = require("./routes/users");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use("/bugs", bugsRoute);
app.use("/users", usersRoute);

module.exports = app;
