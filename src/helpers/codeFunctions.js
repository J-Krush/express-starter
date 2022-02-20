const { elements } = require('../constants/astrologicalConstants')

const dagaraElement = (year) => {
    var lastDigitYear = Number.isInteger(year) ? year % 10 : parseInt(year.toString().substr(-1))
    // console.log('short year: ', lastDigitYear)

    var northOrSouth = 'north'
    if (lastDigitYear < 5 && lastDigitYear >= 0) {
        northOrSouth = 'south'
    }

    switch (lastDigitYear) {
        case 0:
        case 5:
            return `${elements.earth} ( ${northOrSouth} )`
        case 1:
        case 6:
            return `${elements.water} ( ${northOrSouth} )`
        case 2:
        case 7:
            return `${elements.fire} ( ${northOrSouth} )`
        case 3:
        case 8:
            return `${elements.nature} ( ${northOrSouth} )`
        case 4:
        case 9:
            return `${elements.mineral} ( ${northOrSouth} )`
        default:
            return 'unknown character'
    }
    
}

// TODO: Add chart functions

module.exports = {
    dagaraElement
}