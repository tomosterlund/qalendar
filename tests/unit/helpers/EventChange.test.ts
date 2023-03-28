import {describe, expect, it} from "vitest";
import {TimeBuilder} from "../../../src/helpers/Time";
import {EventChange} from "../../../src/helpers/EventChange";
import {DRAG_N_RESIZE_DIRECTION} from "../../../src/typings/types";
import {EventBuilder, EventImpl} from "../../../src/models/Event";

describe("EventChange", () => {
  it('Should not be able to move event forwards, beyond day end 2400', () => {
    const time = new TimeBuilder().withDayBoundaries({
      start: 0,
      end: 2400
    }).build();

    const eventChange = new EventChange(time, '2023-03-17');

    const event = new EventBuilder(
      {
          start: '2023-03-17 23:00',
          end: '2023-03-17 23:45'
        }
    ).build()

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_N_RESIZE_DIRECTION.FORWARDS);
    expect(canBeMoved).toBe(false);
  })

  it('Should be able to move event forwards, within day end 2400', () => {
    const time = new TimeBuilder().withDayBoundaries({
      start: 0,
      end: 2400
    }).build();

    const eventChange = new EventChange(time, '2023-03-17');

    const event = new EventBuilder({
      start: '2023-03-17 23:00',
      end: '2023-03-17 23:44'
    }).build()

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_N_RESIZE_DIRECTION.FORWARDS);
    expect(canBeMoved).toBe(true);
  });

  it('Should not be able to move event backwards, behind day start 0', () => {
    const time = new TimeBuilder().withDayBoundaries({
      start: 0,
      end: 2400
    }).build();

    const eventChange = new EventChange(time, '2023-03-17');

    const event = new EventBuilder({
      start: '2023-03-17 00:00',
      end: '2023-03-17 00:45'
    }).build();

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_N_RESIZE_DIRECTION.BACKWARDS);
    expect(canBeMoved).toBe(false);
  });

  it('Should be able to move event backwards, within day with start 0', () => {
    const time = new TimeBuilder().withDayBoundaries({
      start: 0,
      end: 2400
    }).build();

    const eventChange = new EventChange(time, '2023-03-17');

    const event = new EventBuilder({
      start: '2023-03-17 00:15',
      end: '2023-03-17 00:45'
    }).build()

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_N_RESIZE_DIRECTION.BACKWARDS);
    expect(canBeMoved).toBe(true);
  });

  it('Should not be able to move event ending 2100 forwards, beyond day end 2100', () => {
    const time = new TimeBuilder().withDayBoundaries({
      start: 0,
      end: 2100
    }).build();

    const eventChange = new EventChange(time, '2023-03-17');

    const event = new EventBuilder({
      start: '2023-03-17 20:00',
      end: '2023-03-17 21:00'
    }).build();

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_N_RESIZE_DIRECTION.FORWARDS);
    expect(canBeMoved).toBe(false);
  })

  it('Should not be able to move event ending 20:46 forwards, beyond day end 2100', () => {
    const time = new TimeBuilder().withDayBoundaries({
      start: 0,
      end: 2100
    }).build();

    const eventChange = new EventChange(time, '2023-03-17');

    const event = new EventBuilder({
      start: '2023-03-17 20:00',
      end: '2023-03-17 20:46'
    }).build();

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_N_RESIZE_DIRECTION.FORWARDS);
    expect(canBeMoved).toBe(false);
  });

  it('Should be able to move event ending 20:44 forwards, within day end 2100', () => {
    const time = new TimeBuilder().withDayBoundaries({
      start: 0,
      end: 2100
    }).build();

    const eventChange = new EventChange(time, '2023-03-17');

    const event = new EventBuilder({
      start: '2023-03-17 20:00',
      end: '2023-03-17 20:45'
    }).build()

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_N_RESIZE_DIRECTION.FORWARDS);
    expect(canBeMoved).toBe(true);
  })

  it('Should be able to move event starting 06:15 backwards, within day start 06:00', () => {
    const time = new TimeBuilder().withDayBoundaries({
      start: 600,
      end: 2400
    }).build();

    const eventChange = new EventChange(time, '2023-03-17');

    const event = new EventBuilder({
      start: '2023-03-17 06:15',
      end: '2023-03-17 07:00'
    }).build()

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_N_RESIZE_DIRECTION.BACKWARDS);
    expect(canBeMoved).toBe(true);
  })

  it('Should not be able to move event starting 06:00 backwards, beyond day start 06:00', () => {
    const time = new TimeBuilder().withDayBoundaries({
      start: 600,
      end: 2400
    }).build();

    const eventChange = new EventChange(time, '2023-03-17');

    const event = new EventBuilder({
      start: '2023-03-17 06:00',
      end: '2023-03-17 07:00'
    }).build()

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_N_RESIZE_DIRECTION.BACKWARDS);
    expect(canBeMoved).toBe(false);
  })

  it('Should not be able to move event starting 06:14 backwards, beyond day start 06:00', () => {
    const time = new TimeBuilder().withDayBoundaries({
      start: 600,
      end: 2400
    }).build();

    const eventChange = new EventChange(time, '2023-03-17');

    const event = new EventBuilder({
      start: '2023-03-17 06:14',
      end: '2023-03-17 07:00'
    }).build()

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_N_RESIZE_DIRECTION.BACKWARDS);
    expect(canBeMoved).toBe(false);
  })

  it('Should not be able to move event starting 04:00 backwards, beyond flexible day starting 04:00', () => {
    const time = new TimeBuilder().withDayBoundaries(
      {
        start: 400,
        end: 400
      }
    ).build();

    const eventChange = new EventChange(time, '2023-03-17');

    const event = new EventBuilder({
      start: '2023-03-17 04:00',
      end: '2023-03-17 05:00'
    }).build()

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_N_RESIZE_DIRECTION.BACKWARDS);
    expect(canBeMoved).toBe(false);
  })

  it('Should not be able to move event starting 07:14 backwards, beyond flexible day starting 07:00', () => {
    const time = new TimeBuilder().withDayBoundaries(
      {
        start: 700,
        end: 400
      }
    ).build();

    const eventChange = new EventChange(time, '2023-03-17');

    const event = new EventBuilder({
      start: '2023-03-17 07:14',
      end: '2023-03-17 08:00'
    }).build()

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_N_RESIZE_DIRECTION.BACKWARDS);
    expect(canBeMoved).toBe(false);
  })

  it('Should be able to move event starting 01:00 backwards, within flexible day starting previous day', () => {
    const time = new TimeBuilder().withDayBoundaries(
      {
        start: 400,
        end: 400
      }
    ).build();

    const eventChange = new EventChange(time, '2023-03-17');

    const event = new EventBuilder({
      start: '2023-03-18 01:00',
      end: '2023-03-18 02:00'
    }).build()

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_N_RESIZE_DIRECTION.BACKWARDS);
    expect(canBeMoved).toBe(true);
  })

  it('Should be able to move event starting 07:15 backwards, within flexible day starting 07:00', () => {
    const time = new TimeBuilder().withDayBoundaries(
      {
        start: 700,
        end: 400
      }
    ).build();

    const eventChange = new EventChange(time, '2023-03-17');

    const event = new EventBuilder({
      start: '2023-03-17 07:15',
      end: '2023-03-17 08:00'
    }).build()

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_N_RESIZE_DIRECTION.BACKWARDS);
    expect(canBeMoved).toBe(true);
  })

  it('Should not be able to move event ending 02:00 forwards, beyond flexible day ending 02:00', () => {
    const time = new TimeBuilder().withDayBoundaries(
      {
        start: 200,
        end: 200
      }
    ).build();

    const eventChange = new EventChange(time, '2023-03-17');

    const event = new EventBuilder({
      start: '2023-03-18 01:00',
      end: '2023-03-18 02:00'
    }).build()

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_N_RESIZE_DIRECTION.FORWARDS);
    expect(canBeMoved).toBe(false);
  })

  it('Should not be able to move event ending 02:46 forwards, beyond flexible day ending 03:00', () => {
    const time = new TimeBuilder().withDayBoundaries(
      {
        start: 500,
        end: 300
      }
    ).build();

    const eventChange = new EventChange(time, '2023-03-17');

    const event = new EventBuilder({
      start: '2023-03-17 05:00',
      end: '2023-03-18 02:46'
    }).build()

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_N_RESIZE_DIRECTION.FORWARDS);
    expect(canBeMoved).toBe(false);
  })

  it('Should be able to move event ending 02:45 forwards, towards flexible day ending 03:00', () => {
    const time = new TimeBuilder().withDayBoundaries(
      {
        start: 500,
        end: 300
      }
    ).build();

    const eventChange = new EventChange(time, '2023-03-17');

    const event = new EventBuilder({
      start: '2023-03-17 05:00',
      end: '2023-03-18 02:45'
    }).build()

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_N_RESIZE_DIRECTION.FORWARDS);
    expect(canBeMoved).toBe(true);
  })

  it('Should be able to move event ending 23:59 forwards, towards flexible day ending 03:00', () => {
    const time = new TimeBuilder().withDayBoundaries(
      {
        start: 500,
        end: 300
      }
    ).build();

    const eventChange = new EventChange(time, '2023-03-17');

    const event = new EventBuilder({
      start: '2023-03-17 05:00',
      end: '2023-03-17 23:59'
    }).build()

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_N_RESIZE_DIRECTION.FORWARDS);
    expect(canBeMoved).toBe(true);
  })
});
