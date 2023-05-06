import Time from "./Time";
import {DAY_MODE} from "../typings/interfaces/time-modes";
import {EVENT_TYPE, type eventInterface} from "../typings/interfaces/event.interface";
import Helpers from "./Helpers";

export class WeekHelper {
  public static getNHoursIntoDayFromHour(hour: number, timeInstance: Time): number {
    const dayStartHour = Time.getHourFromTimePoints(timeInstance.DAY_START);

    if (timeInstance.dayMode === DAY_MODE.REGULAR) return hour;

    if (
      timeInstance.dayMode === DAY_MODE.SHORTENED
      || (timeInstance.dayMode === DAY_MODE.FLEXIBLE && hour >= dayStartHour)
    ) {
      return hour - dayStartHour;
    }

    return (24 - dayStartHour) + hour;
  }

  public static eventSeparator(events: eventInterface[], time: Time) {
    const singleDayTimedEvents: eventInterface[] = [];
    const fullDayAndMultipleDayEvents: eventInterface[] = [];

    for (const scheduleEvent of events) {
      const eventType = Helpers.getEventType(scheduleEvent, time);
      if ([EVENT_TYPE.SINGLE_DAY_TIMED, EVENT_TYPE.SINGLE_HYBRID_DAY_TIMED].includes(eventType)) {
        singleDayTimedEvents.push(scheduleEvent);
      } else {
        fullDayAndMultipleDayEvents.push(scheduleEvent);
      }
    }

    return { fullDayAndMultipleDayEvents, singleDayTimedEvents }
  }
}
