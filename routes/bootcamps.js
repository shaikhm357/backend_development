const express = require('express')
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps.js')

// include other resource routes 
const courseRouter = require('./courses.js')
const reviewRoutet = require('./reviews.js')
const advanceResults = require('../middleware/advanceResults.js')
const Bootcamp = require('../models/Bootcamp.js')

const router = express.Router()
const { protect, authorize } = require('../middleware/auth.js')

// re-route into other resource routes
router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewRoutet)

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampInRadius)

router
    .route('/')
    .get(advanceResults(Bootcamp, 'courses user'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp)

router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)

router
    .route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload)

module.exports = router