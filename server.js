const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')

const bootcamp = require('./routes/bootcamps')

dotenv.config({ path: './config/config.env' })

const app = express()

// dev logging middleware
if (process.env.NODE_ENV == "development") {
    app.use(morgan('dev'))
}

// mount routers
app.use('/api/v1/bootcamp', bootcamp)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))