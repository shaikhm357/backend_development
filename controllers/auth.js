
const asyncHandler = require('../middleware/async')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')

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

    const token = user.getSignedJwtToken()

    res.status(200).json({ success: true, data: user, token: token })
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

    const token = user.getSignedJwtToken()

    res.status(200).json({ success: true, token: token })
})