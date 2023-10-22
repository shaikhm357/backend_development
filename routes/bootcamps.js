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

const router = express.Router()

// re-route into other resource routes
router.use('/:bootcampId/courses', courseRouter)

router
    .route('/radius/:zipcode/:distance')
    .get(getBootcampInRadius)

router
    .route('/')
    .get(getBootcamps)
    .post(createBootcamp)

router
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)

router
    .route('/:id/photo')
    .put(bootcampPhotoUpload)

module.exports = router