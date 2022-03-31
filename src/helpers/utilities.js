const { zodiacSigns } = require('../constants/astrologicalConstants')

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

const displayCusp = (signAndDegree) => {
    return `${firstChar(signAndDegree.element)}${signAndDegree.cusp && signAndDegree.cusp !== false ? '/' + firstChar(zodiacSigns[signAndDegree.cusp.zodiac].element) : ''}`
}

const linearCode = (codeArray, year = 0, displayCusps = false) => {
    var lastDigitYear
    if (year !== 0) { lastDigitYear = getLastDigitOfYear(year) }
    
    const firstElement = firstChar(codeArray[0].element)
    const secondElement =  displayCusps ? displayCusp(codeArray[1]) : firstChar(codeArray[1].element)
    const thirdElement = displayCusps ? displayCusp(codeArray[2]) : firstChar(codeArray[2].element)
    const fourthElement = firstChar(codeArray[3].element)
    const fifthElement = displayCusps ? displayCusp(codeArray[4]) : firstChar(codeArray[4].element)
    
    return `${firstElement}-${secondElement}-${thirdElement}-${fourthElement}-${fifthElement} // ${firstElement}-${secondElement}-${fifthElement}-${fourthElement}-${thirdElement} ${year !== 0 ? `*${lastDigitYear}` : ''}`
}

const getTwoDecimalNumber = (number) => {
    return Math.round(number * 100) / 100
}

const getLastDigitOfYear = (year) => {
    return Number.isInteger(year) ? year % 10 : parseInt(year.toString().substr(-1))
}

const elementCountInArray = (array, element) => {
    var count = 0
    array.forEach((sign, index) => {
        if (sign.element === element) ++count
    })
    return count
}

module.exports = {
    checkForDegreeOverflow,
    firstChar,
    linearCode,
    getTwoDecimalNumber,
    getLastDigitOfYear,
    elementCountInArray
}