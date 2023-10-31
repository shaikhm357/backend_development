const asyncHandler = require("../middleware/async")
const Bootcamp = require("../models/Bootcamp")
const Course = require("../models/Course")
const Review = require("../models/Review")
const ErrorResponse = require("../utils/errorResponse")


// @desc   Get Reviews 
// @route  Get /api/v1/reviews
// @route  Get /api/v1/bootcamps/:bootcampId/reviews
// @access Public


exports.getReviews = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId })

        return res.status(200).json({ success: true, count: reviews.length, data: reviews })

    } else {
        res.status(200).json(res.advanceResults)
    }
})

// @desc   Get Review
// @route  Get /api/v1/reviews/:id
// @access Public


exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id)
    if (!review) {
        return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: review })
})

// @desc   Add Review
// @route  Post /api/v1/bootcamps/:id/reviews
// @access Private


exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp of id ${req.params.bootcampId}`, 400))
    }

    // make sure user is the course owner 
    // if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    //     return next(new ErrorResponse(`User ${req.user.id} not authorized to add a course to bootcamp ${bootcamp._id}`, 401))
    // }

    const review = await Review.create(req.body)

    res.status(201).json({ success: true, data: review })
})