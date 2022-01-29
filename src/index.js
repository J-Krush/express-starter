const express = require('express')
const bodyParser = require('body-parser')
const { Origin, Horoscope } = require("circular-natal-horoscope-js")

// Create express app
const app = express()
const port = 5000

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/elemental-code', async function (req, res) {
    console.log('elemental code endpoint: ', req.body)

    const origin = new Origin({
        year: 1989,
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

    console.log(horoscope.CelestialBodies)
    
    res.sendStatus(200)
})


app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 