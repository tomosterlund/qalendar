const getRandomElementInArray = require('./get-random-element-in-array')
const { NUMBER_OF_EVENTS } = require('./faker-config')

const createDateTimeString = dateObject => {
	const d = new Date(dateObject)
	const year = d.getFullYear()
	const month = d.getMonth() < 10 ? `0${d.getMonth()}` : d.getMonth()
	const date = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()
	const hour = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()
	const minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()

	return `${year}-${month}-${date} ${hour}:${minutes}`
}

const getTimesArray = () => {
	const timesArray = []

	const d = new Date()
	const month = d.getMonth()
	const year = d.getFullYear()
	const minutes = [0, 5, 10, 14, 15, 20, 25, 30, 35, 40, 45, 47, 50, 52, 55, 60, 90, 120, 180]
	const minutesForAdding = [15, 30, 45, 45, 50, 60, 60, 60, 90, 90, 90, 90, 90, 90, 120, 120, 120]
	const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
	const datesOfMonth = []
	const lastDateOfMonth = new Date(year, (month + 1), 0).getDate()

	let date = 1
	while (date <= lastDateOfMonth) {
		datesOfMonth.push(date)
		date++
	}

	while (timesArray.length < (NUMBER_OF_EVENTS + 1000)) { // Create NUMER_OF_EVENTS + 100 time-objects, to prevent cluttering in the time space
		const startDate = new Date(
			year,
			(month + 1),
			datesOfMonth[getRandomElementInArray(datesOfMonth.length)],
			hours[getRandomElementInArray(hours.length)],
			minutes[getRandomElementInArray(minutes.length)],
		)

		let minutesToAdd = minutesForAdding[getRandomElementInArray(minutesForAdding.length)]
		if (minutesToAdd === 0) minutesToAdd = 60

		const endDate = new Date(
			startDate.getTime() + (minutesToAdd * 60000)
		)

		timesArray.push({ start: createDateTimeString(startDate), end: createDateTimeString(endDate) })
	}

	return timesArray
}

module.exports = getTimesArray()