import type {eventInterface} from "../typings/interfaces/event.interface";
import Time from "./Time";
import {DAY_MODE} from "../typings/interfaces/time-modes";

export class EventsFilter {

  constructor(private events: eventInterface[]) {}

  public getEventsForDay(timeInstance: Time, startDateTimeString: string): eventInterface[] {
    return this.events.filter(event => this.isEventInDayBoundaries(event, timeInstance, startDateTimeString));
  }

  private isEventInDayBoundaries(event: eventInterface, timeInstance: Time, startDateTimeString: string): boolean {
    const eventIsInDay =
      timeInstance.dateStringFrom(event.time.start) === timeInstance.dateStringFrom(startDateTimeString);

    if (timeInstance.dayMode === DAY_MODE.REGULAR) {
      return eventIsInDay;
    }

    if (eventIsInDay && timeInstance.dayMode === DAY_MODE.SHORTENED) {
      return this.handlePartialDayWithinOneDayBoundary(timeInstance, event);
    }

    if (timeInstance.dayMode === DAY_MODE.FLEXIBLE) {
      return this.handleDayStretchingTwoDates(timeInstance, event, startDateTimeString, eventIsInDay);
    }

    return false;
  }

  private handleDayStretchingTwoDates(timeInstance: Time, event: eventInterface, startDateTimeString: string, eventIsInDay: boolean) {
    const { hour: dayStartHour } = timeInstance.getHourAndMinutesFromTimePoints(timeInstance.DAY_START)
    const { hour: dayEndHour } = timeInstance.getHourAndMinutesFromTimePoints(timeInstance.DAY_END)
    const { hour: eventStartHour } = timeInstance.getAllVariablesFromDateTimeString(event.time.start)
    const nextDay = timeInstance.addDaysToDateTimeString(1, startDateTimeString);
    const eventStartsInNextDay = event.time.start.substring(0, 11) === nextDay.substring(0, 11);

    return eventIsInDay && eventStartHour >= dayStartHour
      || eventStartsInNextDay && eventStartHour < dayEndHour
  }

  private handlePartialDayWithinOneDayBoundary(timeInstance: Time, event: eventInterface) {
    const { hour: dayStartHour } = timeInstance.getHourAndMinutesFromTimePoints(timeInstance.DAY_START)
    const { hour: dayEndHour } = timeInstance.getHourAndMinutesFromTimePoints(timeInstance.DAY_END)
    const { hour: eventStartHour } = timeInstance.getAllVariablesFromDateTimeString(event.time.start)

    // TODO: add check for event end time overlapping the day start time
    return eventStartHour >= dayStartHour && eventStartHour < dayEndHour;
  }
}
