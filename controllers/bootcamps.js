const Bootcamp = require('../models/Bootcamp')


// @desc    Get all bootcamps
// @route   GET /api/v1.bootcmaps
// @access  Public

exports.getBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: "Show All Bootcamp" })
}

// @desc    Get all bootcamps
// @route   GET /api/v1.bootcmaps
// @access  Publice

exports.getBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Show Bootcamp ${req.params.id}` })
}

// @desc    Create new bootcamps
// @route   POST /api/v1.bootcmaps/:id
// @access  Public

exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body)
        res.status(201).json({ success: true, data: bootcamp })
    } catch (err) {
        res.status(400).json({ success: false })
    }
}

// @desc    Update bootcamp
// @route   PUT /api/v1.bootcmaps/:id
// @access  Public

exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Update Bootcamp ${req.params.id}` })
}
// @desc    Get bootcamp
// @route   DELETE /api/v1.bootcmaps/:id
// @access  Publice

exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Delete Bootcamp ${req.params.id}` })

}
