const express = require('express')
const { registerUser, login, getMe, forgotPassword } = require('../controllers/auth')
const router = express.Router()
const {protect} = require('../middleware/auth')

router
    .route('/register')
    .post(registerUser)

router
    .route('/login')
    .post(login)

router.get('/me', protect, getMe)
router.post('/forgotPassword', forgotPassword)

module.exports = router