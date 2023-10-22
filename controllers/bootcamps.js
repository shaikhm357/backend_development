const path = require('path')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')
const ErrrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder')


// @desc    Get all bootcamps
// @route   GET /api/v1.bootcmaps
// @access  Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {

    let query

    // Copy req.query 
    const reqQuery = { ...req.query }

    // field to exclude 
    const removeField = ['select', 'sort', 'page', 'limit']
    removeField.forEach(param => delete reqQuery[param])

    let queryStr = JSON.stringify(reqQuery)

    // create operator ($gt, $gte etc) 
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    // finding resource 
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses')

    // select field 
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
        console.log(fields)
    }

    // sort 
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    // pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Bootcamp.countDocuments()

    // execute query
    query = query.skip(startIndex).limit(limit)

    // pagination result 
    const pagination = {}
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    const bootcamps = await query

    res.status(200).json({
        success: true,
        pagination,
        count: bootcamps.length,
        data: bootcamps,
    })
})

// @desc    Get all bootcamps
// @route   GET /api/v1.bootcmaps
// @access  Publice

exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id).populate({
        path: 'courses',
        select: 'title description tuition'
    })

    if (!bootcamp) {
        return next(new ErrrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    })
})

// @desc    Create new bootcamps
// @route   POST /api/v1.bootcmaps/:id
// @access  Public

exports.createBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({ success: true, data: bootcamp })
})

// @desc    Update bootcamp
// @route   PUT /api/v1.bootcmaps/:id
// @access  Public

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!bootcamp) {
        return res.status(400).json({ success: false })
    }

    res.status(200).json({ success: true, data: bootcamp })
})

// @desc    Delete bootcamp
// @route   DELETE /api/v1.bootcmaps/:id
// @access  Publice

exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.deleteOne({ _id: req.params.id })
        if (!bootcamp) {
            return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: bootcamp })
    } catch (err) {
        next(err)
    }
}

// @desc    Get bootcamp with in radius
// @route   GET /api/v1.bootcmaps/radius/:zipcode/:distance
// @access  Publice

exports.getBootcampInRadius = async (req, res, next) => {
    try {
        const { zipcode, distance } = req.params

        // get lat and lng form geocoder
        const loc = await geocoder.geocode(zipcode)
        const lat = loc[0].latitude
        const lng = loc[0].longitude
        console.log(lat, lng)
        // calc radius using radians
        // devide dist by radius of earth
        // Earth radius = 3,963 mi / 6378 km 
        const radius = distance / 3963

        const bootcamps = await Bootcamp.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[lng, lat], radius]
                }
            }
        });

        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps })

    } catch (err) {
        next(err)
    }
}

// @desc    Upload photo for bootcamp
// @route   PUT /api/v1/bootcmaps/:id/photo
// @access  private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
        return next(new ErrrorResponse(`Bootcamp not found with the id of ${req.param.id}`, 404))
    }

    if (!req.files) {
        return next(new ErrrorResponse(`Please upload a file`, 400))
    }
    const file = req.files.file

    // make sure img is photo 
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrrorResponse(`Please upload an image file`, 400))
    }

    // check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`))
    }

    // create custom file name 
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

    // upload the file 
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.error(err)
            return next(new ErrrorResponse(`Problem with file upload`, 500))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })

        res.status(200).json({
            success: true,
            data: file.name
        })
    })
})