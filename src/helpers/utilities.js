
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

const getTwoDecimalNumber = (number) => {
    return Math.round(number * 100) / 100
}

module.exports = {
    checkForDegreeOverflow,
    firstChar,
    linearCode,
    getTwoDecimalNumber
}