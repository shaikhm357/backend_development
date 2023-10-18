const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')
const ErrrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder')


// @desc    Get all bootcamps
// @route   GET /api/v1.bootcmaps
// @access  Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {

    const bootcamps = await Bootcamp.find()
    res.status(200).json({
        success: true,
        data: bootcamps,
        count: bootcamps.length
    })
})

// @desc    Get all bootcamps
// @route   GET /api/v1.bootcmaps
// @access  Publice

exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id)

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
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
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