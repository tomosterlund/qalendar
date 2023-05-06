import {describe, expect, it} from "vitest";
import {EVENT_TYPE} from "../../../src/typings/interfaces/event.interface";
import Helpers from "../../../src/helpers/Helpers";
import Time, {TimeBuilder} from "../../../src/helpers/Time";
import {EventBuilder} from "../../../src/models/Event";

describe("Helpers/getEventType", () => {
  it('should get the type from a timed single day event', () => {
    const timedSingleDayEvent = new EventBuilder({
      start: '2021-09-01 10:00',
      end: '2021-09-01 11:00'
    }).build()

    const expectedType = EVENT_TYPE.SINGLE_DAY_TIMED;
    const actualType = Helpers.getEventType(timedSingleDayEvent, new Time());
    expect(actualType).toBe(expectedType);
  });

  it('should get the type from a full day single day event', () => {
    const fullDaySingleDayEvent = new EventBuilder({
      start: '2021-09-01',
      end: '2021-09-01'
    }).build()

    const expectedType = EVENT_TYPE.SINGLE_DAY_FULL_DAY;
    const actualType = Helpers.getEventType(fullDaySingleDayEvent, new Time());
    expect(actualType).toBe(expectedType);
  });

  it('should get the type from a timed multi day event', () => {
    const timedMultiDayEvent = new EventBuilder({
      start: '2021-09-01 10:00',
      end: '2021-09-02 11:00'
    }).build()

    const expectedType = EVENT_TYPE.MULTI_DAY_TIMED;
    const actualType = Helpers.getEventType(timedMultiDayEvent, new Time());
    expect(actualType).toBe(expectedType);
  });

  it('should get the type from a full day multi day event', () => {
    const fullDayMultiDayEvent = new EventBuilder({
      start: '2021-09-01',
      end: '2021-09-02'
    }).build()

    const expectedType = EVENT_TYPE.MULTI_DAY_FULL_DAY;
    const actualType = Helpers.getEventType(fullDayMultiDayEvent, new Time());
    expect(actualType).toBe(expectedType);
  });

  it('should get the type from a single hybrid day timed event', () => {
    const timeInstance = new TimeBuilder().withDayBoundaries({ start: 400, end: 300 }).build();
    const event = new EventBuilder(
      { start: '2023-03-31 23:00', end: '2023-04-01 02:59' }
    ).build();
    const expectedType = EVENT_TYPE.SINGLE_HYBRID_DAY_TIMED;
    const actualType = Helpers.getEventType(event, timeInstance);
    expect(actualType).toBe(expectedType);
  });

  it('should get the type from a multi day timed event, too long to be hybrid', () => {
    const timeInstance = new TimeBuilder().withDayBoundaries({ start: 400, end: 300 }).build();
    const event = new EventBuilder(
      { start: '2023-03-31 23:00', end: '2023-04-02 03:01' }
    ).build();
    const expectedType = EVENT_TYPE.MULTI_DAY_TIMED;
    const actualType = Helpers.getEventType(event, timeInstance);
    expect(actualType).toBe(expectedType);
  })

  it('Throws an error if the event has an invalid type', () => {
    const invalidEvent = new EventBuilder({
      start: '2021-09-01',
      end: '2021-09-02 11:00'
    }).build()

    expect(() => Helpers.getEventType(invalidEvent, new Time())).toThrowError('Event has invalid type');
  });
});

describe('Helpers/isUIEventTouchEvent', () => {
  it('should return true if event is a touch event', () => {
    const event = new TouchEvent('touchstart');
    const isTouchEvent = Helpers.isUIEventTouchEvent(event);
    expect(isTouchEvent).toBe(true);
  })

  it('should return false if event is not a touch event', () => {
    const event = new MouseEvent('click');
    const isTouchEvent = Helpers.isUIEventTouchEvent(event);
    expect(isTouchEvent).toBe(false);
  });
});
