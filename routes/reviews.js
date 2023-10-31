const express = require('express')
const { getReviews, getReview } = require('../controllers/reviews')
const { protect } = require('../middleware/auth')
const advanceResults = require('../middleware/advanceResults')
const Review = require('../models/Review')
const router = express.Router({ mergeParams: true })

router.route('/')
    .get(advanceResults(Review, {
        path: 'bootcamp',
        select: 'name description'
    }), getReviews)

router.route('/:id')
    .get(getReview)

module.exports = router