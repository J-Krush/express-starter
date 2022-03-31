const fetch = require('node-fetch')
const { requestPromise } = require('../helpers/network')
const { celestialBodies, zodiacSigns } = require('../constants/astrologicalConstants')
const { checkForDegreeOverflow, getTwoDecimalNumber } = require('./utilities')

// Constants 
// Sound info found here: https://en.wikipedia.org/wiki/Ascendant
const earthInclination = 23.4392911 // deg
const trueSiderealOffset = 31.5 // deg
const cuspThreshold = 0.10 // 10%

// Horizons API 
const nasaUrl = 'https://ssd.jpl.nasa.gov/api/horizons.api?format=json'


const getTimeZone = async (dateTime, lat, lon) => {
    // Setting up timezone API: https://developers.google.com/maps/documentation/timezone/get-api-key

    var url = 'https://maps.googleapis.com/maps/api/timezone/json?'
    const args = `location=${lat}%2C${lon}&timestamp=${dateTime.toSeconds()}&key=${process.env.GCP_API_KEY}`
    url = url + args

    const response = await fetch(url)
    const data = await response.json()

    const timeZoneOffset = Math.floor((data.dstOffset + data.rawOffset) / 3600)

    return timeZoneOffset
}

const getNatalChart = async (dateTime, lat, lon) => {

    const year = dateTime.year
    const month = dateTime.month
    const day = dateTime.day
    const hour = dateTime.hour
    const minute = dateTime.minute

    const timeZoneOffset = await getTimeZone(dateTime, lat, lon)

    console.log('time zone offset: ', timeZoneOffset)

    const utcHour = hour - timeZoneOffset

    console.log('utcHour: ', utcHour)

    // Request data from nasa horizons API
    const planetaryPositions = await getPlanetaryData(year, month, day, utcHour, minute, lat, lon)
    const lunarNode = await getLunarNodeData(year, month, day, utcHour, minute, lat, lon)
    const northNode = lunarNode

    // console.log('planetaryPositions: ', planetaryPositions)
    // console.log('northNode: ', northNode)

    // console.log('cleanedData: ', cleanedData)

    return {
        ...planetaryPositions,
        northNode,
        southNode: northNode + 180
    }

}


const getPlanetaryData = async (year, month, day, hour, minute, lat, lon) => {
    // Gets the chart angle for each planet (measure from the left, clockwise)
    console.log('get planetary data')

    const args = "&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='coord@399'&COORD_TYPE='GEODETIC'&STEP_SIZE='1 MINUTES'&QUANTITIES='7,31'&REF_SYSTEM='ICRF'&CAL_FORMAT='CAL'&APPARENT='AIRLESS'&SKIP_DAYLT='NO'"
    const coordinates = `&SITE_COORD='${lon},${lat},0'`
    const startTime = `&START_TIME='${year}-${getDoubleDigitNumber(month)}-${getDoubleDigitNumber(day)} ${getDoubleDigitNumber(hour)}:${getDoubleDigitNumber(minute)}'`
    const stopTime = `&STOP_TIME='${year}-${getDoubleDigitNumber(month)}-${getDoubleDigitNumber(day)} ${getDoubleDigitNumber(hour)}:${getDoubleDigitNumber(minute + 1)}'`

    // Loop through all bodies
    const bodies = Object.keys(celestialBodies)
    var positions = {}

    for (let i = 0; i < bodies.length; i++) {  
        const key = bodies[i]
        const body = celestialBodies[key]

        if (typeof body.code !== "number" || body.title === 'Earth') continue

        // TODO: Comment this out for full planets. Elemental code only needs sun sign.
        if (body.title !== 'Sun') continue

        // console.log(`${key}: ${body.code}`)
        const command = `&COMMAND='${body.code}'`

        const arguments = args + command + coordinates + startTime + stopTime

        try {
            const response = await requestPromise(nasaUrl + arguments)
            // console.log('response: ', response)

            if (i === 0) { 
                // If the first iteration, calculate the ascendant
                const ascendant = getAscendantDegrees(response, hour, minute, lat)
                positions.ascendant = ascendant
            }

            const ecLon = parseForEclipticLongitude(response, hour, minute)

            // Corrects for ascendant rotation and true sidereal offset
            positions[key] = ecLon - trueSiderealOffset// positions.ascendant + trueSiderealOffset - ecLon
            
            // console.log("response for body ", body.title, '****************', response, ' ****************');
        } catch (error) {
            console.log("error for body ", body.title, ' ****************', error, ' ****************');
        }
        
    }

    return positions
}

