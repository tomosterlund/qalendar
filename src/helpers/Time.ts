import Helpers from "./Helpers";
import {DAY_TIME_POINT} from "../typings/config.interface";
import EDate from "./EDate";
import {DAY_MODE} from "../typings/interfaces/time-modes";

export type calendarWeekType = Date[];
export type calendarMonthType = calendarWeekType[];
export type calendarYearMonths = Date[];

export enum WEEK_START_DAY {
  SUNDAY = 'sunday',
  MONDAY = 'monday'
}

export default class Time {
  FIRST_DAY_OF_WEEK: WEEK_START_DAY;
  CALENDAR_LOCALE: string;
  ALL_HOURS: DAY_TIME_POINT[] = [
    0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
    1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300
  ];
  DAY_START: DAY_TIME_POINT;
  DAY_END: DAY_TIME_POINT;
  HOURS_PER_DAY = 24;
  MS_PER_DAY: number;

  constructor(
    firstDayOfWeek: WEEK_START_DAY = WEEK_START_DAY.MONDAY,
    locale: string | null = null,
    dayBoundaries: { start: DAY_TIME_POINT; end: DAY_TIME_POINT } = { start: 0, end: 2400 }
  ) {
    this.FIRST_DAY_OF_WEEK = firstDayOfWeek;
    this.CALENDAR_LOCALE = locale
      ? locale
      : Helpers.getBrowserNavigatorLocale();
    this.DAY_START = dayBoundaries.start;
    this.DAY_END = dayBoundaries.end;
    this.HOURS_PER_DAY = (() => {
      const dayEnd = Time.getHourFromTimePoints(this.DAY_END),
        dayStart = Time.getHourFromTimePoints(this.DAY_START);

      if (dayEnd > dayStart) return dayEnd - dayStart;

      return this.HOURS_PER_DAY - dayStart + dayEnd;
    })()
    this.MS_PER_DAY = 86400000;
  }

  get dayMode() {
    if (this.DAY_START === 0 && this.DAY_END === 2400) return DAY_MODE.REGULAR;

    if (this.DAY_START >= this.DAY_END) return DAY_MODE.FLEXIBLE;

    return DAY_MODE.SHORTENED;
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

  getCalendarWeekDateObjects(date: Date): calendarWeekType {
    // If week starts on Sunday, we can get the first date of the week, by simply counting selectedDate.getDate() - selectedDate.getDay()
    let subtractedDaysToGetFirstDate;
    if (this.FIRST_DAY_OF_WEEK === "sunday")
      subtractedDaysToGetFirstDate = date.getDay();
    // However, if week starts on Monday, we need to make sure Mondays are represented as 0, instead of Sundays
    else
      subtractedDaysToGetFirstDate =
        date.getDay() === 0 ? 6 : date.getDay() - 1;

    const dateOfFirstDayOfWeek = date.getDate() - subtractedDaysToGetFirstDate; // First date of week is the date of the month - the day of the week
    const firstDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      dateOfFirstDayOfWeek
    );

    return this.getDatesBetweenTwoDates(
      firstDay,
      new Date(
        firstDay.getFullYear(),
        firstDay.getMonth(),
        firstDay.getDate() + 6
      )
    );
  }

