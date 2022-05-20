const fileSystem = require('fs')
const names = require('./names')
const eventTitles = require('./event-titles')
const getRandomElementInArray = require('./get-random-element-in-array')
const timesArray = require('./time')
const { NUMBER_OF_EVENTS } = require('./faker-config')
const colors = require('./color')

const createEvents = () => {
	const events = []

	while (events.length < NUMBER_OF_EVENTS) {
		const time = timesArray[getRandomElementInArray(timesArray.length)]

		let event = {
			title: eventTitles[getRandomElementInArray(eventTitles.length)],
			with: names[getRandomElementInArray(names.length)],
			time: {
				start: time.start,
				end: time.end,
			},
			color: colors[getRandomElementInArray(colors.length)]
		}

		events.push(event)
	}

	return events.sort((a, b) => {
		if (a.time.start > b.time.start) return 1
		if (a.time.start < b.time.start) return -1

		return 0
	})
}

const events = createEvents()

const writeEventsToFile = () => {
	const payload = new Uint8Array(Buffer.from(`export const seededEvents = ${JSON.stringify(events)}`))

	fileSystem.writeFile('./src/development/data/seeded-events.ts', payload, err => {
		if (err) console.error(err)
		else console.log('wrote events to src/development/data/seeded-events.ts')
	})
}

writeEventsToFile()