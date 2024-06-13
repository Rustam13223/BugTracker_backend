const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth");

const create = require("../../controllers/bugs/create");
const get = require("../../controllers/bugs/get");
const update = require("../../controllers/bugs/update");

const commentsRoute = require("../comments");

router.get("/", auth, get);
router.get("/:id", auth, get);
router.post("/create", auth, create);
router.patch("/:id", auth, update);

router.use("/:id/comments", commentsRoute);

module.exports = router;
