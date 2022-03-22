
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
    sun: "Sun",
	moon: "Moon",
	mercury: "Mercury",
	venus: "Venus",
	mars: "Mars",
	jupiter: "Jupiter",
	saturn: "Saturn",
	uranus: "Uranus",
	neptune: "Neptune",
	pluto: "Pluto",
	chiron: "Chiron",
	lilith: "Lilith",
	nnode: "NNode",
}


module.exports = {
    elements,
    signElement
}