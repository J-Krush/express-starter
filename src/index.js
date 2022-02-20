const express = require('express')
const bodyParser = require('body-parser')
const { Origin, Horoscope } = require('circular-natal-horoscope-js')
// const astrology = require('./helpers/astrochart')
// TODO: Add rate limiter: https://www.npmjs.com/package/express-rate-limit

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

    // var page = require('webpage').create();
    // page.open('http://github.com/', function() {
    //     page.render('github.png');
    //     phantom.exit();
    // });

    // res.sendFile(page)

    // var radix = new astrology.Chart('paper', 600, 600).radix( horoscope );

    const { document } = new JSDOM(`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Radix</title>  
            <style>
                #paper{
                    background:#999;
                }
            </style>                   
        </head>
        <body>    	    
            <div id="paper"></div>
                                        
            <script src="helpers/astrochart.min.js"></script>
            <script src="html2canvas.js"></script>
            <script type="text/javascript"> 
            
                var data = {
                    "planets":{"Lilith":[18], "Chiron":[18], "Pluto":[63], "Neptune":[110, 0.2], "Uranus":[318], "Saturn":[201, -0.2], "Jupiter":[192], "Mars":[210], "Moon":[268], "Sun":[281], "Mercury":[312], "Venus":[330], "NNode":[2]},
                    "cusps":[296, 350, 30, 56, 75, 94, 116, 170, 210, 236, 255, 274]			
                };
                                                        
                window.onload = function () {            	     
                    var radix = new astrology.Chart('paper', 600, 600).radix( data );
                                    
                    // Aspect calculation
                    // default is planet to planet, but it is possible add some important points:				
                    radix.addPointsOfInterest( {"As":[data.cusps[0]],"Ic":[data.cusps[3]],"Ds":[data.cusps[6]],"Mc":[data.cusps[9]]});				
                    radix.aspects();
                    
                    // window.scrollTo(0, 0);
 
                    // Convert the div to image (canvas)
                    html2canvas(document.getElementById("paper")).then(function (canvas) {
                
                        // Get the image data as JPEG and 0.9 quality (0.0 - 1.0)
                        console.log(canvas.toDataURL("image/jpeg", 0.9));
                    });
                };
            </script>		    
        </body>
    </html>
    `, { runScripts: "dangerously", resources: "usable" }).window

    

    console.log(document)

    

    // res.sendFile(window.document.body)

    res.sendStatus(200)
})

// TODO: Add email endpoint. The above should return the data in the response (including the chart). 
// The email endpoint should send the data solely via email. Used for the funnel. 


app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
}); 