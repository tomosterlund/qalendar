import Time from "./Time";
import {DRAG_DIRECTION} from "../typings/types";
import {eventInterface} from "../typings/interfaces/event.interface";
import {newExpression} from "@babel/types";

export class EventChange {
  private dayStart = '';
  private dayEnd = '';

  constructor(private timeInstance: Time) {
    this.setDayBoundariesTimeStrings();
  }

  public canEventBeMoved(event: eventInterface, direction: DRAG_DIRECTION): boolean {
    if (direction === DRAG_DIRECTION.FORWARDS) {
      const endTimePlus15Minutes = this.timeInstance.addMinutesToDateTimeString(15, event.time.end);
      const endTimeString = this.timeInstance.timeStringFrom(endTimePlus15Minutes)

      const oldEndDateString = this.timeInstance.dateStringFrom(event.time.end);
      const newEndDateString = this.timeInstance.dateStringFrom(endTimePlus15Minutes);

      if (newEndDateString > oldEndDateString) return false;

      return endTimeString <= this.dayEnd;
    }

    const startTimeMinus15Minutes = this.timeInstance.addMinutesToDateTimeString(-15, event.time.start);
    const startTimeString = this.timeInstance.timeStringFrom(startTimeMinus15Minutes);

    const oldStartDateString = this.timeInstance.dateStringFrom(event.time.start);
    const newStartDateString = this.timeInstance.dateStringFrom(startTimeMinus15Minutes);

    if (newStartDateString < oldStartDateString) return false;

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
