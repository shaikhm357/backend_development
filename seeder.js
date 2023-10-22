const fs = require('fs')
const mongoosoe = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

// load models 
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')

// connect DB 
mongoosoe.connect(process.env.MONGO_URI)

// Read json file 
const bootcamp = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))

const importData = async () => {
    try {
        await Bootcamp.create(bootcamp)
        // await Course.create(courses)
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