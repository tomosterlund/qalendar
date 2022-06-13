import Helpers from "./Helpers";
import { dayStartOrEnd } from "../typings/config.interface";
import EDate from "./EDate";

export type calendarWeekType = Date[];
export type calendarMonthType = calendarWeekType[];
export type calendarYearMonths = Date[];

export default class Time {
  FIRST_DAY_OF_WEEK: "sunday" | "monday";
  CALENDAR_LOCALE: string;
  ALL_HOURS: dayStartOrEnd[];
  DAY_START: number;
  DAY_END: number;
  MS_PER_DAY: number

  constructor(
    firstDayOfWeekIs: "sunday" | "monday" = "monday",
    locale: string | null = null
  ) {
    this.FIRST_DAY_OF_WEEK = firstDayOfWeekIs;
    this.CALENDAR_LOCALE = locale
      ? locale
      : Helpers.getBrowserNavigatorLocale();
    this.ALL_HOURS = [
      0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
      1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400,
    ];
    this.DAY_START = 0;
    this.DAY_END = 2400;
    this.MS_PER_DAY = 86400000;
  }

  getDatesBetweenTwoDates(start: Date, end: Date) {
    for (
      var arr = [], dt = new Date(start);
      dt <= end;
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()));
    }

    return arr;
  }

  getCalendarWeekDateObjects(date: Date | null = null): calendarWeekType {
    const selectedDate = date ? date : new Date();

    // We need to count currentDate.getDate() - the current Nday of the week, to get the first date
    let subtractedDaysToGetFirstDate;
    if (this.FIRST_DAY_OF_WEEK === "sunday")
      subtractedDaysToGetFirstDate = selectedDate.getDay();
    else
      subtractedDaysToGetFirstDate =
        selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1;

    const first = selectedDate.getDate() - subtractedDaysToGetFirstDate; // First date is the date of the month - the day of the week
    const firstDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      first
    );
    const lastDay = new Date(
      firstDay.getFullYear(),
      firstDay.getMonth(),
      firstDay.getDate() + 6
    );

    return this.getDatesBetweenTwoDates(firstDay, lastDay);
  }

  /**
   * Returns an array of the weeks that comprise a month
   * */
  getCalendarMonthSplitInWeeks(yyyy: number, mm: number): calendarMonthType {
    const month: calendarMonthType = [];
    const selectedDate = ![typeof yyyy, typeof mm].includes("undefined")
      ? new Date(yyyy, mm, 1)
      : new Date();

    // 1. Get the first date of the month, and push the full week of this date into the month list
    let firstDateOfMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    );
    const firstWeekOfMonth = this.getCalendarWeekDateObjects(firstDateOfMonth);
    month.push(firstWeekOfMonth);

    // 2. Then enter a while-loop, which pushes weeks onto the month,
    // until the first Monday is reached, that is not in the specified month
    let isInMonth = true;
    let mondayOfWeekToPush = firstWeekOfMonth[0];
    const specifiedMonth = selectedDate.getMonth();

    while (isInMonth) {
      const newMonday = new Date(
        mondayOfWeekToPush.getFullYear(),
        mondayOfWeekToPush.getMonth(),
        mondayOfWeekToPush.getDate() + 7
      );

      if (newMonday.getMonth() === specifiedMonth) {
        month.push(this.getCalendarWeekDateObjects(newMonday));
        mondayOfWeekToPush = newMonday;
      } else {
        isInMonth = false;
      }
    }

    return month;
  }

  /**
   * Returns an array with the length of 12 dates,
   * one date for the first day of each month of the year
   * */
  getCalendarYearMonths(year: number | null = null): calendarYearMonths {
    const selectedYear = year ? year : new Date().getFullYear();
    const yearList: calendarYearMonths = [];

    let month = 0;

    while (month <= 11) {
      yearList.push(new Date(selectedYear, month, 1));
      month++;
    }

    return yearList;
  }

  getHourAndMinutesFromTimePoints(timePoints: number) {
    const time = timePoints.toString();
    let hour = "0";
    let minutes = "0";

    if (time.length === 4) {
      hour = time[0] + time[1];
      minutes = time[2] + time[3];
    } else if (time.length === 3) {
      hour = time[0];
      minutes = time[1] + time[2];
    }

    return {
      hour: +hour,
      minutes: +minutes,
    };
  }

  /**
   * Given timePoints (0, 100, 200 etc.), this function returns
   * a localized string with the respective hour
   * (in en-US for example: 0 => 12 AM, 1600 => 4 PM )
   * */
  getHourLocaleStringFromHourDigits(timePoints: number) {
    const { hour, minutes } = this.getHourAndMinutesFromTimePoints(timePoints);

    const hourLocaleString = new Date(
      2100,
      0,
      1,
      +hour,
      +minutes,
      0
    ).toLocaleTimeString(this.CALENDAR_LOCALE, {
      hour: "2-digit",
    });

    if (hourLocaleString[0] === "0") return hourLocaleString.substring(1);

    return hourLocaleString;
  }

  getLocalizedNameOfWeekday(
    date: Date,
    weekdayNameLength: "long" | "short" = "short"
  ): string {
    return date.toLocaleDateString(this.CALENDAR_LOCALE, {
      weekday: weekdayNameLength,
    });
  }

  getLocalizedNameOfMonth(
    date: Date,
    monthNameLength: "long" | "short" = "short"
  ): string {
    return date.toLocaleDateString(this.CALENDAR_LOCALE, {
      month: monthNameLength,
    });
  }

  getLocalizedDateString(date: Date): string {
    return date.toLocaleDateString(this.CALENDAR_LOCALE);
  }

  /**
   * Takes a date object, and creates a time string from it, in the format of
   * YYYY-MM-DD hh:mm
   * */
  getDateTimeStringFromDate(
    date: Date,
    timeIsStartOrEndOfDay?: "start" | "end"
  ): string {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const fullDate = `${y}-${m >= 10 ? m : "0" + m}-${d >= 10 ? d : "0" + d}`;

    if (!timeIsStartOrEndOfDay) {
      const hour = date.getHours();
      const minutes = date.getMinutes();

      return `${fullDate} ${hour >= 10 ? hour : "0" + hour}:${
        minutes >= 10 ? minutes : "0" + minutes
      }`;
    }

    const fullTime = timeIsStartOrEndOfDay === "start" ? "00:00" : "23:59";

    return `${fullDate} ${fullTime}`;
  }

  getLocalizedTime(dateTimeString: string) {
    const h = dateTimeString.substring(11, 13);
    const m = dateTimeString.substring(14, 16);
    const d = new Date();
    d.setHours(+h);
    d.setMinutes(+m);

    return d.toLocaleTimeString(this.CALENDAR_LOCALE, {
      hour: "numeric",
      minute: "numeric",
    });
  }

  getLocalizedHour(date: Date) {
    return date.toLocaleTimeString(this.CALENDAR_LOCALE, { hour: "2-digit" });
  }

  /**
   * Returns numeric values for year, month, date, hour and minutes, given a dateTimeString
   * All variables are Date-Object compatible, meaning "month" is zero-indexed
   * */
  getAllVariablesFromDateTimeString(dateTimeString: string) {
    const year = +dateTimeString.substring(0, 4);
    const month = +dateTimeString.substring(5, 7) - 1;
    const date = +dateTimeString.substring(8, 10);
    const hour = +dateTimeString.substring(11, 13);
    const minutes = +dateTimeString.substring(14, 16);

    return { year, month, date, hour, minutes };
  }

  dateIsToday(date: Date) {
    const {
      fullYear: yearToday,
      month: monthToday,
      date: dateToday,
    } = new EDate();
    const {
      fullYear: dateYear,
      month: dateMonth,
      date: dateDate,
    } = new EDate(date);

    return (
      yearToday === dateYear &&
      monthToday === dateMonth &&
      dateToday === dateDate
    );
  }

  dateIsInWeek(dateToCheck: Date, week: Date[]) {
    const { date, month, fullYear } = new EDate(dateToCheck);

    for (const weekDay of week) {
      const dateIsSame = date === weekDay.getDate();
      const monthIsSame = month === weekDay.getMonth();
      const yearIsSame = fullYear === weekDay.getFullYear();

      if (dateIsSame && monthIsSame && yearIsSame) return true;
    }

    return false;
  }

  getDateStringFromDate(date: Date) {
    const yyyy = date.getFullYear()
    const mm = (date.getMonth() + 1)
    const dd = date.getDate()

    return `${yyyy}-${mm >= 10 ? mm : "0" + mm}-${dd >= 10 ? dd : "0" + dd}`;
  }
}
