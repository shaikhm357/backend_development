const asyncHandler = require("../middleware/async")
const Course = require("../models/Course")
const Review = require("../models/Review")
const ErrrorResponse = require("../utils/errorResponse")


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
        return next(new ErrrorResponse(`No review with the id of ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: review })
})