import { type eventInterface } from "../typings/interfaces/event.interface";
import {DATE_TIME_STRING_FULL_DAY_PATTERN, DATE_TIME_STRING_PATTERN} from "../constants";
import { type configInterface } from "../typings/config.interface";

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export default class Errors {
  public static PREFIX = "[Qalendar warning]";
  // public static SUFFIX = 'This is a development warning, which will never be displayed in production environments'
  public static SUFFIX = "";

  public static readonly MISSING_ID_WARNING = `${this.PREFIX} required event property 'id' is missing \n${this.SUFFIX}`;

  public static readonly MISSING_TITLE_WARNING = `${this.PREFIX} required event property 'title' is missing \n${this.SUFFIX}`;

  public static readonly MISSING_TIME_WARNING = `${this.PREFIX} required event property 'time' is missing \n${this.SUFFIX}`;

  public static readonly MISSING_TIME_START_WARNING = `${this.PREFIX} required event property 'time.start' is missing \n${this.SUFFIX}`;

  public static readonly MISSING_TIME_END_WARNING = `${this.PREFIX} required event property 'time.end' is missing \n${this.SUFFIX}`;

  static checkEventProperties(event: RecursivePartial<eventInterface>) {
    // Warn if required property is missing
    if (!event.id) console.warn(this.MISSING_ID_WARNING);
    if (!event.title) console.warn(this.MISSING_TITLE_WARNING);
    if (!event.time) console.warn(this.MISSING_TIME_WARNING);
    if (!event?.time?.start) console.warn(this.MISSING_TIME_START_WARNING);
    if (!event?.time?.end) console.warn(this.MISSING_TIME_END_WARNING);

    if (
      event.time?.start
      && event.time?.end
      && !DATE_TIME_STRING_PATTERN.test(event.time.start)
      && !DATE_TIME_STRING_FULL_DAY_PATTERN.test(event.time.start)
    )
      console.warn(
        `${this.PREFIX} event property 'time.start' expects a string formatted like 'YYYY-MM-DD hh:mm', or 'YYYY-MM-DD', received ${event.time.start} \n${this.SUFFIX}`
      );
    if (
      event.time?.start
      && event.time?.end
      && !DATE_TIME_STRING_PATTERN.test(event.time.end)
      && !DATE_TIME_STRING_FULL_DAY_PATTERN.test(event.time.end)
    )
      console.warn(
        `${this.PREFIX} event property 'time.end' expects a string formatted like 'YYYY-MM-DD hh:mm',  or 'YYYY-MM-DD', received ${event.time.end} \n${this.SUFFIX}`
      );
  }

  static checkConfig(config: configInterface) {
    if (config.locale && !/^[a-z]{2}-[A-Z]{2}$/.test(config.locale))
      console.warn(
        `${this.PREFIX} config.locale expects a string of format xx-XX, received: ${config.locale}`
      );
    if (
      config.defaultMode &&
      !["month", "week", "day"].some((mode) => mode === config.defaultMode)
    )
      console.warn(
        `${this.PREFIX} config.defaultMode expects either one of the values "day", "week" or "month"`
      );
  }
}
