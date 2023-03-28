import {describe, expect, it} from "vitest";
import {EVENT_TYPE} from "../../../src/typings/interfaces/event.interface";
import Helpers from "../../../src/helpers/Helpers";
import Time from "../../../src/helpers/Time";

describe("Helpers", () => {
  it('should get the type from a timed single day event', () => {
    const timedSingleDayEvent = {
      time: {
        start: '2021-09-01 10:00',
        end: '2021-09-01 11:00'
      },
      id: 1,
      title: 'Foo',
    }

    const expectedType = EVENT_TYPE.SINGLE_DAY_TIMED;
    const actualType = Helpers.getEventType(timedSingleDayEvent, new Time());
    expect(actualType).toBe(expectedType);
  });

  it('should get the type from a full day single day event', () => {
    const fullDaySingleDayEvent = {
      time: {
        start: '2021-09-01',
        end: '2021-09-01'
      },
      id: 1,
      title: 'Foo',
    }

    const expectedType = EVENT_TYPE.SINGLE_DAY_FULL_DAY;
    const actualType = Helpers.getEventType(fullDaySingleDayEvent, new Time());
    expect(actualType).toBe(expectedType);
  });

  it('should get the type from a timed multi day event', () => {
    const timedMultiDayEvent = {
      time: {
        start: '2021-09-01 10:00',
        end: '2021-09-02 11:00'
      },
      id: 1,
      title: 'Foo',
    }

    const expectedType = EVENT_TYPE.MULTI_DAY_TIMED;
    const actualType = Helpers.getEventType(timedMultiDayEvent, new Time());
    expect(actualType).toBe(expectedType);
  });

  it('should get the type from a full day multi day event', () => {
    const fullDayMultiDayEvent = {
      time: {
        start: '2021-09-01',
        end: '2021-09-02'
      },
      id: 1,
      title: 'Foo',
    }

    const expectedType = EVENT_TYPE.MULTI_DAY_FULL_DAY;
    const actualType = Helpers.getEventType(fullDayMultiDayEvent, new Time());
    expect(actualType).toBe(expectedType);
  });

  it('Throws an error if the event has an invalid type', () => {
    const invalidEvent = {
      time: {
        start: '2021-09-01',
        end: '2021-09-02 11:00'
      },
      id: 1,
      title: 'Foo',
    }

    expect(() => Helpers.getEventType(invalidEvent, new Time())).toThrowError('Event has invalid type');
  });
});
