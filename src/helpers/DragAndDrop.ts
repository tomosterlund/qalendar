import {eventInterface} from '../typings/interfaces/event.interface';
import Time from './Time';
// This instance of Time.ts is not allowed to use any functions that are sensible to class members 'locale' or 'firstDayOfWeekIs'
const time = new Time()

export default class DragAndDrop {

  /**
   * A function that returns true, if an event cannot be dragged in a certain direction
   *
   * @param {object} event
   * @param {string} direction - reveals if event is being dragged forwards or backwards in time
   * @param {number} dayStart
   * @param {number} dayEnd
   * */
  static eventCanBeDraggedFurther(
    event: eventInterface,
    direction: 'backwards' | 'forwards',
    dayStart: number,
    dayEnd: number,
  ) {
    // Convert time points to hours
    if (dayStart !== 0) dayStart = dayStart / 100
    dayEnd = dayEnd / 100

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
