const express = require('express')
const { registerUser, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, logout } = require('../controllers/auth')
const router = express.Router()
const { protect } = require('../middleware/auth')

router
    .route('/register')
    .post(registerUser)

router
    .route('/login')
    .post(login)

router.get('/logout', logout)

router.get('/me', protect, getMe)
router.put('/updatedetails', protect, updateDetails)
router.put('/updatepassword', protect, updatePassword)
router.post('/forgotPassword', forgotPassword)
router.put('/resetPassword/:resetToken', resetPassword)

module.exports = router