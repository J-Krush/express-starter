const { elements, signElement } = require('../constants/astrologicalConstants')
const { linearCode } = require('./utilities')

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

const fullElementalCode = (year, sunSign, nNode, sNode) => {
    // 1 (Indigenious): Dagara year
    // 2 (Achievement): Sidereal sun sign
    // 3 (Soul Path): South node
    // 4 (Legacy): TODO
    // 5 (Multidimensional): North node
    // 6 Galactic: TODO

    console.log('full elemental code')
    console.log('year: ', year)
    console.log('sunSign: ', sunSign)
    console.log('nNode: ', nNode)
    console.log('sNode: ', sNode)

    const indigeniousElement = dagaraElement(year)

    const sunSignElement = signElement[sunSign]
    const southNodeElement = signElement[sNode]
    const legacyElement = '?'
    const northNodeElement = signElement[nNode]
    const galacticElement = '?'

    const rawArray = [indigeniousElement, sunSignElement, southNodeElement, legacyElement, northNodeElement, galacticElement]

    console.log('rawArray: ', rawArray)


    // Build filtered code array. Start with indigenious.
    var codeArray = [indigeniousElement]

    // Achievement
    if (sunSignElement !== indigeniousElement) {
        codeArray.push(sunSignElement)
    } else {
        codeArray.push(elements.mineral)
    }

    // Soul Path
    if (southNodeElement !== indigeniousElement && southNodeElement !== sunSignElement) {
        codeArray.push(southNodeElement)
    } else if (southNodeElement === indigeniousElement && southNodeElement === sunSignElement) {
        codeArray.push(elements.nature)
    }  else if (southNodeElement === indigeniousElement || southNodeElement === sunSignElement) {
        codeArray.push(elements.mineral)
    }

    // Legacy: TODO
    codeArray.push(legacyElement)

    // Multidimensional
    const duplicates = rawArray.slice(0, 3).filter(item => item === northNodeElement).length
    if (duplicates === 0) {
        codeArray.push(northNodeElement)
    } else if (duplicates === 1 && codeArray.indexOf(elements.mineral) !== -1) {
        codeArray.push(elements.nature)
    } else if (duplicates === 1 && codeArray.indexOf(elements.mineral) === -1) {
        codeArray.push(elements.mineral)
    }

    // Galactic: TODO
    codeArray.push(galacticElement)


    return linearCode(codeArray)
}

module.exports = {
    dagaraElement,
    fullElementalCode
}