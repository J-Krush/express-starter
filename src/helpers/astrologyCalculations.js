const fetch = require('node-fetch')


// Constants found here: https://en.wikipedia.org/wiki/Ascendant
const earthInclination = 23.4392911


const getTimeZone = async (dateTime, lat, lon) => {
    var url = 'https://maps.googleapis.com/maps/api/timezone/json?'

    console.log('timestamp: ', dateTime.toSeconds())

    url = url + `location=${lat}%2C${lon}&timestamp=${dateTime.toSeconds()}&key=YOUR_API_KEY`
    // var config = {
    //     method: 'get',
    //     url: ,
    //     headers: { }
    //   };

    return -4
}

const getNatalChart = async (dateTime, lat, lon) => {

    const year = dateTime.year
    const month = dateTime.month
    const day = dateTime.day
    const hour = dateTime.hour
    const minute = dateTime.minute

    const timeZoneOffset = await getTimeZone(dateTime, lat, lon)

    console.log('time zone: ', timeZoneOffset)

    const utcHour = hour - timeZoneOffset

    console.log('utcHour: ', utcHour)

    // Request data from nasa horizons API
    const nasaData = await requestNasaData(year, month, day, utcHour, minute, lat, lon)
    // const siderealTimeDegrees = getSiderealTimeDegrees(nasaData, utcHour, minute)
    // const ecLon = getEclipcticLongitude(nasaData, utcHour, minute)
    // const ascendant = getAscendantDegrees(siderealTimeDegrees, lat)

}


const requestNasaData = async (year, month, day, hour, minute, lat, lon) => {

    var arguments = "format=json&MAKE_EPHEM='YES'&COMMAND='301'&EPHEM_TYPE='OBSERVER'&CENTER='coord@399'&COORD_TYPE='GEODETIC'"
    const coordinates = `&SITE_COORD='${lon},${lat},0'`
    const startTime = `&START_TIME='${year}-${getDoubleDigitNumber(month)}-${getDoubleDigitNumber(day)} ${getDoubleDigitNumber(hour)}:${getDoubleDigitNumber(minute)}'`
    const stopTime = `&STOP_TIME='${year}-${getDoubleDigitNumber(month)}-${getDoubleDigitNumber(day)} ${getDoubleDigitNumber(hour)}:${getDoubleDigitNumber(minute + 1)}'`

    var otherArgs = "&STEP_SIZE='1 MINUTES'&QUANTITIES='7,31'&REF_SYSTEM='ICRF'&CAL_FORMAT='CAL'&APPARENT='AIRLESS'&SKIP_DAYLT='NO'"
    var otherArgsNotWorking = "&TIME_DIGITS='MINUTES'&ANG_FORMAT='HMS'&RANGE_UNITS='AU'&SUPPRESS_RANGE_RATE='NO'&SOLAR_ELONG='0,180'&EXTRA_PREC='NO'&RTS_ONLY='NO'&CSV_FORMAT='NO'&OBJ_DATA='YES'"


    arguments = arguments + coordinates + startTime + stopTime + otherArgs

    console.log('url: ', `https://ssd.jpl.nasa.gov/api/horizons.api?${arguments}`)

    const response = await fetch(`https://ssd.jpl.nasa.gov/api/horizons.api?${arguments}`)
    const data = await response.json()



    console.log('data: ', data)

    // Nasa api results
    const nasaBody = data.result

    return nasaBody

}

const getSiderealTimeDegrees = (nasaBody, hour, minute) => {
    // Calcuates ecliptic geocentric longitude which is easterly on the horizon: https://en.wikipedia.org/wiki/Ascendant#Calculation

    console.log('string to find: ', `${getDoubleDigitNumber(hour)}:${getDoubleDigitNumber(minute)} *m `)

    const index = nasaBody.indexOf(`${getDoubleDigitNumber(hour)}:${getDoubleDigitNumber(minute)} *m `)

    console.log('index: ', index)

    // Getting local sidereal time from nasa api
    let siderealTime = nasaBody.substring(index + 10, index + 18)

    console.log('siderealTime: ', siderealTime)

    const siderealHour = (Number(siderealTime.substring(0, 2)) / 24) * 360
    const siderealMinute = (Number(siderealTime.substring(3, 5)) / 60) * 15
    const siderealSecond = (Number(siderealTime.substring(6, 8)) / 60) * 0.15

    console.log('siderealHour: ', siderealHour)
    console.log('siderealMinute: ', siderealMinute)
    console.log('siderealSecond: ', siderealSecond)

    const siderealTimeDegrees = siderealHour + siderealMinute + siderealSecond

    return siderealTimeDegrees
}

const getAscendantDegrees = (siderealTimeDegrees, lat) => {

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
    ascendantDegrees = ascendantDegrees - 31.5

    console.log('ascendantDegrees: ', ascendantDegrees)
}

const getEclipcticLongitude = (nasaBody, hour, minute) => {
    console.log('string to find: ', `${getDoubleDigitNumber(hour)}:${getDoubleDigitNumber(minute)} *m `)

    // Getting observer ecliptic longitude
    const index = nasaBody.indexOf(`${getDoubleDigitNumber(hour)}:${getDoubleDigitNumber(minute)} *m `)

    console.log('index: ', index)

    let ecLon = nasaBody.substring(index + 25, index + 35)

    console.log('ecLon: ', Number(ecLon))

    return Number(ecLon)
}

const getDoubleDigitNumber = (number) => {
    if (number > 9) return `${number}`

    else {
        return `0${number}`
    }
}

module.exports = {
    getNatalChart,
    requestNasaData,
    getSiderealTimeDegrees,
    getAscendantDegrees,
    getEclipcticLongitude
}







    