const getLunarNodeData = async (year, month, day, hour, minute, lat, lon) => {
    // Gets ecliptic longitude of ascending node

    const args = "&MAKE_EPHEM='YES'&COMMAND='301'&EPHEM_TYPE='ELEMENTS'&CENTER='500@399'"
    const coordinates = `&SITE_COORD='${lon},${lat},0'`
    const startTime = `&START_TIME='${year}-${getDoubleDigitNumber(month)}-${getDoubleDigitNumber(day)} ${getDoubleDigitNumber(hour)}:${getDoubleDigitNumber(minute)}'`
    const stopTime = `&STOP_TIME='${year}-${getDoubleDigitNumber(month)}-${getDoubleDigitNumber(day)} ${getDoubleDigitNumber(hour)}:${getDoubleDigitNumber(minute + 1)}'`
    const otherArgs = "&STEP_SIZE='1 MINUTES'&REF_SYSTEM='ICRF'&REF_PLANE='ECLIPTIC'&OUT_UNITS='KM-S'&ELM_LABELS='YES'&TP_TYPE='ABSOLUTE'&CSV_FORMAT='NO'&OBJ_DATA='YES'"

    const arguments = args + coordinates + startTime + stopTime + otherArgs

    const response = await fetch(nasaUrl + arguments)
    const data = await response.json()

    const ascendingNode = parseForAscendingNode(data.result) - trueSiderealOffset
    
    return ascendingNode
}

const getAscendantDegrees = (nasaBody, hour, minute, lat) => {
    // Uses ecliptic geocentric longitude calculation defined here:
    // https://en.wikipedia.org/wiki/Ascendant#Calculation

    // console.log('nasabody: ', nasaBody)

    // console.log('string to search: ', `${getDoubleDigitNumber(hour)}:${getDoubleDigitNumber(minute)} *`)
    const index = nasaBody.indexOf(`${getDoubleDigitNumber(hour)}:${getDoubleDigitNumber(minute)} *`)

    // console.log('index: ', index)

    // Getting local sidereal time from nasa api
    let siderealTime = nasaBody.substring(index + 10, index + 18)

    // console.log('siderealTime: ', siderealTime)

    const siderealHour = (Number(siderealTime.substring(0, 2)) / 24) * 360
    const siderealMinute = (Number(siderealTime.substring(3, 5)) / 60) * 15
    const siderealSecond = (Number(siderealTime.substring(6, 8)) / 60) * 0.15

    // console.log('siderealHour: ', siderealHour)
    // console.log('siderealMinute: ', siderealMinute)
    // console.log('siderealSecond: ', siderealSecond)

    const siderealTimeDegrees = siderealHour + siderealMinute + siderealSecond

    // console.log('siderealTimeDegrees: ', siderealTimeDegrees)

    const siderealTimeRadians = siderealTimeDegrees * (Math.PI / 180)

    // Converting input degrees to radians for javascript
    const earthInclinationRadians = earthInclination * (Math.PI / 180);
    const latRadians = lat * (Math.PI / 180);

    // Ascendant equation = arctan(y/xz1 + xz2)
    const y = -Math.cos(siderealTimeRadians)
    const x1 = Math.sin(siderealTimeRadians) * Math.cos(earthInclinationRadians)
    const x2 = Math.tan(latRadians) * Math.sin(earthInclinationRadians)
    const x = x1 + x2

    const ascendantRadians = Math.atan(y / x)

    var ascendantDegrees = ascendantRadians * (180 / Math.PI )

    // Ascendant quadrant rules
    if (x < 0) {
        ascendantDegrees = ascendantDegrees + 180
    } else {
        ascendantDegrees = ascendantDegrees + 360
    }

    if (ascendantDegrees < 180) {
        ascendantDegrees = ascendantDegrees + 180
    } else {
        ascendantDegrees = ascendantDegrees - 180
    }

    // Converting to true sidereal zodiac
    ascendantDegrees = ascendantDegrees - trueSiderealOffset

    return ascendantDegrees
}

