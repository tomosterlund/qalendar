import {describe, expect, it} from "vitest";
import {TimeBuilder} from "../../../src/helpers/Time";
import {EventChange} from "../../../src/helpers/EventChange";
import {DRAG_DIRECTION} from "../../../src/typings/types";

describe("EventChange", () => {
  it('Should not be able to move event forwards, beyond day end 2400', () => {
    const time = new TimeBuilder().withDayBoundaries({
      start: 0,
      end: 2400
    }).build();

    const eventChange = new EventChange(time);

    const event = {
      time: {
        start: '2023-03-17 23:00',
        end: '2023-03-17 23:45'
      },
      id: 1,
      title: 'Test event'
    }

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_DIRECTION.FORWARDS);
    expect(canBeMoved).toBe(false);
  })

  it('Should be able to move event forwards, within day end 2400', () => {
    const time = new TimeBuilder().withDayBoundaries({
      start: 0,
      end: 2400
    }).build();

    const eventChange = new EventChange(time);

    const event = {
      time: {
        start: '2023-03-17 23:00',
        end: '2023-03-17 23:44'
      },
      id: 1,
      title: 'Test event'
    }

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_DIRECTION.FORWARDS);
    expect(canBeMoved).toBe(true);
  });

  it('Should not be able to move event backwards, behind day start 0', () => {
    const time = new TimeBuilder().withDayBoundaries({
      start: 0,
      end: 2400
    }).build();

    const eventChange = new EventChange(time);

    const event = {
      time: {
        start: '2023-03-17 00:00',
        end: '2023-03-17 00:45'
      },
      id: 1,
      title: 'Test event'
    }

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_DIRECTION.BACKWARDS);
    expect(canBeMoved).toBe(false);
  });

  it('Should be able to move event backwards, within day with start 0', () => {
    const time = new TimeBuilder().withDayBoundaries({
      start: 0,
      end: 2400
    }).build();

    const eventChange = new EventChange(time);

    const event = {
      time: {
        start: '2023-03-17 00:15',
        end: '2023-03-17 00:45'
      },
      id: 1,
      title: 'Test event'
    }

    const canBeMoved = eventChange.canEventBeMoved(event, DRAG_DIRECTION.BACKWARDS);
    expect(canBeMoved).toBe(true);
  });
});
