
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
const celestialBodies = {
    sun: {title: 'Sun', code: 10},
	moon: {title: 'Moon', code: 301},
	mercury: {title: 'Mercury', code: 199},
	venus: {title: 'Venus', code: 299},
    earth: {title: 'Earth', code: 399},
	mars: {title: 'Mars', code: 499},
	jupiter: {title: 'Jupiter', code: 599},
	saturn: {title: 'Saturn', code: 699},
	uranus: {title: 'Uranus', code: 799},
	neptune: {title: 'Neptune', code: 899},
	pluto: {title: 'Pluto', code: 999},
	chiron: {title: 'Chiron', code: 'DES=2002060;'},
	lilith: {title: 'Lilith', code: 'DES=2001181;'},
}


module.exports = {
    elements,
    signElement,
    celestialBodies
}