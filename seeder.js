const fs = require('fs')
const mongoosoe = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

// load models 
const Bootcamp = require('./models/Bootcamp')

// connect DB 
mongoosoe.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

// Read json file 
const bootcamp = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))

const importData = async () => {
    try {
        await Bootcamp.create(bootcamp)
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