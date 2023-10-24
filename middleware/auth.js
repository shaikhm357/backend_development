const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')

// protect route 
exports.protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Beare')) {
        token = req.headers.authorization.split(' ')[1]
    }
    // else if(req.cookies.token){
    //     token = req.cookies.token
    // }

    // make sure token exist 
    if (!token) {
        return next(new ErrorResponse(`Not authorize to access this route`, 400))
    }

    try {
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded)
        req.user = await User.findById(decoded.id)

        next()

    } catch (err) {
        return next(new ErrorResponse(`Not authorize to access this route`, 400))
    }

})