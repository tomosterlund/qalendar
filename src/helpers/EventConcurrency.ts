import { type eventInterface } from "../typings/interfaces/event.interface";

export default class EventConcurrency {
  protected sortEventsAccordingToStartOfTime(events: eventInterface[]) {
    function compare(a: eventInterface, b: eventInterface) {
      if (a.time.start < b.time.start) {
        return -1;
      }
      if (a.time.start > b.time.start) {
        return 1;
      }
      return 0;
    }

    return events.sort(compare);
  }

  /**
   * Sets the "zIndex" and "nOfPreviousConcurrentEvents" properties on an event
   *
   * zIndex - lets the event know with which z-index it should be displayed
   * nOfPreviousConcurrentEvents - lets the event know, how many other, previous events, are competing for the same width
   * */
  calculateConcurrencyForEvents(events: eventInterface[]) {
    const updatedEvents = this.sortEventsAccordingToStartOfTime(events);
    if (!updatedEvents.length) return [];

    for (const [index, calendarEvent] of updatedEvents.entries()) {
      if (index === 0) continue;

      let previousEvent = updatedEvents[index - 1];

      // Set nOfPreviousConcurrentEvents
      let iterator = 0;
      let nOfConcurrentEvents = 0;
      while (iterator < index) {
        if (updatedEvents[iterator].time.end > calendarEvent.time.start)
          nOfConcurrentEvents++;
        iterator++;
      }

      if (nOfConcurrentEvents)
        updatedEvents[index].nOfPreviousConcurrentEvents = nOfConcurrentEvents;
    }

    // Iterate backwards over the events, in order to tell all concurrent events how many concurrent events they have
    for (let index = updatedEvents.length - 1; index >= 0; index--) {
      let nOfUpcomingConcurrentEvents = 0;
      let iterator = updatedEvents.length - 1;

      while (iterator > index) {
        if (
          updatedEvents[iterator].time.start < updatedEvents[index].time.end
        ) {
          nOfUpcomingConcurrentEvents++;
        }

        iterator--;
      }

      const nfOfPreviousEvents =
        updatedEvents[index].nOfPreviousConcurrentEvents || 0;
      updatedEvents[index].totalConcurrentEvents =
        nfOfPreviousEvents + nOfUpcomingConcurrentEvents + 1; // One for the event itself
    }

    return events;
  }
}
