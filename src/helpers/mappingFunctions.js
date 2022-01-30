const { elements } = require('../constants/astrological-constants')

const dagaraElement = (year) => {
    var lastDigitYear = Number.isInteger(year) ? year % 10 : parseInt(year.toString().substr(-1))
    console.log('short year: ', lastDigitYear)

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
            return 'unknown character'
    }
    
}

module.exports = {
    dagaraElement
}