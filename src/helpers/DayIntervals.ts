import Time from './Time';

export type interval = {
  intervalStart: string,
  intervalEnd: string
  hasBorder?: boolean
}
/**
 * Define the data for the clickable intervals to be viewed in a calendar day.
 * */
export default class DayIntervals extends Time {
  private readonly INTERVAL_MINUTES: 15 | 30 | 60
  private readonly DAY_START_DATE_TIME_STRING: string
  HOURS_PER_DAY = 24

  constructor(
    intervalMinutes: 15 | 30 | 60,
    dayStartDateTimeString: string,
    hoursPerDay = 24,
  ) {
    super()
    this.INTERVAL_MINUTES = intervalMinutes
    this.DAY_START_DATE_TIME_STRING = dayStartDateTimeString
    this.HOURS_PER_DAY = hoursPerDay
  }

  getIntervals(): interval[] {
    const intervals = []
    const numberOfIntervalsInDay = this.HOURS_PER_DAY * (60 / this.INTERVAL_MINUTES)
    let iteratorDateTimeString = this.DAY_START_DATE_TIME_STRING

    while (intervals.length < numberOfIntervalsInDay) {
      const intervalEnd = this.addMinutesToDateTimeString(this.INTERVAL_MINUTES, iteratorDateTimeString)

      intervals.push({
        intervalStart: iteratorDateTimeString,
        intervalEnd,
        // Only show a border at the bottom of an interval, when the upcoming interval is not the start of a new hour.
        // This prevents double borders
        hasBorder: intervalEnd.substring(14, 16) !== '00'
      })

      iteratorDateTimeString = intervalEnd
    }

    return intervals
  }
}
