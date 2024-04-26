const express = require('express')
const router = express.Router()

const auth = require('../../middlewares/auth')

const get = require('../../controllers/users/get')

router.get('/', auth, get)

module.exports = router