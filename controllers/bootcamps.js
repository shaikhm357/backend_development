
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

exports.createBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: "Create New Bootcamp" })
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
