import {describe, expect, it} from "vitest";
import Time from '../../../src/helpers/Time'
// Functionality which is sensitive to the class property FIRST_DAY_OF_WEEK
// needs to be tested with both "timeM" and "timeS"
const timeM = new Time('monday')
const timeS = new Time('sunday')

describe('Time.ts', () => {

	it('Gets a calendar week, based on date 2022-05-14', () => {
		const d = new Date(2022, (5 - 1), 14)
		const week = timeM.getCalendarWeekDateObjects(d)

		expect(week).toHaveLength(7)

		let expectedDate = 9
		for (const day of week) {
			expect(day.getDate()).toEqual(expectedDate)
			expect(day.getMonth()).toEqual(4) // May
			expect(day.getFullYear()).toEqual(2022)

			expectedDate++
		}
	});

	it('Gets a calendar week, based on date 2022-03-13 (week of daylight savings)', () => {
		const d = new Date(2022, (3 - 1), 13)
		const week = timeM.getCalendarWeekDateObjects(d)

		expect(week).toHaveLength(7)

		let expectedDate = 7
		for (const day of week) {
			expect(day.getDate()).toEqual(expectedDate)
			expect(day.getMonth()).toEqual(2) // March
			expect(day.getFullYear()).toEqual(2022)

			expectedDate++
		}
	});

	it('Gets a calendar week, situated in two months 2025-10-29', () => {
		const d = new Date(2025, (10 - 1), 29)
		const week = timeM.getCalendarWeekDateObjects(d)

		expect(week).toHaveLength(7)

		expect(week[0].getDate()).toEqual(27)
		expect(week[0].getMonth()).toEqual(9) // October
		expect(week[0].getFullYear()).toEqual(2025)

		expect(week[1].getDate()).toEqual(28)
		expect(week[1].getMonth()).toEqual(9) // October

		expect(week[5].getDate()).toEqual(1)
		expect(week[5].getMonth()).toEqual(10) // November

		expect(week[6].getDate()).toEqual(2)
		expect(week[6].getMonth()).toEqual(10) // November
	});

	it('Gets a calendar week, situated in two years 2025-12-29', () => {
		const d = new Date(2025, (12 - 1), 29)
		const week = timeM.getCalendarWeekDateObjects(d)

		expect(week).toHaveLength(7)

		expect(week[0].getDate()).toEqual(29)
		expect(week[0].getMonth()).toEqual(11) // December
		expect(week[0].getFullYear()).toEqual(2025)

		expect(week[2].getDate()).toEqual(31)
		expect(week[2].getMonth()).toEqual(11) // December
		expect(week[2].getFullYear()).toEqual(2025)

		expect(week[3].getDate()).toEqual(1)
		expect(week[3].getMonth()).toEqual(0) // January
		expect(week[3].getFullYear()).toEqual(2026)

		expect(week[6].getDate()).toEqual(4)
		expect(week[6].getMonth()).toEqual(0) // January
		expect(week[6].getFullYear()).toEqual(2026)
	});

	it('should get a calendar week based on Sunday being the first day', () => {
		const d = new Date(2025, (12 - 1), 29)
		const week = timeS.getCalendarWeekDateObjects(d)

		expect(week).toHaveLength(7)

		expect(week[0].getDate()).toEqual(28)
		expect(week[0].getMonth()).toEqual(11) // December
		expect(week[0].getFullYear()).toEqual(2025)

		expect(week[2].getDate()).toEqual(30)
		expect(week[2].getMonth()).toEqual(11) // December
		expect(week[2].getFullYear()).toEqual(2025)

		expect(week[4].getDate()).toEqual(1)
		expect(week[4].getMonth()).toEqual(0) // January
		expect(week[4].getFullYear()).toEqual(2026)

		expect(week[6].getDate()).toEqual(3)
		expect(week[6].getMonth()).toEqual(0) // January
		expect(week[6].getFullYear()).toEqual(2026)
	});

	it('should get a calendar month for 2022-05-14', () => {
		const month = timeM.getCalendarMonthSplitInWeeks(2022, (5 - 1))

		// Six weeks during the month
		expect(month).toHaveLength(6)

		const firstWeek = month[0]
		// Also get the days of the first week, that were in the previous month
		expect(firstWeek[0].getDate()).toEqual(25)
		expect(firstWeek[0].getMonth()).toEqual(4 - 1)
		expect(firstWeek[6].getDate()).toEqual(1)
		expect(firstWeek[6].getMonth()).toEqual(5 - 1)

		const secondWeek = month[1]
		expect(secondWeek[0].getDate()).toEqual(2)
		expect(secondWeek[0].getMonth()).toEqual(5 - 1)

		const lastWeek = month[5]
		expect(lastWeek[1].getDate()).toEqual(31)
		expect(lastWeek[1].getMonth()).toEqual(5 - 1)
		expect(lastWeek[6].getDate()).toEqual(5)
		expect(lastWeek[6].getMonth()).toEqual(6 - 1)
	});

	it('should get a calendar month for 2022-03-27, based on Sunday as first day', () => {
		const month = timeS.getCalendarMonthSplitInWeeks(2022, (3 - 1))

		// Six weeks during the month
		expect(month).toHaveLength(5)

		const firstWeek = month[0]
		// Also get the days of the first week, that were in the previous month
		expect(firstWeek[0].getDate()).toEqual(27)
		expect(firstWeek[0].getMonth()).toEqual(2 - 1)
		expect(firstWeek[2].getDate()).toEqual(1)
		expect(firstWeek[2].getMonth()).toEqual(3 - 1)
		expect(firstWeek[6].getDate()).toEqual(5)
		expect(firstWeek[6].getMonth()).toEqual(3 - 1)

		const thirdWeek = month[2]
		expect(thirdWeek[3].getDate()).toEqual(16)
		expect(thirdWeek[3].getMonth()).toEqual(3 - 1)

		const lastWeek = month[4]
		expect(lastWeek[4].getDate()).toEqual(31)
		expect(lastWeek[4].getMonth()).toEqual(3 - 1)
		expect(lastWeek[6].getDate()).toEqual(2)
		expect(lastWeek[6].getMonth()).toEqual(4 - 1)
	});

	it('should get a calendar month that is in two years, based on 2024-12-30', () => {
		const month = timeS.getCalendarMonthSplitInWeeks(2024, (12 - 1))

		expect(month).toHaveLength(5)

		const firstWeek = month[0]
		expect(firstWeek[0].getDate()).toEqual(1)
		expect(firstWeek[0].getMonth()).toEqual(12 - 1)
		expect(firstWeek[0].getFullYear()).toEqual(2024)

		const fourthWeek = month[3]
		expect(fourthWeek[5].getDate()).toEqual(27)
		expect(fourthWeek[5].getMonth()).toEqual(12 - 1)
		expect(fourthWeek[5].getFullYear()).toEqual(2024)

		const lastWeek = month[4]
		expect(lastWeek[2].getDate()).toEqual(31)
		expect(lastWeek[2].getMonth()).toEqual(12 - 1)
		expect(lastWeek[2].getFullYear()).toEqual(2024)

		expect(lastWeek[6].getDate()).toEqual(4)
		expect(lastWeek[6].getMonth()).toEqual(1 - 1)
		expect(lastWeek[6].getFullYear()).toEqual(2025)
	});

	it('should get calendar month January, with week.startsOn === "monday"', () => {
		const month = timeM.getCalendarMonthSplitInWeeks(2040, (1 - 1))
		expect(month).toHaveLength(6)

		const firstWeek = month[0]
		expect(firstWeek[0].getDate()).toBe(26)
		expect(firstWeek[6].getDate()).toBe(1)
		const thirdWeek = month[2]
		expect(thirdWeek[5].getDate()).toBe(14)

	})

	it('should get calendar month January, with week.startsOn === "sunday"', () => {
		const month = timeS.getCalendarMonthSplitInWeeks(2040, (1 - 1))
		expect(month).toHaveLength(5)

		const firstWeek = month[0]
		expect(firstWeek[0].getDate()).toBe(1)
	})

	it('should get the months of a year', () => {
		const year = timeM.getCalendarYearMonths(2027)

		expect(year).toHaveLength(12)
		expect(year[0].toLocaleDateString('de-DE', { month: 'long' }))
			.toEqual('Januar')

		expect(year[11].toLocaleDateString('de-DE', { month: 'long' }))
			.toEqual('Dezember')

		let monthIterator = 0
		for (const month of year) {
			expect(month.getMonth()).toEqual(monthIterator)
			monthIterator++
		}
	});

	it('should get a localized string, for each hour of the day', () => {
		const timeEnglish = new Time('sunday', 'en-US')
		const hours = timeM.ALL_HOURS

		let iterator = 0
		while (iterator < 12) {
			expect(timeEnglish.getHourLocaleStringFromHourDigits(hours[iterator]))
				.toEqual(`${iterator === 0 ? '12' : iterator} AM`)

			iterator++
		}

		while (iterator <= 24) {
			let expectedValue

			if (iterator === 12) expectedValue = '12 PM'
			else if (iterator === 24) expectedValue = '12 AM'
			else expectedValue = `${iterator - 12} PM`

			expect(timeEnglish.getHourLocaleStringFromHourDigits(hours[iterator]))
				.toEqual(expectedValue)

			iterator++
		}
	});

	it('returns a localized name of the day, given a specified date', () => {
		// Long day names
		const timeEnglish = new Time('sunday', 'en-US')

		const saturday = timeEnglish.getLocalizedNameOfWeekday(new Date(2022, (5 - 1), 14), 'long')
		expect(saturday).toEqual('Saturday')

		const thursday = timeEnglish.getLocalizedNameOfWeekday(new Date(2026, (1 - 1), 1), 'long')
		expect(thursday).toEqual('Thursday')

		// Short day names
		const timeSwedish = new Time('monday', 'sv-SE')

		const loerdag = timeSwedish.getLocalizedNameOfWeekday(new Date(2022, (5 - 1), 14), 'short')
		expect(loerdag).toEqual('lör')

		const torsdag = timeSwedish.getLocalizedNameOfWeekday(new Date(2026, (1 - 1), 1), 'short')
		expect(torsdag).toEqual('tors')
	});

	it('returns a localized name of the month, given a specified date', () => {
		const timeEnglish = new Time('monday', 'en-UK')

		// Try short month names
		const january = timeEnglish.getLocalizedNameOfMonth(new Date(2025, (1 - 1), 1), 'short')
		expect(january).toEqual('Jan')

		const december = timeEnglish.getLocalizedNameOfMonth(new Date(2025, (12 - 1), 1), 'short')
		expect(december).toEqual('Dec')

		// And long ones
		const timeGerman = new Time('monday', 'de-DE')

		const maerz = timeGerman.getLocalizedNameOfMonth(new Date(2025, (3 - 1), 31), 'long')
		expect(maerz).toEqual('März')

		const august = timeGerman.getLocalizedNameOfMonth(new Date(2025, (8 - 1), 20), 'long')
		expect(august).toEqual('August')
	});

	it('returns a localized date string for US English', () => {
		const timeEnglish = new Time('sunday', 'en-US')
		const d = new Date(2022, (5 - 1), 15)
		const dateString = timeEnglish.getLocalizedDateString(d)
		expect(dateString).toEqual('5/15/2022')
	});

	it('returns a localized date string for German', () => {
		const timeGerman = new Time('monday', 'de-DE')
		const d = new Date(2022, (1 - 1), 1)
		const dateString = timeGerman.getLocalizedDateString(d)
		expect(dateString).toEqual('1.1.2022')
	});

	it('returns a time string YYYY-MM-DD hh:mm based on a date-object', () => {
		const firstOfFebruary = new Date(2020, (2 - 1), 1, 10, 30)
		expect(timeM.getDateTimeStringFromDate(firstOfFebruary, 'start')).toBe('2020-02-01 00:00')

		const eleventhOfAugust = new Date(2031, (8 - 1), 11)
		expect(timeM.getDateTimeStringFromDate(eleventhOfAugust, 'end')).toBe('2031-08-11 23:59')

		const twentiethOfDecember = new Date(2031, (12 - 1), 20, 20, 45)
		expect(timeM.getDateTimeStringFromDate(twentiethOfDecember)).toBe('2031-12-20 20:45')
	});

	it('tests getHourAndMinutesFromTimePoints', () => {
		let { hour: h1, minutes: m1 } = timeM.getHourAndMinutesFromTimePoints(0)
		expect(h1).toBe(0)
		expect(m1).toBe(0)

		const { hour: h2, minutes: m2 } = timeM.getHourAndMinutesFromTimePoints(1300)
		expect(h2).toBe(13)
		expect(m2).toBe(0)

		const { hour: h3, minutes: m3 } = timeM.getHourAndMinutesFromTimePoints(2300)
		expect(h3).toBe(23)
		expect(m3).toBe(0)
	});

	it('tests getLocalizedHours', () => {
		const englishTime = new Time('sunday', 'en-US')
		const fourAM = new Date(2022, 0, 1, 4)
		expect(englishTime.getLocalizedHour(fourAM)).toBe('04 AM')

		const swedishTime = new Time('monday', 'sv-SE')
		const elevenPM = new Date(0, 0, 1, 23)
		expect(swedishTime.getLocalizedHour(elevenPM)).toBe('23')
	});

	it('returns numeric values for year, month, date, hour and minutes, given a dateTimeString', () => {
		const dateTimeString = '2049-12-31 23:59'
		expect(timeM.getAllVariablesFromDateTimeString(dateTimeString)).toEqual({
			year: 2049,
			month: 11,
			date: 31,
			hour: 23,
			minutes: 59,
		})

		const futureDateTimeString = '2209-06-01 00:00'
		expect(timeM.getAllVariablesFromDateTimeString(futureDateTimeString)).toEqual({
			year: 2209,
			month: 5,
			date: 1,
			hour: 0,
			minutes: 0,
		})
	});

	it.todo('checks if a given date is in a given week')
})