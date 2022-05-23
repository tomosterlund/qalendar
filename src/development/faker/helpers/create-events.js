const getEventsForMonth = require('../event-properties/time');
const {NUMBER_OF_EVENTS} = require('../faker-config');
const getRandomElementInArray = require('./get-random-element-in-array');
const eventTitles = require('../event-properties/event-titles');
const names = require('../event-properties/names');
const colors = require('../event-properties/color');
const descriptions = require('../event-properties/descriptions');
const locations = require('../event-properties/locations');

const createEvents = (monthArg = null) => {
	const events = []
	const times = getEventsForMonth(monthArg)

	while (events.length < NUMBER_OF_EVENTS) {
		const time = getRandomElementInArray(times)

		let event = {
			title: getRandomElementInArray(eventTitles),
			with: getRandomElementInArray(names),
			time: {
				start: time.start,
				end: time.end,
			},
			color: getRandomElementInArray(colors),
			isEditable: true,
		}

		if (Math.random() < 0.5) event.description = getRandomElementInArray(descriptions)
		if (Math.random() < 0.5) event.location = getRandomElementInArray(locations)

		events.push(event)
	}

	// Sort events according to time.start, for easier debugging, if something breaks
	return events.sort((a, b) => {
		if (a.time.start > b.time.start) return 1
		if (a.time.start < b.time.start) return -1

		return 0
	})
}

module.exports = createEvents