const express = require('express')
const router = express.Router()

const auth = require('../../middlewares/auth')

const create = require('../../controllers/bugs/create')
const get = require('../../controllers/bugs/get')

router.get('/', auth, get)
router.get('/:id', auth, get)
router.post('/create', auth, create)

module.exports = router