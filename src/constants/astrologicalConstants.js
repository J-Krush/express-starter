
const elements = {
    earth: 'earth', 
    water: 'water',
    fire: 'fire',
    mineral: 'mineral',
    air: 'air',
    nature: 'nature'
}

const zodiacSigns = {
    aries: { start: 0.0, width: 21.0, element: elements.fire },
    taurus: { start: 21.0, width: 36.5, element: elements.earth },
    gemini: { start: 57.5, width: 25.25, element: elements.air },
    cancer: { start: 82.75, width: 20.25, element: elements.water },
    leo: { start: 103.0, width: 38.25, element: elements.fire },
    virgo: { start: 141.25, width: 49.75, element: elements.earth },
    libra: { start: 191.0, width: 19, element: elements.air },
    scorpio: { start: 210.0, width: 13.5, element: elements.water },
    ophiuchus: { start: 223.5, width: 12.5, element: elements.nature },
    sagittarius: { start: 236.0, width: 33, element: elements.fire },
    capricorn: { start: 269.0, width: 25.5, element: elements.earth },
    aquarius: { start: 294.5, width: 23.5, element: elements.air },
    pisces: { start: 318.0, width: 42, element: elements.water },
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
    zodiacSigns,
    celestialBodies
}