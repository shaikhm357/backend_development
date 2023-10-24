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
const advanceResults = require('../middleware/advanceResults.js')
const Bootcamp = require('../models/Bootcamp.js')

const router = express.Router()
const { protect } = require('../middleware/auth.js')

// re-route into other resource routes
router.use('/:bootcampId/courses', courseRouter)

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampInRadius)

router
    .route('/')
    .get(advanceResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, createBootcamp)

router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, updateBootcamp)
    .delete(protect, deleteBootcamp)

router
    .route('/:id/photo')
    .put(protect, bootcampPhotoUpload)

module.exports = router