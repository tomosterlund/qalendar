/**
 * The following class contains methods for calculating where to position
 * calendar events within a given day
 * */
import {eventInterface} from '../typings/interfaces/event.interface';
import Time from './Time';
// IMPORTANT: this instance of Time, should not be used for anything sensitive to "locale" or "firstDayOfWeekIs"
const TimeHelper = new Time()

export default class EventPosition {
  protected turnMinutesIntoPercentageOfHour(minutes: number): string {
    const oneMinutePercentage = 100 / 60;

    const minutePoints = oneMinutePercentage * minutes;

    if (minutePoints < 10) return "0" + minutePoints;

    return minutePoints.toString();
  }

  /**
   * Every hour between 'dayStart' and 'dayEnd' is 100, in this function referred to as 100 points
   * If an event starts 30 minutes after 'dayStart', it should have 50 pointsIntoDay
   * If a day consists of 4 hours (400 points), we then have to count
   * (50 / 400) * 100 = 12.5 => event starts after 12.5 percent of the day
   *
   * Result is supposed to be a number between 0 and 100, and is used for setting the CSS- top- and height-attributes for events
   * */
  getPercentageOfDayFromDateTimeString(
    dateTimeString: string,
    dayStart: number,
    dayEnd: number
  ) {
    const pointsInDay = dayEnd - dayStart;
    const hour = dateTimeString.substring(11, 13);
    const minutes = dateTimeString.substring(14, 16);
    const minutesPoints = this.turnMinutesIntoPercentageOfHour(+minutes);
    const eventPoints = +(hour + minutesPoints);
    const eventPointsIntoDay = eventPoints - dayStart;

    return (eventPointsIntoDay / pointsInDay) * 100;
  }

  positionFullDayEventsInWeek(weekStart: Date, weekEnd: Date, events: eventInterface[]) {
    // 1. add an array 'allDates', to all events
    const eventsWithDatesSpan = events.map((e: eventInterface) => {
      const { year: startYear, month: startMonth, date: startDate } = TimeHelper.getAllVariablesFromDateTimeString(e.time.start)
      const { year: endYear, month: endMonth, date: endDate } = TimeHelper.getAllVariablesFromDateTimeString(e.time.end)
      e.timeJS = {
        start: new Date(startYear, startMonth, startDate),
        end: new Date(endYear, endMonth, endDate),
      }

      return e
    }).sort((a, b) => {
      if (a.time.start < b.time.start) return -1;
      if (a.time.start > b.time.start) return 1;

      return 0
    })

    // 2. create a week array, where each day is represented as an object with different levels, level1, level2, level3, level4 etc.
    // An event starts on a certain level, the first day when it occurs, and then blocks that level for the rest of its duration
    const allDatesOfWeek = TimeHelper.getDatesBetweenTwoDates(weekStart, weekEnd)
    const week: { date: Date; [key: string]: object|string }[] = allDatesOfWeek.map(d => ({ date: d }))

    for (const e of eventsWithDatesSpan) {
      for (const [dayIndex, day] of week.entries()) {
        const nOfLevelsInDay = Object.entries(day).length

        // @ts-ignore
        if (TimeHelper.getDateStringFromDate(e.timeJS.start) <= TimeHelper.getDateStringFromDate(day.date)) {
          // 2A. If time.start is less than or equal the day, set the event on this day
          week[dayIndex][`level${nOfLevelsInDay}`] = e

          // 2B. And block the specified level, for the following days of the event
          // @ts-ignore
          let eventNDays = Math.ceil((e.timeJS.end.getTime() - day.date.getTime()) / TimeHelper.MS_PER_DAY)
          const remainingDaysOfWeek = (week.length - (dayIndex + 1))
          if (eventNDays > remainingDaysOfWeek) eventNDays = remainingDaysOfWeek

          for (let i = 1; i < eventNDays; i++) {
            week[dayIndex][`level${nOfLevelsInDay}`] = 'blocked'
          }

          break
        }
      }
    }

    return week
  }
}
