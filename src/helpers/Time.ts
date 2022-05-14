export default class Time {
	DAYS_IN_MONTH: number[]
	DAYS_IN_MONTH_LEAP: number[]
	DAYS_IN_MONTH_MIN: number
	DAYS_IN_MONTH_MAX: number
	MONTH_MAX: number
	MONTH_MIN: number
	DAY_MIN: number
	DAYS_IN_WEEK: number
	MINUTES_IN_HOUR: number
	MINUTE_MAX: number
	MINUTES_IN_DAY: number
	HOURS_IN_DAY: number
	HOUR_MAX: number
	FIRST_HOUR: number

	constructor() {
		this.DAYS_IN_MONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
		this.DAYS_IN_MONTH_LEAP = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
		this.DAYS_IN_MONTH_MIN = 28
		this.DAYS_IN_MONTH_MAX = 31
		this.MONTH_MAX = 12
		this.MONTH_MIN = 1
		this.DAY_MIN = 1
		this.DAYS_IN_WEEK = 7
		this.MINUTES_IN_HOUR = 60
		this.MINUTE_MAX = 59
		this.MINUTES_IN_DAY = 24 * 60
		this.HOURS_IN_DAY = 24
		this.HOUR_MAX = 23
		this.FIRST_HOUR = 0
	}

	protected getDatesBetweenTwoDates(start: Date, end: Date) {
		for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
			arr.push(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()));
		}

		return arr;
	}

	getCurrentDate() {
		return new Date().getDate()
	}

	/**
	 * Get current month + 1, since January === 0
	 * */
	getCurrentMonth() {
		return new Date().getMonth() + 1
	}

	getCurrentYear() {
		return new Date().getFullYear()
	}

	isLeapYear(year: number): boolean {
		return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)
	}

	getAllDaysOfMonth(year: number, month: number) {
		return this.isLeapYear(year) ? this.DAYS_IN_MONTH_LEAP[month] : this.DAYS_IN_MONTH[month]
	}

	getCalendarWeekDateObjects(date: Date, firstDayShouldBe: 'sunday' | 'monday' = 'monday'): Date[] {
		const currentDate = date ? date : new Date()

		// We need to cound currentDate.getDate() - the current Nday of the week, to get the first date
		let subtractedDaysToGetFirstDate
		if (firstDayShouldBe === 'sunday') subtractedDaysToGetFirstDate = currentDate.getDay()
		else subtractedDaysToGetFirstDate = currentDate.getDay() === 0 ? 6 : (currentDate.getDay() - 1)

		const first = currentDate.getDate() - subtractedDaysToGetFirstDate; // First date is the date of the month - the day of the week
		const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), first);
		const lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + 6)

		return this.getDatesBetweenTwoDates(firstDay, lastDay)
	}
}