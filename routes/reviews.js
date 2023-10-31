const express = require('express')
const { getReviews } = require('../controllers/reviews')
const { protect } = require('../middleware/auth')
const advanceResults = require('../middleware/advanceResults')
const Review = require('../models/Review')
const router = express.Router({ mergeParams: true })

router.route('/')
    .get(advanceResults(Review, {
        path: 'bootcamp',
        select: 'name description'
    }), getReviews)

module.exports = router