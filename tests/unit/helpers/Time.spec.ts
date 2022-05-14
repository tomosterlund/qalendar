import {describe, expect, it} from "vitest";
import Time from '../../../src/helpers/Time'
const time = new Time()

describe('Time.ts', () => {

	it('Gets the current date', () => {
		const d = new Date()
		const currentDate = d.getDate()
		expect(time.getCurrentDate() === currentDate).toBe(true)
	})

	it('Gets the current month', () => {
		const currentMonth = new Date().getMonth()
		expect(time.getCurrentMonth()).toEqual(currentMonth + 1)
	});

	it('Gets the current year', () => {
		const currentYear = new Date().getFullYear()
		expect(time.getCurrentYear()).toEqual(currentYear)
	});

	it('Checks if leap year', () => {
		const leapYears = [2000, 2004, 2020, 2024, 2048]
		const regularYears = [2001, 1999, 2021, 2050, 2051]

		for (const leapYear of leapYears) {
			expect(time.isLeapYear(leapYear)).toBe(true)
		}

		for (const regularYear of regularYears) {
			expect(time.isLeapYear(regularYear)).toBe(false)
		}
	});

	it('Gets a calendar week, based on date 2022-05-14', () => {
		const d = new Date(2022, (5 - 1), 14)
		const week = time.getCalendarWeekDateObjects(d)

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
		const week = time.getCalendarWeekDateObjects(d)

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
		const week = time.getCalendarWeekDateObjects(d)

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
		const week = time.getCalendarWeekDateObjects(d)

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
		const week = time.getCalendarWeekDateObjects(d, 'sunday')

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
})