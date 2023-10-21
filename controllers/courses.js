
const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')

// @desc   Get courses 
// @route  Get /api/v1/courses
// @route  Get /api/v1/bootcamps/:bootcampId/courses
// @access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
    let query

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId })
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        })
    }

    const courses = await query

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
})

// @desc   Get course
// @route  Get /api/v1/courses/:id
// @access Public

exports.getCourse = asyncHandler(async (req, res, nex) => {
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