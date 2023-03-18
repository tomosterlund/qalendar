import Time from "./Time";
import {DRAG_DIRECTION} from "../typings/types";
import {eventInterface} from "../typings/interfaces/event.interface";
import {DAY_MODE} from "../typings/interfaces/time-modes";

export class EventChange {
  private dayStart = '';
  private dayEnd = '';

  constructor(private timeInstance: Time, private date: string) {
    this.setDayBoundariesTimeStrings();
  }

  public canEventBeMoved(event: eventInterface, direction: DRAG_DIRECTION): boolean {
    if (this.timeInstance.dayMode !== DAY_MODE.FLEXIBLE) {
      return this.handleNonFlexibleDays(direction, event);
    }

    return this.handleFlexibleDays(direction, event);
  }

  private handleNonFlexibleDays(direction: DRAG_DIRECTION, event: eventInterface) {
    if (direction === DRAG_DIRECTION.FORWARDS) {
      return this.handleForwardsMoveForNonFlexibleDays(event);
    }

    return this.handleBackwardsMoveForNonFlexibleDays(event);
  }

  private handleFlexibleDays(direction: DRAG_DIRECTION, event: eventInterface) {
    if (direction == DRAG_DIRECTION.FORWARDS) {
      return this.handleForwardsMoveForFlexibleDays(event);
    }

    return this.handleBackwardsMoveForFlexibleDays(event);
  }

  private handleForwardsMoveForNonFlexibleDays(event: eventInterface) {
    const endTimePlus15Minutes = this.timeInstance.addMinutesToDateTimeString(15, event.time.end);
    const endTimeString = this.timeInstance.timeStringFrom(endTimePlus15Minutes)
    const newEndDateString = this.timeInstance.dateStringFrom(endTimePlus15Minutes);

    if (newEndDateString > this.date) return false;

    return endTimeString <= this.dayEnd;
  }

  private handleBackwardsMoveForNonFlexibleDays(event: eventInterface) {
    const startTimeMinus15Minutes = this.timeInstance.addMinutesToDateTimeString(-15, event.time.start);
    const startTimeString = this.timeInstance.timeStringFrom(startTimeMinus15Minutes);
    const newStartDateString = this.timeInstance.dateStringFrom(startTimeMinus15Minutes);

    if (newStartDateString < this.date) return false;

    return startTimeString >= this.dayStart;
  }

  private handleForwardsMoveForFlexibleDays(event: eventInterface) {
    const endTimePlus15Minutes = this.timeInstance.addMinutesToDateTimeString(15, event.time.end);
    const endTimeString = this.timeInstance.timeStringFrom(endTimePlus15Minutes)
    const newEndDateString = this.timeInstance.dateStringFrom(endTimePlus15Minutes);

    if (newEndDateString === this.date) return true;

    return endTimeString <= this.dayEnd;
  }

  private handleBackwardsMoveForFlexibleDays(event: eventInterface) {
    const startTimeMinus15Minutes = this.timeInstance.addMinutesToDateTimeString(-15, event.time.start);
    const startTimeString = this.timeInstance.timeStringFrom(startTimeMinus15Minutes);
    const newStartDateString = this.timeInstance.dateStringFrom(startTimeMinus15Minutes);

    if (newStartDateString > this.date) return true;

    return startTimeString >= this.dayStart;
  }

  private setDayBoundariesTimeStrings() {
    const startHour = this.timeInstance.getHourAndMinutesFromTimePoints(this.timeInstance.DAY_START).hour;
    const endHour = this.timeInstance.getHourAndMinutesFromTimePoints(this.timeInstance.DAY_END).hour;

    const startHourString = startHour < 10
      ? `0${startHour}`
      : startHour;
    this.dayStart = `${startHourString}:00`;

    const endHourString = endHour < 10
      ? `0${endHour}`
      : endHour;
    this.dayEnd = `${endHourString}:00`;
  }
}