const parseForEclipticLongitude = (nasaBody, hour, minute) => {
    // console.log('string to find: ', `${getDoubleDigitNumber(hour)}:${getDoubleDigitNumber(minute)} *`)

    // Getting observer ecliptic longitude
    const index = nasaBody.indexOf(`${getDoubleDigitNumber(hour)}:${getDoubleDigitNumber(minute)} *`)

    // console.log('index: ', index)

    let ecLon = nasaBody.substring(index + 25, index + 35)

    // console.log('ecLon: ', Number(ecLon))

    return Number(ecLon)
}

const parseForAscendingNode = (nasaBody, hour, minute) => {
    const index = nasaBody.indexOf(`OM= `)

    let om = nasaBody.substring(index + 4, index + 25)

    return Number(om)
}


const getDoubleDigitNumber = (number) => {
    if (number > 9) return `${number}`

    else {
        return `0${number}`
    }
}

const whichSignAndDegree = (bodyPosition) => {
    // Given a body position in degrees from Aries, which sign is the body in, to what degree, and is it cusping?

    const position = checkForDegreeOverflow(bodyPosition)

    // Get all zodiac keys from dict
    const zodiacs = Object.keys(zodiacSigns)
    
    // Loop through zodiacs, determine which sign the body is in
    for (let i = 0; i < zodiacs.length; i++) {  
        const zodiac1 = zodiacs[i]
        const zodiacPosition1 = zodiacSigns[zodiac1].start

        var zodiacPosition2
        if (i !== zodiacs.length - 1) {
            const zodiac2 = zodiacs[i + 1]
            zodiacPosition2 = zodiacSigns[zodiac2].start
        } else {
            const zodiac2 = zodiacs[0]
            zodiacPosition2 = zodiacSigns[zodiac2].start + 360
        }

        // To what degree is the body in the zodiac sign
        const degree = position - zodiacPosition1

        if (position >= zodiacPosition1 && position < zodiacPosition2) {

            var cusp = false
            if (degree/zodiacSigns[zodiac1].width <= cuspThreshold) {
                // If degree is < 10%, cusp is previous zodiac sign
                cusp = {
                    ratio: getTwoDecimalNumber(degree/zodiacSigns[zodiac1].width),
                    zodiac: i !== 0 ? zodiacs[i - 1] : zodiacs[12],
                }
            } else if (degree/zodiacSigns[zodiac1].width >= 1 - cuspThreshold) {
                // If degree is > 90%, cusp is next zodiac sign
                cusp = {
                    ratio: getTwoDecimalNumber(degree/zodiacSigns[zodiac1].width),
                    zodiac: i !== 12 ? zodiacs[i + 1] : zodiacs[0],
                }
            }

            // console.log('degree: ', degree, ' width: ', zodiacSigns[zodiac1].width, ' , cuspRatio: ', cuspRatio)
            return { sign: zodiac1, element: zodiacSigns[zodiac1].element, degree: getTwoDecimalNumber(degree), cusp }
        } 
    }
}

module.exports = {
    getNatalChart,
    getAscendantDegrees,
    parseForEclipticLongitude,
    whichSignAndDegree
}







    