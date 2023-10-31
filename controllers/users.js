const User = require('../models/User')
const asyncHandler = require('../middleware/async')

// @dec        Get all users
// @route      Post /api/v1/auth/users
// @access     private/Admin


exports.getUsers = asyncHandler(async (req, res, next) => {
    // const users = await User.find()
    res.status(200).json(res.advanceResults)
})

// @dec        Get single user
// @route      Post /api/v1/auth/users/:id
// @access     private/Admin


exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    res.status(200).json({ success: true, data: user })
})

// @dec        Create  user
// @route      Post /api/v1/auth/users
// @access     private/Admin


exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body)

    res.status(201).json({ success: true, data: user })
})

// @dec        Update  user
// @route      Post /api/v1/auth/users/:id
// @access     private/Admin


exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({ success: true, data: user })
})

// @dec        Delete  user
// @route      Post /api/v1/auth/users/:id
// @access     private/Admin


exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({ success: true, data: {} })
})