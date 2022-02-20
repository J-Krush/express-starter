const express = require('express')
const bodyParser = require('body-parser')
const { Origin, Horoscope } = require('circular-natal-horoscope-js')
// TODO: Add rate limiter: https://www.npmjs.com/package/express-rate-limit

// PDF
const { generatePDF } = require('./helpers/generatePDF')

// Constants
const { signElement } = require('./constants/astrologicalConstants')
const { dagaraElement } = require('./helpers/codeFunctions')

// Create express app
const app = express()
const port = 5000

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const jsdom = require('jsdom')
const { JSDOM } = jsdom

app.post('/elemental-code', async function (req, res) {
    console.log('elemental code endpoint: ', req.body)

    const year = 1989

    const origin = new Origin({
        year,
        month: 5, // 0 = January, 11 = December!
        date: 29,
        hour: 14,
        minute: 32,
        latitude: 45.7833,
        longitude: -108.5007,
    })

    const horoscope = new Horoscope({
        origin: origin,
        houseSystem: "whole-sign",
        zodiac: "sidereal",
        aspectPoints: ['bodies', 'points', 'angles'],
        aspectWithPoints: ['bodies', 'points', 'angles'],
        aspectTypes: ["major", "minor"],
        customOrbs: {},
        language: 'en'
    })

    console.log('1 (Indigenious): ', dagaraElement(year))

    console.log('2 (): ', signElement[horoscope.SunSign.key], ' (', horoscope.SunSign.key, ')')

    console.log('3: ', signElement[horoscope.CelestialPoints.northnode.Sign.key], ' (', horoscope.CelestialPoints.northnode.Sign.key, ')')

    // TODO 4: 


    console.log('5: ', signElement[horoscope.CelestialPoints.southnode.Sign.key], ' (', horoscope.CelestialPoints.southnode.Sign.key, ')')
    
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
        houseSystem: "whole-sign",
        zodiac: "sidereal",
        aspectPoints: ['bodies', 'points', 'angles'],
        aspectWithPoints: ['bodies', 'points', 'angles'],
        aspectTypes: ["major", "minor"],
        customOrbs: {},
        language: 'en'
    })

    // console.log('celestial bodies: ', horoscope.CelestialBodies.all)

    horoscope.CelestialBodies.all.forEach(item => {
        console.log(item.key, ': ', item.ChartPosition.Ecliptic.DecimalDegrees)
    })



    // for (body in horoscope.CelestialBodies.all) {
    //     console.log(body)
    // }
    // console.log(horoscope.CelestialBodies.all.ChartPosition)

    // console.log(horoscope.Angles)

    const pdf = await generatePDF()

    console.log('pdf: ', pdf)

    // res.send(pdf)

    res.sendStatus(200)
})

// TODO: Add email endpoint. The above should return the data in the response (including the chart). 
// The email endpoint should send the data solely via email. Used for the funnel. 


app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 