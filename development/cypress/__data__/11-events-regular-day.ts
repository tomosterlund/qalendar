import {EventBuilder} from "../../../src/models/Event";
import {eventInterface} from "../../../src/typings/interfaces/event.interface";

const eventsRegularDay: eventInterface[] = [];

(function() {
  const timedConcurrentEvent1 = new EventBuilder({
    start: '2023-03-18 18:23',
    end: '2023-03-18 19:23',
  }, 1)
  .withTitle('Event 1').build()

  const timedConcurrentEvent2 = new EventBuilder({
    start: '2023-03-18 18:30',
    end: '2023-03-18 20:23',
  }, 2)
  .withTitle('Event 2').build();

  const fullSingeDayEvent = new EventBuilder({
    start: '2023-03-20',
    end: '2023-03-20',
  }, 3)
  .withTitle('Full single day event').build();

  const fullMultiDayEvent = new EventBuilder({
    start: '2023-03-21',
    end: '2023-03-23',
  }, 4)
  .withTitle('Full multi day event').build();

  const fullMultiDayEventsYearBreak = new EventBuilder({
    start: '2023-12-31',
    end: '2024-01-03',
  }, 5)
  .withTitle('Full multi day event year break').build();

  const timedMultiDayEventYearBreak = new EventBuilder({
    start: '2023-12-31 18:23',
    end: '2024-02-01 19:23',
  }, 6)
  .withTitle('Timed multi day event year break').build();

  eventsRegularDay.push(
    timedConcurrentEvent1,
    timedConcurrentEvent2,
    fullSingeDayEvent,
    fullMultiDayEvent,
    fullMultiDayEventsYearBreak,
    timedMultiDayEventYearBreak,
  )
})()

export default eventsRegularDay
