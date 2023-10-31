const asyncHandler = require("../middleware/async")
const Course = require("../models/Course")
const Review = require("../models/Review")


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