  /**
   * Returns an array of the weeks that comprise a month
   *
   * @param {number} yyyy
   * @param {number} mm - zero indexed (January === 0)
   * */
  getCalendarMonthSplitInWeeks(yyyy: number, mm: number): calendarMonthType {
    const month: calendarMonthType = [];
    const selectedDate = new Date(yyyy, mm, 1);

    // 1. Get the first date of the month, and push the full week of this date into the month list
    const firstDateOfMonth = new Date(
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
  getCalendarYearMonths(year: number): calendarYearMonths {
    const yearList: calendarYearMonths = [];
    let month = 0;

    while (month <= 11) {
      yearList.push(new Date(year, month, 1));
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
    // Though only displaying time, the exact date is needed, because otherwise time will be displayed
    // incorrectly on days when daylight saving time changes
    const {
      year,
      month,
      date,
      hour,
      minutes,
    } = this.getAllVariablesFromDateTimeString(dateTimeString);
    const d = new Date(year, month, date, hour, minutes);

    return d.toLocaleTimeString(this.CALENDAR_LOCALE, {
      hour: "numeric",
      minute: "numeric",
    });
  }

  getLocalizedHour(date: Date) {
    return date.toLocaleTimeString(this.CALENDAR_LOCALE, { hour: "2-digit" });
  }

  getLocalizedTimeRange(start: string, end: string) {
    return `${this.getLocalizedTime(start)} - ${this.getLocalizedTime(end)}`;
  }

  /**
   * Returns numeric values for year, month, date, hour and minutes, given a dateTimeString
   * All variables are Date-Object compatible, meaning "month" is zero-indexed
   * */
  getAllVariablesFromDateTimeString(dateTimeString: string) {
    return {
      year: +dateTimeString.substring(0, 4),
      month: +dateTimeString.substring(5, 7) - 1,
      date: +dateTimeString.substring(8, 10),
      hour: this.hourFrom(dateTimeString),
      minutes: this.minutesFrom(dateTimeString),
    };
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

  addMinutesToDateTimeString(minutes: number, dateTimeString: string) {
    const {
      year: oldYear,
      month: oldMonth,
      date: oldDate,
      hour: oldHour,
      minutes: oldMinutes
    } = this.getAllVariablesFromDateTimeString(dateTimeString)

    const oldDateObject = new Date(oldYear, oldMonth, oldDate, oldHour, oldMinutes)
    const newDateObject = new Date(oldDateObject.getTime() + (minutes * 60000))

    return this.getDateTimeStringFromDate(newDateObject)
  }

  addDaysToDateTimeString(days: number, dateTimeString: string) {
    return this.addMinutesToDateTimeString((days * 1440), dateTimeString)
  }

  dateStringsHaveEqualDates(dateTimeString1: string, dateTimeString2: string) {
    const { year: year1, month: month1, date: date1 } = this.getAllVariablesFromDateTimeString(dateTimeString1)
    const { year: year2, month: month2, date: date2 } = this.getAllVariablesFromDateTimeString(dateTimeString2)

    return (year1 === year2) && (month1 === month2) && (date1 === date2)
  }

  setDateToEndOfDay(date: Date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59,
      999
    )
  }

  protected turnMinutesIntoPercentageOfHour(minutes: number): string {
    const oneMinutePercentage = 100 / 60;
    const minutePoints = oneMinutePercentage * minutes;

    if (minutePoints < 10) return "0" + minutePoints;

    return minutePoints.toString();
  }

  /**
   * Every hour between 'dayStart' and 'dayEnd' is 100, in this function referred to as 100 points
   * If an event starts 30 minutes after 'dayStart', it should have 50 pointsIntoDay
   * If a day consists of 4 hours (400 points), we then have to count
   * (50 / 400) * 100 = 12.5 => event starts after 12.5 percent of the day
   *
   * Result is supposed to be a number between 0 and 100, and is used for setting the CSS- top- and height-attributes for events
   * */
  getPercentageOfDayFromDateTimeString(
    dateTimeString: string,
    dayStart: number,
    dayEnd: number,
  ) {
    const hour = this.hourFrom(dateTimeString);
    const hourPoints = hour * 100;
    const minutes = +dateTimeString.substring(14, 16);
    const minutesPoints = +this.turnMinutesIntoPercentageOfHour(+minutes);

    if (dayEnd > dayStart) {
      const pointsInDay = dayEnd - dayStart;
      const eventPoints = hourPoints + minutesPoints;
      const eventPointsIntoDay = eventPoints - dayStart;

      return (eventPointsIntoDay / pointsInDay) * 100;
    }

    const hourPointsInOriginalDay = DAY_TIME_POINT.TWELVE_AM - dayStart;
    const pointsInDay = hourPointsInOriginalDay + dayEnd;
    const eventPoints = hourPoints + minutesPoints;
    const pointsIntoDay = eventPoints >= dayStart ? eventPoints - dayStart : hourPointsInOriginalDay + eventPoints;

    return (pointsIntoDay / pointsInDay) * 100;
  }

  getTimeFromClick(
    clickOffsetY: number,
    weekHeight: number,
  ): string {
    if (weekHeight <= 0) throw new Error('weekHeight cannot be a negative number');
    if (clickOffsetY < 0) throw new Error('clickOffsetY cannot be a negative number');

    const dayStartHour = this.DAY_START / 100;
    const hourHeight = weekHeight / this.HOURS_PER_DAY;
    const minutes = Math.floor((clickOffsetY % hourHeight) / (hourHeight / 60));

    if (this.DAY_END <= this.DAY_START) {
      const dayEndHour = this.DAY_END / 100;
      const nightHeight = (dayEndHour) * hourHeight;
      const nightOffset = weekHeight - nightHeight;

      if (clickOffsetY > nightOffset) {
        const hour = Math.floor((clickOffsetY - nightOffset) / hourHeight);
        return `${this.doubleDigit(hour)}:${this.doubleDigit(minutes)}`;
      }
    }

    const hour = Math.floor(clickOffsetY / hourHeight) + dayStartHour;

    return `${this.doubleDigit(hour)}:${this.doubleDigit(minutes)}`;
  }

  setSegmentOfDateTimeString(dateTimeString: string, segments: { hour: number }) {
    if (segments.hour < 0 || segments.hour > 23) throw new Error('Invalid hour')
    const newHour = this.doubleDigit(segments.hour)
    dateTimeString = dateTimeString.replace(/\d{2}:/, newHour + ":")

    return dateTimeString
  }

  isTrailingOrLeadingDate(date: Date, month: number) {
    const { month: dateMonth } = new EDate(date);

    return month !== dateMonth
  }

  static getTimePointsFromHour(boundary: number) {
    if (boundary < 0 || boundary > 24 || boundary % 1 !== 0) {
      throw new Error('Invalid day boundary');
    }

    if (boundary === 0) return boundary;

    return boundary * 100;
  }

  static getHourFromTimePoints(timePoints: number) {
    if (timePoints < 0 || timePoints > 2400 || timePoints % 100 !== 0) {
      throw new Error('Invalid time points');
    }

    if (timePoints === 0) return timePoints;

    return timePoints / 100;
  }

  getTimelineHours(): DAY_TIME_POINT[] {
    if (this.dayMode !== DAY_MODE.FLEXIBLE) {
      return this.ALL_HOURS.filter(hour => {
        return hour >= this.DAY_START && hour < this.DAY_END;
      })
    }

    return [
      ...this.ALL_HOURS.filter(hour => hour >= this.DAY_START),
      ...this.ALL_HOURS.filter(hour => hour < this.DAY_END)
    ]
  }

  dateStringFrom(dateTimeString: string) {
    return dateTimeString.substring(0, 10);
  }

  timeStringFrom(dateTimeString: string) {
    return dateTimeString.substring(11, 16);
  }

  hourFrom(dateTimeString: string) {
    return +dateTimeString.substring(11, 13);
  }

  minutesFrom(dateTimeString: string) {
    return +dateTimeString.substring(14, 16);
  }

  areDaysConsecutive(dayOne: string, dayTwo: string) {
    const dayOnePlusOneDay = this.dateStringFrom(this.addDaysToDateTimeString(1, dayOne))

    return dayOnePlusOneDay === this.dateStringFrom(dayTwo);
  }

  setHourInDateTimeString(dateTimeString: string, hour: number) {
    const hourString = this.doubleDigit(hour)
    dateTimeString = dateTimeString.replace(/\d{2}:/, hourString + ":")

    return dateTimeString
  }

  setMinutesInDateTimeString(dateTimeString: string, minutes: number) {
    const minutesString = this.doubleDigit(minutes)
    dateTimeString = dateTimeString.replace(/:\d{2}/, ":" + minutesString)

    return dateTimeString
  }

  getDateTimeStringDayBoundariesFrom(dateString: string): { start: string, end: string } {
    if (this.DAY_END <= this.DAY_START) {
      const nextDay = this.addDaysToDateTimeString(1, dateString);
      const endOfDay = this.setHourInDateTimeString(nextDay, this.getHourAndMinutesFromTimePoints(this.DAY_END).hour);
      const startOfDay = this.setHourInDateTimeString(dateString, this.getHourAndMinutesFromTimePoints(this.DAY_START).hour);

      return { start: startOfDay, end: endOfDay }
    }

    const startOfDay = this.setHourInDateTimeString(dateString, this.getHourAndMinutesFromTimePoints(this.DAY_START).hour);
    let endOfDay;
    if (this.DAY_END === DAY_TIME_POINT.TWELVE_AM) {
      endOfDay = this.setHourInDateTimeString(dateString, 23);
      endOfDay = this.setMinutesInDateTimeString(endOfDay, 59);
    } else {
      endOfDay = this.setHourInDateTimeString(dateString, this.getHourAndMinutesFromTimePoints(this.DAY_END).hour);
    }

    return { start: startOfDay, end: endOfDay }
  }

  doubleDigit(number: number) {
    if (number < 0 || number > 60) throw new Error('Invalid number. This is not a valid hour or minute')

    return number < 10 ? '0' + number : String(number);
  }
}

export class TimeBuilder {
  private weekStartsOn: WEEK_START_DAY = WEEK_START_DAY.MONDAY;
  private locale: string | null = null;
  private dayBoundaries: { start: DAY_TIME_POINT, end: DAY_TIME_POINT } = { start: 0, end: 2400 };

  build() {
    return new Time(this.weekStartsOn, this.locale, this.dayBoundaries);
  }

  withDayBoundaries(dayBoundaries: { start: DAY_TIME_POINT, end: DAY_TIME_POINT }) {
    this.dayBoundaries = dayBoundaries;

    return this;
  }

  withLocale(locale: string) {
    this.locale = locale;

    return this;
  }
}
