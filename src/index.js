const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const { DateTime } = require('luxon')
const fetch = require('node-fetch')
const { Origin, Horoscope } = require('circular-natal-horoscope-js')
// TODO: Add rate limiter: https://www.npmjs.com/package/express-rate-limit

// Planetary calculations
const { getNatalChart, whichSignAndDegree } = require('./helpers/astrologyCalculations')

// PDF
const { generatePDF, writeTempHTML } = require('./helpers/generatePDF')

// Constants
const { fullElementalCode, mapHoroscopeToChart } = require('./helpers/codeFunctions')


// Load environment variables from .env
dotenv.config()

// Create express app
const app = express()
const port = 5000

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/elemental-code', async function (req, res) {

    // Check for body and arguments
    if (!req.body || !req.body.lat || !req.body.lon || !req.body.dateTime) {
        res.send({
            message: "Missing arguments",
            code: 422,
            error: true
        })
        return
    }

    // Parse for arguments
    const lat = req.body.lat
    const lon = req.body.lon

    const dateTimeString = req.body.dateTime
    const dateTime = DateTime.fromISO(dateTimeString)

    // console.log('dateTime: ', dateTime)

    const planetaryPositions = await getNatalChart(dateTime, lat, lon)

    const bodies = Object.keys(planetaryPositions)

    for (let i = 0; i < bodies.length; i++) {  
        const key = bodies[i]
        const position = planetaryPositions[key]

        if (key === 'ascendant') continue

        const { sign, degree } = whichSignAndDegree(position)

        console.log(key, ' (', position, ') is in ', sign, ', degree: ', degree)
    }

    res.sendStatus(200)
})

// TODO: Add email endpoint. The above should return the data in the response (including the chart). 
// The email endpoint should send the data solely via email. Used for the funnel. 


app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 