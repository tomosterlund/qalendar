import { describe, expect, test } from "vitest";
import EventConcurrencyHelper from "../../../src/helpers/EventConcurrency";
import { eventInterface } from "../../../src/typings/interfaces/event.interface";

const eventConcurrencyHelper = new EventConcurrencyHelper();

/**
 * This test suite tests, for example:
 *
 * 1) That concurrent events get z-indexes set in a manner that help them all be shown
 * Events occurring earlier get lower z-indexes. Since later concurrent events will be positioned more to the right,
 * the early events will be clickable anyway.
 *
 * 2) That concurrent events get a property "nOfPreviousConcurrentEvents", to inform it on how much width to take up,
 * and which value the CSS left-attribute for the event needs (events with earlier concurrent events next to it, are indented to the right)
 * */

describe("EventConcurrencyHelper.ts", () => {
  test("Feeding calculateConcurrencyForEvents with an empty array", () => {
    const noEvents = eventConcurrencyHelper.calculateConcurrencyForEvents([]);
    expect(noEvents).toHaveLength(0);
  });

  test("passing in two concurrent events", () => {
    const unprocessedEvents: eventInterface[] = [
      {
        id: "35k4hj5k4jh5kj45khj",
        title: "Geography",
        time: { start: "2022-01-20 13:00", end: "2022-01-20 14:00" },
        color: "green",
      },
      {
        id: "35k4hj5k4jh5kj4543343",
        title: "Sports",
        time: { start: "2022-01-20 13:30", end: "2022-01-20 13:50" },
        color: "yellow",
        with: "Robert Karlsson",
        description:
          "Introduction to linear algebra. Please bring textbook and exercise book 7A",
      },
    ];

    const concurrentEvents =
      eventConcurrencyHelper.calculateConcurrencyForEvents(unprocessedEvents);

    expect(concurrentEvents[1].nOfPreviousConcurrentEvents).toEqual(1);

    expect(concurrentEvents[0].totalConcurrentEvents).toEqual(2);
    expect(concurrentEvents[1].totalConcurrentEvents).toEqual(2);
  });

  test("passing in three 100% concurrent events", () => {
    const unprocessedEvents: eventInterface[] = [
      {
        id: "35k4hj5k4jh5kj45khj",
        title: "Geography",
        time: { start: "2022-05-10 09:15", end: "2022-05-10 11:15" },
        color: "green",
      },
      {
        id: "35k4hj5k4jh5kj4543343",
        title: "Sports",
        time: { start: "2022-05-10 09:15", end: "2022-05-10 11:15" },
        color: "yellow",
        with: "Robert Karlsson",
        description:
          "Introduction to linear algebra. Please bring textbook and exercise book 7A",
      },
      {
        id: "kl65kjh654lkkj5kj45kjh4",
        title: "Sports",
        time: { start: "2022-05-10 09:15", end: "2022-05-10 11:15" },
        color: "yellow",
        with: "Robert Karlsson",
        description:
          "Introduction to linear algebra. Please bring textbook and exercise book 7A",
      },
    ];

    const concurrentEvents =
      eventConcurrencyHelper.calculateConcurrencyForEvents(unprocessedEvents);

    expect(concurrentEvents[0].nOfPreviousConcurrentEvents).toBeUndefined();
    expect(concurrentEvents[1].nOfPreviousConcurrentEvents).toEqual(1);
    expect(concurrentEvents[2].nOfPreviousConcurrentEvents).toEqual(2);

    expect(concurrentEvents[0].totalConcurrentEvents).toEqual(3);
    expect(concurrentEvents[1].totalConcurrentEvents).toEqual(3);
    expect(concurrentEvents[2].totalConcurrentEvents).toEqual(3);
  });

  test("passing in eight events, of which some are concurrent", () => {
    const unprocessedEvents: eventInterface[] = [
      // Concurrent event 1
      {
        id: "35k4hj5k4jh5kj45khj",
        title: "Geography",
        time: { start: "2022-05-10 07:00", end: "2022-05-10 07:15" },
      },
      // concurrent event 2
      {
        id: "35k4hj5k4jh5kj4543343",
        title: "Sports",
        time: { start: "2022-05-10 07:10", end: "2022-05-10 07:20" },
      },
      {
        id: "kl65kjh654lkkj5kj45kjh4",
        title: "Sports",
        time: { start: "2022-05-10 09:15", end: "2022-05-10 10:15" },
      },
      {
        id: "kl65kjh654lkkj5kj45kjh4",
        title: "Sports",
        time: { start: "2022-05-10 11:15", end: "2022-05-10 11:30" },
      },
      {
        id: "kl65kjh654lkkj5kj45kjh4",
        title: "Sports",
        time: { start: "2022-05-10 12:15", end: "2022-05-10 12:30" },
      },
      // Concurrent event 1
      {
        id: "kl65kjh654lkkj5kj45kjh4",
        title: "Sports",
        time: { start: "2022-05-10 13:15", end: "2022-05-10 14:30" },
      },
      // Concurrent event 2
      {
        id: "kl65kjh654lkkj5kj45kjh4",
        title: "Sports",
        time: { start: "2022-05-10 13:30", end: "2022-05-10 14:30" },
      },
      // Concurrent event 3
      {
        id: "kl65kjh654lkkj5kj45kjh4",
        title: "Sports",
        time: { start: "2022-05-10 13:45", end: "2022-05-10 14:30" },
      },
    ];

    const concurrentEvents =
      eventConcurrencyHelper.calculateConcurrencyForEvents(unprocessedEvents);

    expect(concurrentEvents[0].nOfPreviousConcurrentEvents).toBeUndefined();
    expect(concurrentEvents[1].nOfPreviousConcurrentEvents).toEqual(1);
    expect(concurrentEvents[0].totalConcurrentEvents).toEqual(2);
    expect(concurrentEvents[1].totalConcurrentEvents).toEqual(2);

    expect(concurrentEvents[5].nOfPreviousConcurrentEvents).toBeUndefined();
    expect(concurrentEvents[6].nOfPreviousConcurrentEvents).toEqual(1);
    expect(concurrentEvents[7].nOfPreviousConcurrentEvents).toEqual(2);
    expect(concurrentEvents[5].totalConcurrentEvents).toEqual(3);
    expect(concurrentEvents[6].totalConcurrentEvents).toEqual(3);
    expect(concurrentEvents[7].totalConcurrentEvents).toEqual(3);
  });

  // Repeat last test, but with an unsorted array
  test("passing in an unsorted list of eight events, of which some are concurrent", () => {
    const unprocessedEvents: eventInterface[] = [
      {
        id: "kl65kjh654lkkj5kj45kjh4",
        title: "Sports",
        time: { start: "2022-05-10 13:45", end: "2022-05-10 14:30" },
      },
      {
        id: "kl65kjh654lkkj5kj45kjh4",
        title: "Sports",
        time: { start: "2022-05-10 09:15", end: "2022-05-10 10:15" },
      },
      {
        id: "35k4hj5k4jh5kj4543343",
        title: "Sports",
        time: { start: "2022-05-10 07:10", end: "2022-05-10 07:20" },
      },
      {
        id: "kl65kjh654lkkj5kj45kjh4",
        title: "Sports",
        time: { start: "2022-05-10 12:15", end: "2022-05-10 12:30" },
      },
      {
        id: "kl65kjh654lkkj5kj45kjh4",
        title: "Sports",
        time: { start: "2022-05-10 13:15", end: "2022-05-10 14:30" },
      },
      {
        id: "kl65kjh654lkkj5kj45kjh4",
        title: "Sports",
        time: { start: "2022-05-10 11:15", end: "2022-05-10 11:30" },
      },
      {
        id: "kl65kjh654lkkj5kj45kjh4",
        title: "Sports",
        time: { start: "2022-05-10 13:30", end: "2022-05-10 14:30" },
      },
      {
        id: "35k4hj5k4jh5kj45khj",
        title: "Geography",
        time: { start: "2022-05-10 07:00", end: "2022-05-10 07:15" },
      },
    ];

    const concurrentEvents =
      eventConcurrencyHelper.calculateConcurrencyForEvents(unprocessedEvents);

    expect(concurrentEvents[0].nOfPreviousConcurrentEvents).toBeUndefined();
    expect(concurrentEvents[0].totalConcurrentEvents).toEqual(2);
    expect(concurrentEvents[1].nOfPreviousConcurrentEvents).toEqual(1);
    expect(concurrentEvents[1].totalConcurrentEvents).toEqual(2);

    expect(concurrentEvents[5].nOfPreviousConcurrentEvents).toBeUndefined();
    expect(concurrentEvents[6].nOfPreviousConcurrentEvents).toEqual(1);
    expect(concurrentEvents[7].nOfPreviousConcurrentEvents).toEqual(2);
    expect(concurrentEvents[5].totalConcurrentEvents).toEqual(3);
    expect(concurrentEvents[6].totalConcurrentEvents).toEqual(3);
    expect(concurrentEvents[7].totalConcurrentEvents).toEqual(3);
  });

  test("one long event with two periods of concurrent events", () => {
    const events: eventInterface[] = [
      {
        id: "35k4hj5k4jh5kj45khj",
        title: "Geography",
        time: { start: "2022-02-28 13:00", end: "2022-02-28 18:00" },
        color: "green",
      },
      {
        id: "35k4hj5k4jh5kj4543343",
        title: "Sports",
        time: { start: "2022-02-28 13:30", end: "2022-02-28 14:15" },
        color: "blue",
        with: "Robert Karlsson",
        description:
          "Introduction to linear algebra. Please bring textbook and exercise book 7A",
      },
      {
        id: "35k4hj5k4jh5kj4543343",
        title: "Sports",
        time: { start: "2022-02-28 13:30", end: "2022-02-28 14:15" },
        color: "yellow",
        with: "Robert Karlsson",
        description:
          "Introduction to linear algebra. Please bring textbook and exercise book 7A",
      },
      {
        id: "35k4hj5k4jh5kj4543343",
        title: "Sports",
        time: { start: "2022-02-28 16:00", end: "2022-02-28 17:15" },
        color: "yellow",
        with: "Robert Karlsson",
        description:
          "Introduction to linear algebra. Please bring textbook and exercise book 7A",
      },
    ];

    const concurrentEvents =
      eventConcurrencyHelper.calculateConcurrencyForEvents(events);

    expect(concurrentEvents[0].nOfPreviousConcurrentEvents).toBeUndefined();
    expect(concurrentEvents[0].totalConcurrentEvents).toEqual(4);
    expect(concurrentEvents[1].nOfPreviousConcurrentEvents).toEqual(1);
    expect(concurrentEvents[1].totalConcurrentEvents).toEqual(3);
    expect(concurrentEvents[2].nOfPreviousConcurrentEvents).toEqual(2);
    expect(concurrentEvents[2].totalConcurrentEvents).toEqual(3);

    expect(concurrentEvents[3].nOfPreviousConcurrentEvents).toEqual(1);
    expect(concurrentEvents[3].totalConcurrentEvents).toEqual(2);
  });
});
