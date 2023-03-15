import {eventInterface} from '../typings/interfaces/event.interface';
import Time from './Time';
import {DRAG_DIRECTION} from "../typings/types";
// This instance of Time.ts is not allowed to use any functions that are sensible to class members 'locale' or 'firstDayOfWeekIs'
const time = new Time()

export default class DragAndDrop {

  /**
   * A function that returns true, if an event cannot be dragged in a certain direction
   *
   * @param {object} event
   * @param {string} direction - reveals if event is being dragged forwards or backwards in time
   * @param dayStartDateTimeString
   * @param dayEndDateTimeString
   * */
  static eventCanBeDraggedFurther(
    event: eventInterface,
    direction: DRAG_DIRECTION,
    dayStartDateTimeString: string,
    dayEndDateTimeString: string,
  ) {
    if (direction === DRAG_DIRECTION.BACKWARDS) {
      const eventStartMinus15Minutes = time.addMinutesToDateTimeString(-15, event.time.start)

      return eventStartMinus15Minutes >= dayStartDateTimeString;
    }

    const eventEndPlus15Minutes = time.addMinutesToDateTimeString(15, event.time.end)

    return eventEndPlus15Minutes <= dayEndDateTimeString;
  }

  // TODO: This function is not used anywhere. It should be removed when eventCanBeDraggedFurther is refactored
  static DEPRECATEDeventCanBeDraggedFurther(
    event: eventInterface,
    direction: 'backwards' | 'forwards',
    dayStart: number,
    dayEnd: number,
  ) {
    dayStart = Time.getHourFromTimePoints(dayStart)
    dayEnd = Time.getHourFromTimePoints(dayEnd)

    if (direction === 'forwards') {
      const lastHourBeforeEndOfDay = dayEnd - 1;
      const { hour: endHour } = time.getAllVariablesFromDateTimeString(event.time.end)
      const { minutes: endMinutes } = time.getAllVariablesFromDateTimeString(event.time.end)
      const { hour: startHour } = time.getAllVariablesFromDateTimeString(event.time.start)
      const { minutes: startMinutes } = time.getAllVariablesFromDateTimeString(event.time.start)

      return (endHour < lastHourBeforeEndOfDay || (endHour === lastHourBeforeEndOfDay && endMinutes < 45))
        && (startHour < lastHourBeforeEndOfDay || startHour === lastHourBeforeEndOfDay && startMinutes < 45)
    }

    const { hour: startHour } = time.getAllVariablesFromDateTimeString(event.time.start)
    const { minutes: startMinutes } = time.getAllVariablesFromDateTimeString(event.time.start)

    return startHour > dayStart || (startHour === dayStart && startMinutes >= 15)
  }
}
