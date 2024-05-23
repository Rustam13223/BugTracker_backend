const express = require("express");
const router = express.Router({ mergeParams: true });

const auth = require("../../middlewares/auth");

const get = require("../../controllers/comments/get");
const create = require("../../controllers/comments/create");

router.get("/", auth, get);
router.post("/create", auth, create);

module.exports = router;
