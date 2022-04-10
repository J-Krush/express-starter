const { elements, zodiacSigns } = require('../constants/astrologicalConstants')
const { linearCode, getLastDigitOfYear, elementCountInArray } = require('./utilities')

const dagaraElement = (year) => {
    var lastDigitYear = getLastDigitOfYear(year)

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

const fullElementalCode = (year, sunSign, northNode, southNode) => {
    // 1 (Indigenious): Dagara year
    // 2 (Achievement): Sidereal sun sign
    // 3 (Soul Path): South node
    // 4 (Legacy): TODO
    // 5 (Multidimensional): North node
    // 6 Galactic: TODO

    console.log('full elemental code')
    console.log('year: ', year)
    console.log('sunSign: ', sunSign)
    console.log('northNode: ', northNode)
    console.log('southNode: ', southNode)

    const indigenious = { element: dagaraElement(year) }

    // TODO: Legacy and Galactic
    const legacyElement = { element: '?' }
    const galacticElement = { element: '?' }

    const rawArray = [indigenious, sunSign, southNode, legacyElement, northNode, galacticElement]

    console.log('rawArray: ', rawArray)

    // Build filtered code array.
    // Start with Indigenious (Dagara Year).
    var codeArray = [indigenious]

    // Achievement (Sun Sign)
    if (sunSign.element !== indigenious.element && sunSign.cusp === false) {
        codeArray.push(sunSign)
    } else {
        const mineralCount = elementCountInArray(codeArray, elements.mineral)
        if (mineralCount === 0) {
            codeArray.push({
                ...sunSign,
                element: elements.mineral
            })
        } else {
            codeArray.push({
                ...sunSign,
                element: elements.nature
            })
        }
    }

    // Soul Path (South Node)
    if (southNode.element !== indigenious.element && southNode.element !== sunSign.element && southNode.cusp === false) {
        codeArray.push(southNode)
    } else if (southNode.element === sunSign.element && sunSign.cusp !== false) {
        codeArray.push(southNode)
    } else if (southNode.element === indigenious.element && southNode.element === sunSign.element) {
        codeArray.push({
            ...southNode,
            element: elements.nature
        })
    }  else  {
        const mineralCount = elementCountInArray(codeArray, elements.mineral)
        const natureCount = elementCountInArray(codeArray, elements.nature)

        if (mineralCount === 0) {
            codeArray.push({
                ...southNode,
                element: elements.mineral
            })
        } else if (mineralCount !== 0 && natureCount !== 0) {
            codeArray.push(southNode)
        } else {
            codeArray.push({
                ...southNode,
                element: elements.nature
            })
        }
    }

    // Legacy: TODO
    codeArray.push(legacyElement)

    // Multidimensional
    if (northNode.element !== indigenious.element && northNode.element !== sunSign.element && northNode.element !== southNode.element && northNode.cusp === false) {
        codeArray.push(northNode)
    } else if (northNode.element === indigenious.element && northNode.element === sunSign.element) {
        codeArray.push({
            ...northNode,
            element: elements.nature
        })
    }  else {
        const mineralCount = elementCountInArray(codeArray, elements.mineral)
        const natureCount = elementCountInArray(codeArray, elements.nature)
        if (mineralCount === 0) {
            codeArray.push({
                ...northNode,
                element: elements.mineral
            })
        } else if (mineralCount !== 0 && natureCount !== 0) {
            codeArray.push(northNode)
        } else {
            codeArray.push({
                ...northNode,
                element: elements.nature
            })
        }
    }

    // Galactic: TODO
    codeArray.push(galacticElement)

    console.log('final code array: ', codeArray)

    // console.log('raw array: ', linearCode(rawArray))
    // console.log('filtered array: ', linearCode(codeArray, year))
    return `${linearCode(codeArray, year)} (${linearCode(rawArray, 0, true)})`
}

module.exports = {
    dagaraElement,
    fullElementalCode
}