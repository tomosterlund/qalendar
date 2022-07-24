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
  private readonly DATE_TIME_STRING: string

  constructor(
    intervalMinutes: 15 | 30 | 60,
    dateTimeString: string
  ) {
    super()
    this.INTERVAL_MINUTES = intervalMinutes
    this.DATE_TIME_STRING = dateTimeString
  }

  getIntervals(): interval[] {
    const intervals = []
    const numberOfIntervalsInDay = 24 * (60 / this.INTERVAL_MINUTES)
    let iteratorDateTimeString = this.DATE_TIME_STRING

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