const express = require('express')
const { createUser, getUsers, getUser, updateUser, deleteUser } = require('../controllers/users')
const advanceResults = require('../middleware/advanceResults')
const User = require('../models/User')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

router.use(protect)
router.use(authorize('admin'))

router.route('/')
    .get(advanceResults(User), getUsers)
    .post(createUser)

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

module.exports = router