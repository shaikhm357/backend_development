const crypto = require('crypto')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require('../utils/sendEmail')

// @dec        Register user
// @route      Post /api/v1/auth/register
// @access     Public

exports.registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body

    // create user 
    const user = await User.create({
        name,
        password,
        email,
        role
    })

    sentTokenResponse(user, 200, res)
})

// @dec        Login user
// @route      Post /api/v1/auth/login
// @access     Public

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    // validate email password
    if (!email || !password) {
        return next(new ErrorResponse(`Please provide an email and password`, 400))
    }

    // check for user 
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorResponse(`Invalid credentials`, 401))
    }

    // check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
        return next(new ErrorResponse(`Invalid credentials`, 401))
    }

    sentTokenResponse(user, 200, res)
})

// @dec        Get current loged in user
// @route      Post /api/v1/auth/me
// @access     Private

exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id)

    res.status(200).json({ success: true, data: user })
})

// @dec        Forgot Password
// @route      Post /api/v1/auth/forgotPassword
// @access     Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorResponse(`There is no user with that email`, 404))
    }

    const resetToken = await user.getResetPasswordToken()
    // console.log(resetToken)

    user.save({ validateBeforeSave: false })

    // create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`

    const message = `You are receiving this email because you has requested the reset of a password. 
    Please make a PUT request to: \n\n ${resetUrl}`

    try {
        await sendEmail({ email: user.email, subject: 'Password reset token', message })
        return res.status(200).json({ success: true, data: 'Email sent' })
    } catch (err) {
        console.log(err)
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })

        return next(new ErrorResponse(`Email could not be sent`, 500))
    }
})

// @dec        Reset Password
// @route      PUT /api/v1/auth/resetPassword/:restToken
// @access     Public

exports.resetPassword = asyncHandler(async (req, res, next) => {

    // Get hased token 
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex')
    console.log(resetPasswordToken)

    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })

    if (!user) {
        return next(new ErrorResponse(`Invalid Token ${req.params.resetToken}`, 400))
    }

    user.password = req.body.password
    user.resetPasswordExpire = undefined
    user.resetPasswordToken = undefined

    // update in db
    user.save()

    sentTokenResponse(user, 200, res)
})

// Get token from model, create cookie and send response 

const sentTokenResponse = (user, statusCode, res) => {
    // create token 
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({ success: true, token })
}