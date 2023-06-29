import Time from "./Time";
import {DRAG_N_RESIZE_DIRECTION} from "../typings/types";
import type {eventInterface} from "../typings/interfaces/event.interface";
import {DAY_MODE} from "../typings/interfaces/time-modes";

export class EventChange {
  private dayStart = '';
  private dayEnd = '';

  constructor(private timeInstance: Time, private date: string) {
    this.setDayBoundariesTimeStrings();
  }

  public canEventBeMoved(event: eventInterface, direction: DRAG_N_RESIZE_DIRECTION): boolean {
    if (this.timeInstance.dayMode !== DAY_MODE.FLEXIBLE) {
      return this.handleNonFlexibleDays(direction, event);
    }

    return this.handleFlexibleDays(direction, event);
  }

  private handleNonFlexibleDays(direction: DRAG_N_RESIZE_DIRECTION, event: eventInterface) {
    if (direction === DRAG_N_RESIZE_DIRECTION.FORWARDS) {
      return this.handleForwardsMoveForNonFlexibleDays(event);
    }

    return this.handleBackwardsMoveForNonFlexibleDays(event);
  }

  private handleFlexibleDays(direction: DRAG_N_RESIZE_DIRECTION, event: eventInterface) {
    if (direction == DRAG_N_RESIZE_DIRECTION.FORWARDS) {
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

    const startHourString = this.timeInstance.doubleDigit(startHour);
    this.dayStart = `${startHourString}:00`;

    const endHourString = this.timeInstance.doubleDigit(endHour);
    this.dayEnd = `${endHourString}:00`;
  }
}
