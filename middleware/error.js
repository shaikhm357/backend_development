const ErrrorResponse = require("../utils/errorResponse")

const errorHandler = (err, req, res, next) => {

    let error = { ...err }
    error.message = err.message

    // log to console for dev 
    console.error(err)

    // mongoose bad ObjectId 
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`
        error = new ErrrorResponse(message, 404)
    }

    if (err.code === 11000) {
        const message = `Duplicate field value entered`
        error = new ErrrorResponse(message, 400)
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error' })
}

module.exports = errorHandler