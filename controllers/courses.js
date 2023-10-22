
const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')

// @desc   Get courses 
// @route  Get /api/v1/courses
// @route  Get /api/v1/bootcamps/:bootcampId/courses
// @access Public

exports.getCourses = asyncHandler(async (req, res, next) => {


    if (req.params.bootcampId) {

        const courses = await Course.find({ bootcamp: req.params.bootcampId })

        res.status(200).json({ success: true, count: courses.length, data: courses })

    } else {
        res.status(200).json(res.advanceResults)
    }
})

// @desc   Get course
// @route  Get /api/v1/courses/:id
// @access Public

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 400))
    }

    res.status(200).json({
        success: true,
        data: course
    })
})

// @desc   add course
// @route  POST /api/v1/bootcamps/:bootcampId/courses
// @access Private

exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp of id ${req.params.bootcampId}`, 400))
    }

    // create course 
    const course = await Course.create(req.body)

    res.status(201).json({ success: true, data: course })
})

// @desc   Update course
// @route  PUT /api/v1/courses/:id
// @access Private

exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id)
    if (!course) {
        return next(new ErrorResponse(`No course of id ${req.params.bootcampId}`, 400))
    }
    // create course 
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(201).json({ success: true, data: course })
})

// @desc   Delete course
// @route  DELETE /api/v1/courses/:id
// @access Private

exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id)
    if (!course) {
        return next(new ErrorResponse(`No course of id ${req.params.bootcampId}`, 400))
    }
    // delete course 
    await course.deleteOne({ _id: req.params.id })

    res.status(201).json({ success: true, data: {} })
})