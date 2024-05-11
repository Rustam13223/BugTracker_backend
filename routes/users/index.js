const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth");
const adminOnly = require("../../middlewares/adminOnly");

const get = require("../../controllers/users/get");
const updateRole = require("../../controllers/users/updateRole");

router.get("/", auth, get);
router.patch("/:id", auth, adminOnly, updateRole);

module.exports = router;
