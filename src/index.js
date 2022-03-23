const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const { DateTime } = require('luxon')
const fetch = require('node-fetch')
const { Origin, Horoscope } = require('circular-natal-horoscope-js')
// TODO: Add rate limiter: https://www.npmjs.com/package/express-rate-limit

// Planetary calculations
const { getNatalChart, requestNasaData, getSiderealTimeDegrees, getAscendantDegrees, getEclipcticLongitude } = require('./helpers/astrologyCalculations')

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

    await getNatalChart(dateTime, lat, lon)

    res.sendStatus(200)
})

app.post('/chart', async function (req, res) {

    console.log('chart endpoint: ', req.body)

    const year = 1975

    const origin = new Origin({
        year,
        month: 6, // 0 = January, 11 = December!
        date: 31,
        hour: 12,
        minute: 00,
        latitude: 40.730610,
        longitude: -73.935242,
    })

    const horoscope = new Horoscope({
        origin: origin,
        houseSystem: "topocentric",
        zodiac: "sidereal", 
        aspectPoints: ['bodies', 'points', 'angles'],
        aspectWithPoints: ['bodies', 'points', 'angles'],
        aspectTypes: ["major", "minor"],
        customOrbs: {},
        language: 'en'
    })

    fullElementalCode(origin.year, horoscope)

    const cleanedData = mapHoroscopeToChart(horoscope)

    // Write the html file to render
    await writeTempHTML()

    const pdf = await generatePDF()

    res.sendStatus(200)
})

app.post('/mtz', async function (req, res) {
    console.log('mtz endpoint')

    const lat = 40.730610
    const lon = -73.935242

    const localHour = 12
    const minute = 00

    const utcHour = localHour + 4

    const nasaData = await requestNasaData(1989, 6, 29, utcHour, minute, lat, lon)
    const siderealTimeDegrees = getSiderealTimeDegrees(nasaData, utcHour, minute)
    const ecLon = getEclipcticLongitude(nasaData, utcHour, minute)
    const ascendant = getAscendantDegrees(siderealTimeDegrees, lat)

    res.sendStatus(200)
})

// TODO: Add email endpoint. The above should return the data in the response (including the chart). 
// The email endpoint should send the data solely via email. Used for the funnel. 


app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 