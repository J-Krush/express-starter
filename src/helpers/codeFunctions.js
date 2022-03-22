const { elements, signElement } = require('../constants/astrologicalConstants')

const dagaraElement = (year) => {
    var lastDigitYear = Number.isInteger(year) ? year % 10 : parseInt(year.toString().substr(-1))

    // TODO revisit this logic
    var northNodeExperience
    var southNodeExperience
    if (lastDigitYear < 5 && lastDigitYear >= 0) {
        southNodeExperience = 'outer'
        northNodeExperience = 'inner'
    }

    switch (lastDigitYear) {
        case 0:
        case 5:
            return elements.earth
        case 1:
        case 6:
            return elements.water
        case 2:
        case 7:
            return elements.fire
        case 3:
        case 8:
            return elements.nature
        case 4:
        case 9:
            return elements.mineral
        default:
            return {}
    }
}

const fullElementalCode = (year, horoscope) => {
    // 1 (Indigenious): Dagara year
    // 2 (Achievement): Sidereal sun sign
    // 3 (Soul Path): South node
    // 4 (Legacy): TODO
    // 5 (Multidimensional): North node
    // 6 Galactic: TODO

    

    const indigenious = dagaraElement(year)
    const sunSign = signElement[horoscope.SunSign.key]
    const southNode = signElement[horoscope.CelestialPoints.southnode.Sign.key]
    const legacy = '?'
    const northNode = signElement[horoscope.CelestialPoints.northnode.Sign.key]
    const galactic = '?'

    const rawArray = [indigenious, sunSign, southNode, legacy, northNode, galactic]


    // Build filtered code array. Start with indigenious.
    var codeArray = [indigenious]

    // Achievement
    if (sunSign !== indigenious) {
        codeArray.push(sunSign)
    } else {
        codeArray.push(elements.mineral)
    }

    // Soul Path
    if (southNode !== indigenious && southNode !== sunSign) {
        codeArray.push(southNode)
    } else if (southNode === indigenious && southNode === sunSign) {
        codeArray.push(elements.nature)
    }  else if (southNode === indigenious || southNode === sunSign) {
        codeArray.push(elements.mineral)
    }

    // Legacy: TODO
    codeArray.push(legacy)

    // Multidimensional
    const duplicates = rawArray.slice(0, 3).filter(item => item === northNode).length
    if (duplicates === 0) {
        codeArray.push(northNode)
    } else if (duplicates === 1 && codeArray.indexOf(elements.mineral) !== -1) {
        codeArray.push(elements.nature)
    } else if (duplicates === 1 && codeArray.indexOf(elements.mineral) === -1) {
        codeArray.push(elements.mineral)
    }

    // Galactic: TODO
    codeArray.push(galactic)
    

    return linearCode(codeArray)
}

const mapHoroscopeToChart = (horoscope) => {

    var data = {
        "planets": {},
        "cusps": []
    }


    // Points (northnode, southnode, lilith)
    data.planets["Lilith"] = [parseInt(horoscope.CelestialPoints.lilith.ChartPosition.Horizon.DecimalDegrees)]
    data.planets["NNode"] = [parseInt(horoscope.CelestialPoints.northnode.ChartPosition.Horizon.DecimalDegrees)]


    // Celestial Bodies
    const bodies = horoscope.CelestialBodies
    data.planets["Chiron"] = [parseInt(bodies.chiron.ChartPosition.Horizon.DecimalDegrees)]
    data.planets["Pluto"] = [parseInt(bodies.pluto.ChartPosition.Horizon.DecimalDegrees)]
    data.planets["Neptune"] = [parseInt(bodies.neptune.ChartPosition.Horizon.DecimalDegrees)]
    data.planets["Uranus"] = [parseInt(bodies.uranus.ChartPosition.Horizon.DecimalDegrees)]
    data.planets["Saturn"] = [parseInt(bodies.saturn.ChartPosition.Horizon.DecimalDegrees)]
    data.planets["Jupiter"] = [parseInt(bodies.jupiter.ChartPosition.Horizon.DecimalDegrees)]
    data.planets["Mars"] = [parseInt(bodies.mars.ChartPosition.Horizon.DecimalDegrees)]
    data.planets["Moon"] = [parseInt(bodies.moon.ChartPosition.Horizon.DecimalDegrees)]
    data.planets["Sun"] = [parseInt(bodies.sun.ChartPosition.Horizon.DecimalDegrees)]
    data.planets["Mercury"] = [parseInt(bodies.mercury.ChartPosition.Horizon.DecimalDegrees)]
    data.planets["Venus"] = [parseInt(bodies.venus.ChartPosition.Horizon.DecimalDegrees)]


    const angles = horoscope.Angles
    const ascendant = parseInt(angles.ascendant.ChartPosition.Ecliptic.DecimalDegrees)	

    // Cusps
    var cusps = []
    horoscope.ZodiacCusps.forEach(cusp => {
        // console.log(cusp.Sign.key, ' cusp start: ', cusp.Sign.zodiacStart)
        cusps.push(cusp.Sign.zodiacStart)
    })

    data.cusps = cusps

    // console.log('data: ', data)

    return data

    const targetData = {
        "planets":{
            "Lilith":[18],
            "Chiron":[18],
            "Pluto":[63],
            "Neptune":[110, 0.2],
            "Uranus":[318],
            "Saturn":[201, -0.2],
            "Jupiter":[192],
            "Mars":[210],
            "Moon":[268],
            "Sun":[281],
            "Mercury":[312],
            "Venus":[330],
            "NNode":[2]},
        "cusps":[296, 350, 30, 56, 75, 94, 116, 170, 210, 236, 255, 274]			
    }
}

const checkForDegreeOverflow = (deg) => {
    if (deg < 360 && deg >= 0) {
        return deg
    } else if (deg > 360) {
        return deg - 360
    } else if (deg < 0) {
        return deg + 360
    }
}

const firstChar = (string) => {
    return string.charAt(0).toUpperCase()
}

const linearCode = (codeArray) => {
    return `${firstChar(codeArray[0])}-${firstChar(codeArray[1])}-${firstChar(codeArray[2])}-${firstChar(codeArray[3])}-${firstChar(codeArray[4])} --- ${firstChar(codeArray[0])}-${firstChar(codeArray[1])}-${firstChar(codeArray[4])}-${firstChar(codeArray[3])}-${firstChar(codeArray[2])}`
}

 // TODO: Add chart functions

module.exports = {
    dagaraElement,
    fullElementalCode,
    mapHoroscopeToChart
}