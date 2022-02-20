
const elements = {
    earth: 'earth', 
    water: 'water',
    fire: 'fire',
    mineral: 'mineral',
    air: 'air',
    nature: 'nature'
}
const signElement = {
    aries: elements.fire,
    taurus: elements.earth,
    gemini: elements.air,
    cancer: elements.water,
    leo: elements.fire,
    virgo: elements.earth,
    libra: elements.air,
    scorpio: elements.water,
    sagittarius: elements.fire,
    capricorn: elements.earth,
    aquarius: elements.air,
    pisces: elements.water,
    ophiuchus: 'Ophiuchus', // TODO: what is ophiuchus element?
}

module.exports = {
    elements,
    signElement
}