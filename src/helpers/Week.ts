import Time from "./Time";
import {DAY_MODE} from "../typings/interfaces/time-modes";

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
}
