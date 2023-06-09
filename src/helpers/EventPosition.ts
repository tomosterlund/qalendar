/**
 * The following class contains methods for calculating where to position
 * calendar events within a given day
 * */
import type {eventInterface} from '../typings/interfaces/event.interface';
import Time from './Time';
import type {fullDayEventsWeek} from '../typings/interfaces/full-day-events-week.type';
import type {dayInterface} from '../typings/interfaces/day.interface';

interface eventWithJSDatesInterface extends eventInterface {
  timeJS: {
    start: Date,
    end: Date,
  }
}

export default class EventPosition extends Time {
  /**
   * Yields a full calendar week, with all full-day events positioned in it
   * */
  positionFullDayEventsInWeek(weekStart: Date, weekEnd: Date, events: eventInterface[]) {
    // 1. add timeJS.start and timeJS.end to all objects
    const eventsWithJSDates: eventWithJSDatesInterface[] = events.map((scheduleEvent: eventInterface) => {
      const { year: startYear, month: startMonth, date: startDate } = this.getAllVariablesFromDateTimeString(scheduleEvent.time.start)
      const { year: endYear, month: endMonth, date: endDate } = this.getAllVariablesFromDateTimeString(scheduleEvent.time.end)
      scheduleEvent.timeJS = {
        start: new Date(startYear, startMonth, startDate),
        end: new Date(endYear, endMonth, endDate),
      }

      return scheduleEvent as eventWithJSDatesInterface
    }).sort((a, b) => {
      if (a.time.start < b.time.start) return -1;
      if (a.time.start > b.time.start) return 1;

      return 0
    })

    // 2. create a week array, where each day is represented as an object with different levels, level1, level2, level3, level4 etc.
    // An event starts on a certain level, the first day when it occurs, and then blocks that level for the rest of its duration
    const allDatesOfWeek = this.getDatesBetweenTwoDates(weekStart, weekEnd)
    const week: fullDayEventsWeek = allDatesOfWeek.map(d => ({ date: d }))

    for (const scheduleEvent of eventsWithJSDates) {
      for (const [dayIndex, day] of week.entries()) {
        const thisDayDateString = this.getDateStringFromDate(day.date)

        if (
          this.getDateStringFromDate(scheduleEvent.timeJS.start) <= thisDayDateString
          && this.getDateStringFromDate(scheduleEvent.timeJS.end) >= thisDayDateString
        ) {
          // 2A. Get the first free level of the day
          let levelToStartOn = 1
          while (typeof week[dayIndex][`level${levelToStartOn}`] !== 'undefined') {
            levelToStartOn++
          }

          // 2B. set the event on this day
          let eventNDays = (Math.ceil((scheduleEvent.timeJS.end.getTime() - day.date.getTime()) / this.MS_PER_DAY) + 1) // Get difference in days, plus the first day itself
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

    const weekWithSortedLevelsInDays = []

    // 3. Sort the levels of the day objects
    for (const day of week) {
      weekWithSortedLevelsInDays.push(Object.keys(day).sort().reduce(
        (obj: any, key: any) => {
          obj[key] = day[key];
          return obj;
        },
        {}
      ))
    }

    return weekWithSortedLevelsInDays
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
    flatMonth.forEach(day => monthMap.set(this.dateStringFrom(day.dateTimeString), day))
    // Sort events with the latest first. This will help the algorithm place the oldest events at the start of each "events" array later
    fullDayEvents = fullDayEvents.sort((a, b) => {
      if (a.time.start < b.time.start) return 1;
      if (a.time.start > b.time.start) return -1;

      return 0
    })

    for (const fullDayEvent of fullDayEvents) {
      const { year: startYear, month: startMonth, date: startDate } = this.getAllVariablesFromDateTimeString(fullDayEvent.time.start)
      const { year: endYear, month: endMonth, date: endDate } = this.getAllVariablesFromDateTimeString(fullDayEvent.time.end)
      const allDatesOfEvent = this.getDatesBetweenTwoDates(
        new Date(startYear, startMonth, startDate),
        new Date(endYear, endMonth, endDate),
      )

      for (const date of allDatesOfEvent) {
        const dateString = this.getDateStringFromDate(date)
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
