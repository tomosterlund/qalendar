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
   * */
  static eventCanBeDraggedFurther(event: eventInterface, direction: 'backwards' | 'forwards') {
    if (direction === 'forwards') {
      const { hour: endHour } = time.getAllVariablesFromDateTimeString(event.time.end)
      const { minutes: endMinutes } = time.getAllVariablesFromDateTimeString(event.time.end)
      const { hour: startHour } = time.getAllVariablesFromDateTimeString(event.time.start)
      const { minutes: startMinutes } = time.getAllVariablesFromDateTimeString(event.time.start)

      return (endHour < 23 || (endHour === 23 && endMinutes < 45))
       && (startHour < 23 || startHour === 23 && startMinutes < 45)
    }

    const { hour: startHour } = time.getAllVariablesFromDateTimeString(event.time.start)
    const { minutes: startMinutes } = time.getAllVariablesFromDateTimeString(event.time.start)

    return startHour > 0 || (startHour === 0 && startMinutes >= 15)
  }
}
