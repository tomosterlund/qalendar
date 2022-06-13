import { describe, expect, test } from "vitest";
import EventPositionHelper from "../../../src/helpers/EventPosition";
import Time from '../../../src/helpers/Time';
const eventPositionHelper = new EventPositionHelper();
const timeHelper = new Time()

describe("EventPositionHelper.ts", () => {
  let wrapper;

  /**
   * (2022-02-16T08:00:00.000Z, 800, ????) should yield 0
   *
   * */
  test("Getting beginning of the day", () => {
    const startOfDay = eventPositionHelper.getPercentageOfDayFromDateTimeString(
      "2022-02-16 08:00",
      800,
      1000
    );

    expect(startOfDay).toEqual(0);
  });

  test("Getting half hour into 4 hour day", () => {
    const halfHourIntoDay =
      eventPositionHelper.getPercentageOfDayFromDateTimeString(
        "2022-02-16 08:30",
        800,
        1200
      );

    expect(halfHourIntoDay).toEqual(12.5);
  });

  test("Getting 4 hours into 8 hour day", () => {
    const midDay = eventPositionHelper.getPercentageOfDayFromDateTimeString(
      "2022-02-16 14:00",
      1000,
      1800
    );

    expect(midDay).toEqual(50);
  });

  /**
   * 2 hours and 15 minutes = 225 points
   * (225 / 800) * 100 = 28.125
   * */
  test("Getting 2 hours and 15 minutes into 9 hour day", () => {
    const time = eventPositionHelper.getPercentageOfDayFromDateTimeString(
      "2022-02-16 12:15",
      1000,
      1800
    );

    expect(time).toEqual(28.125);
  });

  test('Position multiple day events in a week', () => {
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
});
