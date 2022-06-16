/**
 * The following class contains methods for calculating where to position
 * calendar events within a given day
 * */
import {eventInterface} from '../typings/interfaces/event.interface';
import Time from './Time';
import {fullDayEventsWeek} from '../typings/interfaces/full-day-events-week.type';
import {dayInterface} from '../typings/interfaces/day.interface';
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

  /**
   * Yields a full calendar week, with all full-day events positioned in it
   * */
  positionFullDayEventsInWeek(weekStart: Date, weekEnd: Date, events: eventInterface[]) {
    // 1. add timeJS.start and timeJS.end to all objects
    const eventsWithJSDates = events.map((scheduleEvent: eventInterface) => {
      const { year: startYear, month: startMonth, date: startDate } = TimeHelper.getAllVariablesFromDateTimeString(scheduleEvent.time.start)
      const { year: endYear, month: endMonth, date: endDate } = TimeHelper.getAllVariablesFromDateTimeString(scheduleEvent.time.end)
      scheduleEvent.timeJS = {
        start: new Date(startYear, startMonth, startDate),
        end: new Date(endYear, endMonth, endDate),
      }

      return scheduleEvent
    }).sort((a, b) => {
      if (a.time.start < b.time.start) return -1;
      if (a.time.start > b.time.start) return 1;

      return 0
    })

    // 2. create a week array, where each day is represented as an object with different levels, level1, level2, level3, level4 etc.
    // An event starts on a certain level, the first day when it occurs, and then blocks that level for the rest of its duration
    const allDatesOfWeek = TimeHelper.getDatesBetweenTwoDates(weekStart, weekEnd)
    const week: fullDayEventsWeek = allDatesOfWeek.map(d => ({ date: d }))

    for (const scheduleEvent of eventsWithJSDates) {
      for (const [dayIndex, day] of week.entries()) {
        const thisDayDateString = TimeHelper.getDateStringFromDate(day.date)

        if (
          // @ts-ignore
          TimeHelper.getDateStringFromDate(scheduleEvent.timeJS.start) <= thisDayDateString
          // @ts-ignore
          && TimeHelper.getDateStringFromDate(scheduleEvent.timeJS.end) >= thisDayDateString
        ) {
          // 2A. Get the first free level of the day
          let levelToStartOn = 1
          while (typeof week[dayIndex][`level${levelToStartOn}`] !== 'undefined') {
            levelToStartOn++
          }

          // 2B. set the event on this day
          // @ts-ignore
          let eventNDays = (Math.ceil((scheduleEvent.timeJS.end.getTime() - day.date.getTime()) / TimeHelper.MS_PER_DAY) + 1) // Get difference in days, plus the first day itself
          const remainingDaysOfWeek = (week.length - dayIndex)
          if (eventNDays > remainingDaysOfWeek) eventNDays = remainingDaysOfWeek

          week[dayIndex][`level${levelToStartOn}`] = {
            ...scheduleEvent,
            nDays: eventNDays, // Denotes the number of days to display in the week, not the actual number of days
          }

          // 2C. And block the specified level, for the following days of the event
          for (let i = 1; i < eventNDays; i++) {
            week[dayIndex + i][`level${levelToStartOn}`] = 'blocked'
          }

          break
        }
      }
    }

    return week
  }

  positionFullDayEventsInMonth(
    calendarMonth: dayInterface[][],
    fullDayEvents: eventInterface[]
  ): dayInterface[][] {
    const newMonth: dayInterface[][] = []
    const flatMonth = calendarMonth.flat()
    // Create a map, where each key is a dateString in the format of YYYY-MM-DD, and the value is the calendarDay. This will help us skip 2 levels of nested loops.
    // Instead of iterating over the following units for => week of calendarMonth => day of week => event of fullDayEvents => date of allDatesOfEvent
    // we can stay on 2 levels of nesting with for => fullDayEvent of fullDayEvents => date of allDatesOfEvent, and then see if the map has a matching date
    const monthMap = new Map()
    flatMonth.forEach(day => monthMap.set(day.dateTimeString.substring(0, 10), day))
    // Sort events with the latest first. This will help the algorithm place the oldest events at the start of each "events" array later
    fullDayEvents = fullDayEvents.sort((a, b) => {
      if (a.time.start < b.time.start) return 1;
      if (a.time.start > b.time.start) return -1;

      return 0
    })
    
    for (const fullDayEvent of fullDayEvents) {
      const { year: startYear, month: startMonth, date: startDate } = TimeHelper.getAllVariablesFromDateTimeString(fullDayEvent.time.start)
      const { year: endYear, month: endMonth, date: endDate } = TimeHelper.getAllVariablesFromDateTimeString(fullDayEvent.time.end)
      const allDatesOfEvent = TimeHelper.getDatesBetweenTwoDates(
        new Date(startYear, startMonth, startDate),
        new Date(endYear, endMonth, endDate),
      )

      for (const date of allDatesOfEvent) {
        const dateString = TimeHelper.getDateStringFromDate(date)
        const dateInMap = monthMap.get(dateString)

        if (dateInMap) monthMap.set(dateString, {
          ...dateInMap,
          // Since we're iterating over the fullDayEvents sorted backwards, the earliest events will end up first (which is the wanted behavior)
          events: [fullDayEvent, ...dateInMap.events]
        })
      }
    }

    let weekIterator = 0

    monthMap.forEach(day => {
      // For the very first day, create an array for the first week, and push day onto it
      if ( ! newMonth.length) newMonth.push([day])

      // When the week exists, and is not yet filled with 7 days, push day onto week
      else if (newMonth[weekIterator] && newMonth[weekIterator].length < 7) newMonth[weekIterator].push(day)

      // When the week exists, but is full, create a new week with the day in it, and increment the week iterator
      else if (newMonth[weekIterator] && newMonth[weekIterator].length === 7) {
        newMonth.push([day])
        weekIterator++
      }
    })

    return newMonth
  }
}
