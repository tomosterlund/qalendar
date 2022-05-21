const fileSystem = require('fs')
const { NUMBER_OF_EVENTS } = require('./faker-config')
const getRandomElementInArray = require('./helpers/get-random-element-in-array')
const getCommandArguments = require('./helpers/get-command-arguments')
const printCliMessage = require('./helpers/print-cli-message')

const names = require('./event-properties/names')
const eventTitles = require('./event-properties/event-titles')
const getEventsForMonth = require('./event-properties/time')
const colors = require('./event-properties/color')
const descriptions = require('./event-properties/descriptions')
const locations = require('./event-properties/locations')

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
			color: getRandomElementInArray(colors)
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

const writeEventsToFile = () => {
	const events = []
	const commandArguments = getCommandArguments()
	const monthsToSeed = commandArguments.months ? commandArguments.months : []

	if (monthsToSeed.length) {
		for (const monthToSeed of monthsToSeed) {
			events.push(...createEvents(monthToSeed))
		}
	} else {
		events.push(...createEvents())
	}

	const payload = new Uint8Array(Buffer.from(`export const seededEvents = ${JSON.stringify(events)}`))

	fileSystem.writeFile('./src/development/data/seeded-events.ts', payload, err => {
		if (err) console.error(err)
		else {
			printCliMessage(monthsToSeed)
		}
	})
}

writeEventsToFile()