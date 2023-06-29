import {describe, expect, it} from "vitest";
import {WeekHelper} from "../../../src/helpers/Week";
import {TimeBuilder} from "../../../src/helpers/Time";
import {EventBuilder} from "../../../src/models/Event";

describe("WeekHelper/getNHoursIntoDayFromHour", () => {

  it('Gets nHoursIntoDayFromHour for dayBoundaries 0 - 24 and hour 8', () => {
    const expectedHoursIntoDay = 8;
    const timeInstance = new TimeBuilder().build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(8, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  })

  it('Gets nHoursIntoDayFromHour for dayBoundaries 0 - 24 and hour 0', () => {
    const expectedHoursIntoDay = 0;
    const timeInstance = new TimeBuilder().build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(0, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  });

  it('Gets nHoursIntoDayFromHour for dayBoundaries 0 - 24 and hour 23', () => {
    const expectedHoursIntoDay = 23;
    const timeInstance = new TimeBuilder().build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(23, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  });

  it('Gets nHoursIntoDayFromHour for dayBoundaries 6 - 18 and hour 9', () => {
    const expectedHoursIntoDay = 3;
    const timeInstance = new TimeBuilder().withDayBoundaries({ start: 600, end: 1800 }).build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(9, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  });

  it('Gets nHoursIntoDayFromHour for dayBoundaries 6 - 18 and hour 6', () => {
    const expectedHoursIntoDay = 0;
    const timeInstance = new TimeBuilder().withDayBoundaries({ start: 600, end: 1800 }).build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(6, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  });

  it('Gets nHoursIntoDayFromHour for dayBoundaries 6 - 3 and hour 10', () => {
    const expectedHoursIntoDay = 4;
    const timeInstance = new TimeBuilder().withDayBoundaries({ start: 600, end: 300 }).build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(10, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  });

  it('Gets nHoursIntoDayFromHour for dayBoundaries 22 - 10 and hour 2', () => {
    const expectedHoursIntoDay = 4;
    const timeInstance = new TimeBuilder().withDayBoundaries({ start: 2200, end: 1000 }).build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(2, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  })

  it('Gets nHoursIntoDayFromHour for dayBoundaries 22 - 10 and hour 22', () => {
    const expectedHoursIntoDay = 0;
    const timeInstance = new TimeBuilder().withDayBoundaries({ start: 2200, end: 1000 }).build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(22, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  })

  it('Gets nHoursIntoDayFromHour for dayBoundaries 22 - 10 and hour 23', () => {
    const expectedHoursIntoDay = 1;
    const timeInstance = new TimeBuilder().withDayBoundaries({ start: 2200, end: 1000 }).build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(23, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  });

  it('Gets nHoursIntoDayFromHour for dayBoundaries 18 - 18 and hour 9', () => {
    const expectedHoursIntoDay = 15;
    const timeInstance = new TimeBuilder().withDayBoundaries({ start: 1800, end: 1800 }).build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(9, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  })

  it('Gets nHoursIntoDayFromHour for dayBoundaries 18 - 18 and hour 18', () => {
    const expectedHoursIntoDay = 0;
    const timeInstance = new TimeBuilder().withDayBoundaries({ start: 1800, end: 1800 }).build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(18, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  });

  it('Sorts single day timed events into singleDayTimedEvents', () => {

  });
})

describe('WeekHelper/eventSeparator', () => {

  const singleDayTimedEvent1 = new EventBuilder({
    start: '2023-04-01 00:00',
    end: '2023-04-01 01:00',
  }).build();
  const singleDayTimedEvent2 = new EventBuilder({
    start: '2023-04-03 04:00',
    end: '2023-04-03 05:00',
  }).build();
  const singleDayTimedEvent3 = new EventBuilder({
    start: '2023-04-03 06:01',
    end: '2023-04-03 07:42',
  }).build();

  const multipleDayTimedEvent = new EventBuilder({
    start: '2023-04-01 00:00',
    end: '2023-04-03 01:00',
  }).build();

  const singleDayFullDayEvent = new EventBuilder({
    start: '2023-04-01',
    end: '2023-04-01',
  }).build();

  const multipleDayFullDayEvent = new EventBuilder({
    start: '2023-04-01',
    end: '2023-04-03',
  }).build();

  const events = [
    singleDayTimedEvent1,
    singleDayTimedEvent2,
    singleDayTimedEvent3,
    multipleDayTimedEvent,
    singleDayFullDayEvent,
    multipleDayFullDayEvent,
  ]

  it('sorts the events into singleDayTimedEvents, with default day boundaries', () => {
    const defaultTimeInstance = new TimeBuilder().build();
    const actualSingleDayTimedEvents = WeekHelper
      .eventSeparator(events, defaultTimeInstance).singleDayTimedEvents;
    expect(actualSingleDayTimedEvents).toHaveLength(3);
  });

  it('sorts the events into fullDayAndMultipleDayEvents, with default day boundaries', () => {
    const defaultTimeInstance = new TimeBuilder().build();
    const actualFullDayAndMultipleDayEvents = WeekHelper
      .eventSeparator(events, defaultTimeInstance).fullDayAndMultipleDayEvents;
    expect(actualFullDayAndMultipleDayEvents).toHaveLength(3);
  });

  it('sorts an event that would be hybrid for custom day boundaries into fullDayAndMultipleDayEvents', () => {
    const defaultTimeInstance = new TimeBuilder().build();
    const eventThatCouldBeHybrid = new EventBuilder({
      start: '2023-04-01 23:50',
      end: '2023-04-02 00:10',
    }).build();
    const allEvents = [...events, eventThatCouldBeHybrid];
    const actualFullDayAndMultipleDayEvents = WeekHelper
      .eventSeparator(allEvents, defaultTimeInstance).fullDayAndMultipleDayEvents;
    expect(actualFullDayAndMultipleDayEvents).toHaveLength(4);
  });

  it('sorts a hybrid event into singleDayTimedEvents for custom day boundaries', () => {
    const customTimeInstance = new TimeBuilder().withDayBoundaries({ start: 400, end: 200 }).build();
    const eventThatCouldBeHybrid = new EventBuilder({
      start: '2023-04-01 23:50',
      end: '2023-04-02 01:59',
    }).build();
    const allEvents = [...events, eventThatCouldBeHybrid];
    const actualSingleDayTimedEvents = WeekHelper
      .eventSeparator(allEvents, customTimeInstance).singleDayTimedEvents;
    expect(actualSingleDayTimedEvents).toHaveLength(4);
  });
});
