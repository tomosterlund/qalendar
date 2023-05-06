import {Comment, type Slot, Text, type VNode} from 'vue';
import {EVENT_TYPE, type eventInterface} from "../typings/interfaces/event.interface";
import Time from "./Time";
import {DATE_TIME_STRING_FULL_DAY_PATTERN, DATE_TIME_STRING_PATTERN} from "../constants";
import {DAY_MODE} from "../typings/interfaces/time-modes";

export default class Helpers {
  /**
   * If navigator.languages is present (correlating to the browser's Accept-Language header), then use it
   * otherwise just use navigator.language
   * */
  static getBrowserNavigatorLocale(): string {
    if (typeof navigator !== "object") return "en-US";

    return navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language;
  }

  /**
   * Solution from https://github.com/vuejs/core/issues/4733#issuecomment-1024816095
   * */
  static hasSlotContent(slot: Slot|undefined) {
    if (!slot) return false;

    return slot().some((vnode: VNode) => {
      if (vnode.type === Comment) return false;

      if (Array.isArray(vnode.children) && !vnode.children.length) return false;

      return (
        vnode.type !== Text
        || (typeof vnode.children === 'string' && vnode.children.trim() !== '')
      );
    });
  }

  static getEventType(event: eventInterface, time: Time) {
    const isTimedEvent = DATE_TIME_STRING_PATTERN.test(event.time.start)
      && DATE_TIME_STRING_PATTERN.test(event.time.end);

    const isFullDayEvent = DATE_TIME_STRING_FULL_DAY_PATTERN.test(event.time.start)
      && DATE_TIME_STRING_FULL_DAY_PATTERN.test(event.time.end);

    if (isTimedEvent) return this.getTimedEventType(event, time)

    if (isFullDayEvent) return this.getFullDayEventType(event, time)

    throw new Error('Event has invalid type');
  }

  static getTimedEventType(event: eventInterface, time: Time) {
    if (time.dateStringsHaveEqualDates(event.time.start, event.time.end)) {
      return EVENT_TYPE.SINGLE_DAY_TIMED;
    }

    if (time.dayMode === DAY_MODE.FLEXIBLE) {
      const endBoundaryForSingleHybridDay = time.setHourInDateTimeString(
        time.addDaysToDateTimeString(
          1,
          time.dateStringFrom(event.time.start)
        ),
        Time.getHourFromTimePoints(time.DAY_END),
      );

      if (event.time.end < endBoundaryForSingleHybridDay) {
        return EVENT_TYPE.SINGLE_HYBRID_DAY_TIMED;
      }
    }

    return EVENT_TYPE.MULTI_DAY_TIMED;
  }

  static getFullDayEventType(event: eventInterface, time: Time) {
    if (time.dateStringsHaveEqualDates(event.time.start, event.time.end)) {
      return EVENT_TYPE.SINGLE_DAY_FULL_DAY;
    }

    return EVENT_TYPE.MULTI_DAY_FULL_DAY;
  }

  static isUIEventTouchEvent(event: UIEvent): boolean {
    return 'touches' in event && typeof event.touches === 'object';
  }
}
