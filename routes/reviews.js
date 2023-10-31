const express = require('express')
const { getReviews, getReview, addReview } = require('../controllers/reviews')
const { protect, authorize } = require('../middleware/auth')
const advanceResults = require('../middleware/advanceResults')
const Review = require('../models/Review')
const router = express.Router({ mergeParams: true })

router.route('/')
    .get(advanceResults(Review, {
        path: 'bootcamp',
        select: 'name description'
    }), getReviews)
    .post(protect, authorize('user', 'admin'), addReview)

router.route('/:id')
    .get(getReview)

module.exports = router