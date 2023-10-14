const express = require('express')
const dotenv = require('dotenv')

const bootcamp = require('./routes/bootcamps')

dotenv.config({ path: './config/config.env' })

const app = express()

// mount routers
app.use('/api/v1/bootcamp', bootcamp)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))