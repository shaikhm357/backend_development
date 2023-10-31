const fs = require('fs')
const mongoosoe = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

// load models 
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')
const User = require('./models/User')
const Review = require('./models/Review')

// connect DB 
mongoosoe.connect(process.env.MONGO_URI)

// Read json file 
const bootcamp = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))
const user = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))
const review = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'))

const importData = async () => {
    try {
        await Bootcamp.create(bootcamp)
        await Course.create(courses)
        await User.create(user)
        await Review.create(review)
        console.error(`data imported...`.green.inverse)
        process.exit(1)
    } catch (err) {
        console.log(err)
    }
}

// Delete data 
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log(`Data destroyed...`.red.inverse)
        process.exit(1)
    } catch (err) {
        console.error(err)
    }
}

if (process.argv[2] === '-i') {
    importData()

} else if (process.argv[2] === '-d') {
    deleteData()
}