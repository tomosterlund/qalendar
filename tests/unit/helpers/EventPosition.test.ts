import { describe, expect, test } from "vitest";
import EventPositionHelper from "../../../src/helpers/EventPosition";
import Time from '../../../src/helpers/Time';
const eventPositionHelper = new EventPositionHelper();
const timeHelper = new Time()

describe("EventPositionHelper.ts", () => {
  test('Position full-day events in week (all events are in week)', () => {
    const e1 = { time: { start: '2022-06-13', end: '2022-06-14' }, id: 1, title: 'Foo' }
    const e2 = { time: { start: '2022-06-14', end: '2022-06-17' }, id: 1, title: 'Bar' }
    const e3 = { time: { start: '2022-06-16', end: '2022-06-18' }, id: 1, title: 'Baz' }

    const week = eventPositionHelper.positionFullDayEventsInWeek(
      new Date(2022, (6 - 1), 13),
      new Date(2022, (6 - 1), 19),
      [e1, e2, e3]
    )
    expect(week).toHaveLength(7)
    expect(timeHelper.getDateStringFromDate(week[0].date)).toBe('2022-06-13')
    expect(timeHelper.getDateStringFromDate(week[1].date)).toBe('2022-06-14')
    expect(timeHelper.getDateStringFromDate(week[2].date)).toBe('2022-06-15')

    for (const day of week) {
      expect(day).toHaveProperty('date')
    }

    // DAY 1: Expect the first day to only have 1 level, since only 1 event occurs here
    expect(week[0]).toHaveProperty('level1')
    expect(week[0]).not.toHaveProperty('level2')
    // @ts-ignore
    expect(week[0]['level1'].time.start).toBe('2022-06-13')
    // @ts-ignore
    expect(week[0]['level1'].time.end).toBe('2022-06-14')
    expect(week[1]['level1']).toBe('blocked')

    // DAY 2: Expect the second day to have two levels, since both e1 and e2 happen this day
    expect(week[1]).toHaveProperty('level2')
    expect(week[1]).not.toHaveProperty('level3')
    // @ts-ignore
    expect(week[1]['level2'].time.start).toBe('2022-06-14')

    // DAY 3: Expect the third day to only have e2, on level2
    expect(week[2]).not.toHaveProperty('level1')
    expect(week[2]).toHaveProperty('level2')
    expect(week[2]).not.toHaveProperty('level3')

    // DAY 4: Expect the fourth day to have e2 on level2, and e3 on level1
    expect(week[3]).toHaveProperty('level1')
    expect(week[3]).toHaveProperty('level2')
    expect(week[3]).not.toHaveProperty('level3')
    // @ts-ignore
    expect(week[3]['level1'].time.start).toBe('2022-06-16')
    expect(week[3]['level2']).toBe('blocked')

    // DAY 5: Expect fifth day to have e2 block level2, and e3 to block level1
    expect(week[4]['level1']).toBe('blocked')
    expect(week[4]['level2']).toBe('blocked')
    expect(week[4]).not.toHaveProperty('level3')

    // DAY 6: Expect sixth day to have e3 block level 1
    expect(week[5]['level1']).toBe('blocked')
    expect(week[5]).not.toHaveProperty('level2')

    // DAY 7: Expect no levels to be blocked or occupied
    expect(week[6]['level1']).toBeUndefined()
    expect(week[6]['level2']).toBeUndefined()
  })

  test('Position full-day events in week (with events starting before week)', () => {
    const e1 = { time: { start: '2021-12-01', end: '2022-01-01' }, id: 1, title: 'Foo' }
    const e2 = { time: { start: '2021-12-28', end: '2021-12-28' }, id: 1, title: 'Bar' }
    const e3 = { time: { start: '2021-12-28', end: '2022-01-02' }, id: 1, title: 'Baz' }
    const e4 = { time: { start: '2021-12-30', end: '2021-12-30' }, id: 1, title: 'Beep' }
    const e5 = { time: { start: '2021-12-30', end: '2022-01-07' }, id: 1, title: 'Boop' }
    const e6 = { time: { start: '2021-12-30', end: '2022-01-01' }, id: 1, title: 'Bloop' }

    const week = eventPositionHelper.positionFullDayEventsInWeek(
      new Date(2021, (12 - 1), 27),
      new Date(2022, (1 - 1), 2),
      [e1, e2, e3, e4, e5, e6]
    )

    expect(week).toHaveLength(7)

    for (const day of week) {
      expect(day).toHaveProperty('date')
    }

    // DAY 1 (Dec 27th): level1 should be occupied by e1
    expect(week[0]).toHaveProperty('level1')
    expect(week[0].level1.time.start).toBe('2021-12-01')
    expect(week[0].level1.time.end).toBe('2022-01-01')
    expect(week[0]).not.toHaveProperty('level2')

    // DAY  2 (Dec 28th): level 1 should be blocked, level2===e2 and level3===e3
    expect(week[1].level1).toBe('blocked')
    expect(week[1].level2.time.start).toBe('2021-12-28')
    expect(week[1].level2.time.end).toBe('2021-12-28')
    expect(week[1].level3.time.start).toBe('2021-12-28')
    expect(week[1].level3.time.end).toBe('2022-01-02')
    expect(week[1]).not.toHaveProperty('level4')

    // DAY 3 (Dec 29th): level1 and level3 should be blocked
    expect(week[2].level1).toBe('blocked')
    expect(week[2]).not.toHaveProperty('level2')
    expect(week[2].level3).toBe('blocked')
    expect(week[2]).not.toHaveProperty('level4')

    // DAY 4 (Dec 30th): level1 and level3 blocked, level2, level4 and level5 occupied
    expect(week[3].level1).toBe('blocked')
    expect(week[3].level3).toBe('blocked')
    expect(week[3].level2.time.start).toBe('2021-12-30')
    expect(week[3].level2.time.end).toBe('2021-12-30')
    expect(week[3].level2.title).toBe('Beep')
    expect(week[3].level4.time.start).toBe('2021-12-30')
    expect(week[3].level4.time.end).toBe('2022-01-07')
    expect(week[3].level5.time.start).toBe('2021-12-30')
    expect(week[3].level5.time.end).toBe('2022-01-01')

    // DAY 5 (Dec 31th): level1, level3, level4 & level5 blocked
    for (const level of ['level1', 'level3', 'level4', 'level5']) {
      expect(week[4][level]).toBe('blocked')
    }
    expect(week[4].level2).toBeUndefined()
    expect(week[4].level6).toBeUndefined()

    // DAY 6 (Jan 1st): level1, level3, level4 & level5 blocked
    for (const level of ['level1', 'level3', 'level4', 'level5']) {
      expect(week[5][level]).toBe('blocked')
    }
    expect(week[5].level2).toBeUndefined()
    expect(week[5].level6).toBeUndefined()

    // DAY 7 (Jan 2nd): level3 and level5 blocked, the rest free
    expect(week[6].level3).toBe('blocked')
    expect(week[6].level4).toBe('blocked')
  })

  test('Position full-day events in week (with events fully outside of week)', () => {
    const e1 = { time: { start: '2020-08-30', end: '2020-09-30' }, id: 1, title: 'Foo' } // Before period start
    const e2 = { time: { start: '2021-07-30', end: '2021-08-25' }, id: 1, title: 'Bar' } // Before period start
    const e3 = { time: { start: '2021-08-29', end: '2021-08-29' }, id: 1, title: 'Baz' } // Before period start
    const e4 = { time: { start: '2021-08-30', end: '2021-09-05' }, id: 1, title: 'Baz' } // first until last day of week
    const e5 = { time: { start: '2021-09-06', end: '2021-09-10' }, id: 1, title: 'Baz' } // after week

    const week = eventPositionHelper.positionFullDayEventsInWeek(
      new Date(2021, (8 - 1), 30),
      new Date(2021, (9 - 1), 5),
      [e1, e2, e3, e4, e5]
    )

    expect(week).toHaveLength(7)

    for (const day of week) {
      expect(day).toHaveProperty('date')
    }

    // DAY 1 (Sep 30th): level1===e4, the rest undefined
    expect(week[0].level1.time.start).toBe(e4.time.start)
    expect(week[0].level1.time.end).toBe(e4.time.end)
    expect(week[0].level2).toBeUndefined()

    for (const dayIndex of [1, 2, 3, 4, 5, 6]) {
      expect(week[dayIndex].level1).toBe('blocked')
      expect(week[dayIndex].level2).toBeUndefined()
    }
  })

  test('position full-day events in a calendar month', () => {
    const events = [
      { id: 1, title: 'Foo', time: { start: '2022-01-01', end: '2022-01-31' } },
      { id: 2, title: 'Bar', time: { start: '2022-01-02', end: '2022-01-02' } },
      { id: 2, title: 'Baz', time: { start: '2022-01-05', end: '2022-01-10' } },
    ]
    const month = timeHelper.getCalendarMonthSplitInWeeks(2022, 0).map(week => {
      return week.map(day => {
        return {
          dayName: timeHelper.getLocalizedNameOfWeekday(day),
          dateTimeString: timeHelper.getDateTimeStringFromDate(day),
          events: [],
        }
      })
    })
    const monthWithFullDayEvents = eventPositionHelper.positionFullDayEventsInMonth(month, events)
    const firstWeek = monthWithFullDayEvents[0]
    const secondWeek = monthWithFullDayEvents[1]
    const thirdWeek = monthWithFullDayEvents[2]
    const sixthWeek = monthWithFullDayEvents[5]

    // Expect the event that start earliest, to occupy index 0 of every "events" array that it should fill
    expect(firstWeek[5].events[0].title).toBe('Foo') // Jan 1st
    expect(sixthWeek[0].events[0].title).toBe('Foo') // Jan 31st

    expect(firstWeek[6].events[1].title).toBe('Bar') // Jan 2nd

    expect(secondWeek[2].events[1].title).toBe('Baz') // Jan 5th
    expect(secondWeek[3].events[1].title).toBe('Baz') // Jan 6th
    expect(secondWeek[4].events[1].title).toBe('Baz') // Jan 7th
    expect(secondWeek[5].events[1].title).toBe('Baz') // Jan 8th
    expect(secondWeek[6].events[1].title).toBe('Baz') // Jan 9th
    expect(thirdWeek[0].events[1].title).toBe('Baz') // Jan 1oth
  })
});
