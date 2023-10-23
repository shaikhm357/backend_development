
const asyncHandler = require('../middleware/async')
const User = require('../models/User')
// @dec        Register user
// @route      GET /api/v1/auth/register
// @access     Public

exports.registerUser = asyncHandler(async (req, res, next) => {
    res.status(200).json({ success: true })
})