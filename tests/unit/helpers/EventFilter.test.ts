import {describe, expect, it} from "vitest";
import Time, {WEEK_START_DAY} from "../../../src/helpers/Time";
import {EventsFilter} from "../../../src/helpers/EventsFilter";

describe("EventFilter", () => {
  const events = [
    { id: 1, title: 'foo', time: { start: '2023-03-11 12:00', end: '2023-03-11 13:00' } },
    { id: 1, title: 'foo', time: { start: '2023-03-11 12:30', end: '2023-03-11 12:45' } },
    { id: 1, title: 'foo', time: { start: '2023-03-11 13:30', end: '2023-03-11 14:00' } },
    { id: 1, title: 'foo', time: { start: '2023-03-11 16:30', end: '2023-03-11 17:00' } },
    { id: 1, title: 'foo', time: { start: '2023-03-12 13:30', end: '2023-03-12 14:00' } },
    { id: 1, title: 'foo', time: { start: '2023-03-12 23:30', end: '2023-03-12 23:59' } },
    { id: 1, title: 'foo', time: { start: '2023-03-13 00:00', end: '2023-03-13 00:01' } },

    { id: 1, title: 'foo', time: { start: '2023-03-15 01:00', end: '2023-03-15 02:00' } },
    { id: 1, title: 'foo', time: { start: '2023-03-15 02:00', end: '2023-03-15 03:00' } },
    { id: 1, title: 'foo', time: { start: '2023-03-15 03:00', end: '2023-03-15 04:00' } },
    { id: 1, title: 'foo', time: { start: '2023-03-15 06:00', end: '2023-03-15 07:00' } },
    { id: 1, title: 'foo', time: { start: '2023-03-15 06:00', end: '2023-03-15 08:00' } },
    { id: 1, title: 'foo', time: { start: '2023-03-16 01:00', end: '2023-03-16 02:00' } },
    { id: 1, title: 'foo', time: { start: '2023-03-16 02:00', end: '2023-03-16 02:30' } },
    { id: 1, title: 'foo', time: { start: '2023-03-16 04:00', end: '2023-03-16 05:30' } },
  ];

  it('Filters events for a full day', () => {
    const timeInstance = new Time();
    const startDateTimeString = '2023-03-11 00:00';

    const eventsForDay = new EventsFilter(events)
      .getEventsForDay(timeInstance, startDateTimeString);

    expect(eventsForDay).toHaveLength(4);
    expect(eventsForDay[0].time.start).toBe('2023-03-11 12:00');
    expect(eventsForDay[1].time.start).toBe('2023-03-11 12:30');
    expect(eventsForDay[2].time.start).toBe('2023-03-11 13:30');
  });

  it('Filters events for a partial day', () => {
    const timeInstance = new Time(
      WEEK_START_DAY.MONDAY,
        'de',
      { start: 1300, end: 2300 }
      );
    const startDateTimeString = '2023-03-11 00:00';

    const eventsForDay = new EventsFilter(events).getEventsForDay(timeInstance, startDateTimeString);

    expect(eventsForDay).toHaveLength(2);
    expect(eventsForDay[0].time.start).toBe('2023-03-11 13:30');
    expect(eventsForDay[1].time.start).toBe('2023-03-11 16:30');
  });

  it('Filters events for a partial day starting on 6AM and ending 2AM', () => {
    const timeInstance = new Time(
      WEEK_START_DAY.MONDAY,
        'de',
      { start: 600, end: 200 }
      );
    const startDateTimeString = '2023-03-15 00:00';

    const eventsForDay = new EventsFilter(events).getEventsForDay(timeInstance, startDateTimeString);

    expect(eventsForDay).toHaveLength(3);
    expect(eventsForDay[0].time.start).toBe('2023-03-15 06:00');
    expect(eventsForDay[1].time.start).toBe('2023-03-15 06:00');
    expect(eventsForDay[2].time.start).toBe('2023-03-16 01:00');
  });
});
