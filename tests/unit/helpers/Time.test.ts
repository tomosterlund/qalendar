import {describe, expect, it, test} from "vitest";
import Time, {TimeBuilder, WEEK_START_DAY} from "../../../src/helpers/Time";
import unidecode from "unidecode";
import {DAY_TIME_POINT} from "../../../src/typings/config.interface";
// Functionality which is sensitive to the class property FIRST_DAY_OF_WEEK
// needs to be tested with both "timeM" and "timeS"
const timeM = new Time(WEEK_START_DAY.MONDAY);
const timeS = new Time(WEEK_START_DAY.SUNDAY);

describe("Time.ts", () => {
  it("Gets a calendar week, based on date 2022-05-14", () => {
    const d = new Date(2022, 5 - 1, 14);
    const week = timeM.getCalendarWeekDateObjects(d);

    expect(week).toHaveLength(7);

    let expectedDate = 9;
    for (const day of week) {
      expect(day.getDate()).toEqual(expectedDate);
      expect(day.getMonth()).toEqual(4); // May
      expect(day.getFullYear()).toEqual(2022);

      expectedDate++;
    }
  });

  it("Gets a calendar week, based on date 2022-03-13 (week of daylight savings)", () => {
    const d = new Date(2022, 3 - 1, 13);
    const week = timeM.getCalendarWeekDateObjects(d);

    expect(week).toHaveLength(7);

    let expectedDate = 7;
    for (const day of week) {
      expect(day.getDate()).toEqual(expectedDate);
      expect(day.getMonth()).toEqual(2); // March
      expect(day.getFullYear()).toEqual(2022);

      expectedDate++;
    }
  });

  it("Gets a calendar week, situated in two months 2025-10-29", () => {
    const d = new Date(2025, 10 - 1, 29);
    const week = timeM.getCalendarWeekDateObjects(d);

    expect(week).toHaveLength(7);

    expect(week[0].getDate()).toEqual(27);
    expect(week[0].getMonth()).toEqual(9); // October
    expect(week[0].getFullYear()).toEqual(2025);

    expect(week[1].getDate()).toEqual(28);
    expect(week[1].getMonth()).toEqual(9); // October

    expect(week[5].getDate()).toEqual(1);
    expect(week[5].getMonth()).toEqual(10); // November

    expect(week[6].getDate()).toEqual(2);
    expect(week[6].getMonth()).toEqual(10); // November
  });

  it("Gets a calendar week, situated in two years 2025-12-29", () => {
    const d = new Date(2025, 12 - 1, 29);
    const week = timeM.getCalendarWeekDateObjects(d);

    expect(week).toHaveLength(7);

    expect(week[0].getDate()).toEqual(29);
    expect(week[0].getMonth()).toEqual(11); // December
    expect(week[0].getFullYear()).toEqual(2025);

    expect(week[2].getDate()).toEqual(31);
    expect(week[2].getMonth()).toEqual(11); // December
    expect(week[2].getFullYear()).toEqual(2025);

    expect(week[3].getDate()).toEqual(1);
    expect(week[3].getMonth()).toEqual(0); // January
    expect(week[3].getFullYear()).toEqual(2026);

    expect(week[6].getDate()).toEqual(4);
    expect(week[6].getMonth()).toEqual(0); // January
    expect(week[6].getFullYear()).toEqual(2026);
  });

  it("should get a calendar week based on Sunday being the first day", () => {
    const d = new Date(2025, 12 - 1, 29);
    const week = timeS.getCalendarWeekDateObjects(d);

    expect(week).toHaveLength(7);

    expect(week[0].getDate()).toEqual(28);
    expect(week[0].getMonth()).toEqual(11); // December
    expect(week[0].getFullYear()).toEqual(2025);

    expect(week[2].getDate()).toEqual(30);
    expect(week[2].getMonth()).toEqual(11); // December
    expect(week[2].getFullYear()).toEqual(2025);

    expect(week[4].getDate()).toEqual(1);
    expect(week[4].getMonth()).toEqual(0); // January
    expect(week[4].getFullYear()).toEqual(2026);

    expect(week[6].getDate()).toEqual(3);
    expect(week[6].getMonth()).toEqual(0); // January
    expect(week[6].getFullYear()).toEqual(2026);
  });

  it("should get a calendar month for 2022-05-14", () => {
    const month = timeM.getCalendarMonthSplitInWeeks(2022, 5 - 1);

    // Six weeks during the month
    expect(month).toHaveLength(6);

    const firstWeek = month[0];
    // Also get the days of the first week, that were in the previous month
    expect(firstWeek[0].getDate()).toEqual(25);
    expect(firstWeek[0].getMonth()).toEqual(4 - 1);
    expect(firstWeek[6].getDate()).toEqual(1);
    expect(firstWeek[6].getMonth()).toEqual(5 - 1);

    const secondWeek = month[1];
    expect(secondWeek[0].getDate()).toEqual(2);
    expect(secondWeek[0].getMonth()).toEqual(5 - 1);

    const lastWeek = month[5];
    expect(lastWeek[1].getDate()).toEqual(31);
    expect(lastWeek[1].getMonth()).toEqual(5 - 1);
    expect(lastWeek[6].getDate()).toEqual(5);
    expect(lastWeek[6].getMonth()).toEqual(6 - 1);
  });

  it("should get a calendar month for 2022-03-27, based on Sunday as first day", () => {
    const month = timeS.getCalendarMonthSplitInWeeks(2022, 3 - 1);

    // Six weeks during the month
    expect(month).toHaveLength(5);

    const firstWeek = month[0];
    // Also get the days of the first week, that were in the previous month
    expect(firstWeek[0].getDate()).toEqual(27);
    expect(firstWeek[0].getMonth()).toEqual(2 - 1);
    expect(firstWeek[2].getDate()).toEqual(1);
    expect(firstWeek[2].getMonth()).toEqual(3 - 1);
    expect(firstWeek[6].getDate()).toEqual(5);
    expect(firstWeek[6].getMonth()).toEqual(3 - 1);

    const thirdWeek = month[2];
    expect(thirdWeek[3].getDate()).toEqual(16);
    expect(thirdWeek[3].getMonth()).toEqual(3 - 1);

    const lastWeek = month[4];
    expect(lastWeek[4].getDate()).toEqual(31);
    expect(lastWeek[4].getMonth()).toEqual(3 - 1);
    expect(lastWeek[6].getDate()).toEqual(2);
    expect(lastWeek[6].getMonth()).toEqual(4 - 1);
  });

  it("should get a calendar month that is in two years, based on 2024-12-30", () => {
    const month = timeS.getCalendarMonthSplitInWeeks(2024, 12 - 1);

    expect(month).toHaveLength(5);

    const firstWeek = month[0];
    expect(firstWeek[0].getDate()).toEqual(1);
    expect(firstWeek[0].getMonth()).toEqual(12 - 1);
    expect(firstWeek[0].getFullYear()).toEqual(2024);

    const fourthWeek = month[3];
    expect(fourthWeek[5].getDate()).toEqual(27);
    expect(fourthWeek[5].getMonth()).toEqual(12 - 1);
    expect(fourthWeek[5].getFullYear()).toEqual(2024);

    const lastWeek = month[4];
    expect(lastWeek[2].getDate()).toEqual(31);
    expect(lastWeek[2].getMonth()).toEqual(12 - 1);
    expect(lastWeek[2].getFullYear()).toEqual(2024);

    expect(lastWeek[6].getDate()).toEqual(4);
    expect(lastWeek[6].getMonth()).toEqual(1 - 1);
    expect(lastWeek[6].getFullYear()).toEqual(2025);
  });

  it('should get calendar month January, with week.startsOn === "monday"', () => {
    const month = timeM.getCalendarMonthSplitInWeeks(2040, 1 - 1);
    expect(month).toHaveLength(6);

    const firstWeek = month[0];
    expect(firstWeek[0].getDate()).toBe(26);
    expect(firstWeek[6].getDate()).toBe(1);
    const thirdWeek = month[2];
    expect(thirdWeek[5].getDate()).toBe(14);
  });

  it('should get calendar month January, with week.startsOn === "sunday"', () => {
    const month = timeS.getCalendarMonthSplitInWeeks(2040, 1 - 1);
    expect(month).toHaveLength(5);

    const firstWeek = month[0];
    expect(firstWeek[0].getDate()).toBe(1);
  });

  it("should get the months of a year", () => {
    const year = timeM.getCalendarYearMonths(2027);

    expect(year).toHaveLength(12);
    expect(year[0].toLocaleDateString("de-DE", { month: "long" })).toEqual(
      "Januar"
    );

    expect(year[11].toLocaleDateString("de-DE", { month: "long" })).toEqual(
      "Dezember"
    );

    let monthIterator = 0;
    for (const month of year) {
      expect(month.getMonth()).toEqual(monthIterator);
      monthIterator++;
    }
  });

  it("should get a localized string, for each hour of the day", () => {
    const timeEnglish = new Time(WEEK_START_DAY.SUNDAY, "en-US");
    const hours = timeM.ALL_HOURS;

    let iterator = 0;
    while (iterator < 12) {
      expect(
        unidecode(timeEnglish.getHourLocaleStringFromHourDigits(hours[iterator]))
      ).toEqual(`${iterator === 0 ? "12" : iterator} AM`);

      iterator++;
    }

    while (iterator <= 23) {
      let expectedValue;

      if (iterator === 12) expectedValue = "12 PM";
      else if (iterator === 24) expectedValue = "12 AM";
      else expectedValue = `${iterator - 12} PM`;

      expect(
        unidecode(timeEnglish.getHourLocaleStringFromHourDigits(hours[iterator]))
      ).toEqual(expectedValue);

      iterator++;
    }
  });

  it("returns a localized name of the day, given a specified date", () => {
    // Long day names
    const timeEnglish = new Time(WEEK_START_DAY.SUNDAY, "en-US");

    const saturday = timeEnglish.getLocalizedNameOfWeekday(
      new Date(2022, 5 - 1, 14),
      "long"
    );
    expect(saturday).toEqual("Saturday");

    const thursday = timeEnglish.getLocalizedNameOfWeekday(
      new Date(2026, 1 - 1, 1),
      "long"
    );
    expect(thursday).toEqual("Thursday");

    // Short day names
    const timeSwedish = new Time(WEEK_START_DAY.MONDAY, "sv-SE");

    const loerdag = timeSwedish.getLocalizedNameOfWeekday(
      new Date(2022, 5 - 1, 14),
      "short"
    );
    expect(loerdag).toEqual("lör");

    const torsdag = timeSwedish.getLocalizedNameOfWeekday(
      new Date(2026, 1 - 1, 1),
      "short"
    );
    expect(torsdag).toEqual("tors");
  });

  it("returns a localized name of the month, given a specified date", () => {
    const timeEnglish = new Time(WEEK_START_DAY.MONDAY, "en-UK");

    // Try short month names
    const january = timeEnglish.getLocalizedNameOfMonth(
      new Date(2025, 1 - 1, 1),
      "short"
    );
    expect(january).toEqual("Jan");

    const december = timeEnglish.getLocalizedNameOfMonth(
      new Date(2025, 12 - 1, 1),
      "short"
    );
    expect(december).toEqual("Dec");

    // And long ones
    const timeGerman = new Time(WEEK_START_DAY.MONDAY, "de-DE");

    const maerz = timeGerman.getLocalizedNameOfMonth(
      new Date(2025, 3 - 1, 31),
      "long"
    );
    expect(maerz).toEqual("März");

    const august = timeGerman.getLocalizedNameOfMonth(
      new Date(2025, 8 - 1, 20),
      "long"
    );
    expect(august).toEqual("August");
  });

  it("returns a localized date string for US English", () => {
    const timeEnglish = new Time(WEEK_START_DAY.SUNDAY, "en-US");
    const d = new Date(2022, 5 - 1, 15);
    const dateString = timeEnglish.getLocalizedDateString(d);
    expect(dateString).toEqual("5/15/2022");
  });

  it("returns a localized date string for German", () => {
    const timeGerman = new Time(WEEK_START_DAY.MONDAY, "de-DE");
    const d = new Date(2022, 1 - 1, 1);
    const dateString = timeGerman.getLocalizedDateString(d);
    expect(dateString).toEqual("1.1.2022");
  });

  it("returns a time string YYYY-MM-DD hh:mm based on a date-object", () => {
    const firstOfFebruary = new Date(2020, 2 - 1, 1, 10, 30);
    expect(timeM.getDateTimeStringFromDate(firstOfFebruary, "start")).toBe(
      "2020-02-01 00:00"
    );

    const eleventhOfAugust = new Date(2031, 8 - 1, 11);
    expect(timeM.getDateTimeStringFromDate(eleventhOfAugust, "end")).toBe(
      "2031-08-11 23:59"
    );

    const twentiethOfDecember = new Date(2031, 12 - 1, 20, 20, 45);
    expect(timeM.getDateTimeStringFromDate(twentiethOfDecember)).toBe(
      "2031-12-20 20:45"
    );
  });

  it("tests getHourAndMinutesFromTimePoints", () => {
    const { hour: h1, minutes: m1 } = timeM.getHourAndMinutesFromTimePoints(0);
    expect(h1).toBe(0);
    expect(m1).toBe(0);

    const { hour: h2, minutes: m2 } =
      timeM.getHourAndMinutesFromTimePoints(1300);
    expect(h2).toBe(13);
    expect(m2).toBe(0);

    const { hour: h3, minutes: m3 } =
      timeM.getHourAndMinutesFromTimePoints(2300);
    expect(h3).toBe(23);
    expect(m3).toBe(0);
  });

  it("tests getLocalizedHours", () => {
    const englishTime = new Time(WEEK_START_DAY.SUNDAY, "en-US");
    const fourAM = new Date(2022, 0, 1, 4);
    expect(
      unidecode(englishTime.getLocalizedHour(fourAM))
    ).toBe("04 AM");

    const swedishTime = new Time(WEEK_START_DAY.MONDAY, "sv-SE");
    const elevenPM = new Date(0, 0, 1, 23);
    expect(
      unidecode(swedishTime.getLocalizedHour(elevenPM))
    ).toBe("23");
  });

  it("returns numeric values for year, month, date, hour and minutes, given a dateTimeString", () => {
    const dateTimeString = "2049-12-31 23:59";
    expect(timeM.getAllVariablesFromDateTimeString(dateTimeString)).toEqual({
      year: 2049,
      month: 11,
      date: 31,
      hour: 23,
      minutes: 59,
    });

    const futureDateTimeString = "2209-06-01 00:00";
    expect(
      timeM.getAllVariablesFromDateTimeString(futureDateTimeString)
    ).toEqual({
      year: 2209,
      month: 5,
      date: 1,
      hour: 0,
      minutes: 0,
    });
  });

  it("checks if a given date is in a given week", () => {
    const date1 = new Date(2022, 5 - 1, 23);
    const week1 = timeM.getCalendarWeekDateObjects(date1);
    expect(timeM.dateIsInWeek(date1, week1)).toBe(true);

    const date2 = new Date(2018, 12 - 1, 31);
    const week2 = [
      new Date(2018, 11, 31),
      new Date(2019, 0, 1),
      new Date(2019, 0, 2),
      new Date(2019, 0, 3),
      new Date(2019, 0, 4),
      new Date(2019, 0, 5),
      new Date(2019, 0, 6),
    ];
    expect(timeM.dateIsInWeek(date2, week2)).toBe(true);
    expect(timeM.dateIsInWeek(new Date(2018, 11, 30), week2)).toBe(false);
  });

  it('adds an hour to dateTimeString', () => {
    const minutesToAdd = 60
    const oldDateTime = '2022-06-21 07:39'

    const newDateTime = timeM.addMinutesToDateTimeString(minutesToAdd, oldDateTime)

    expect(newDateTime).toBe('2022-06-21 08:39')
  });

  it('adds 4 hours and 43 minutes to dateTimeString', () => {
    const minutesToAdd = 283
    const oldDateTime = '2022-12-31 23:59'

    const newDateTime = timeM.addMinutesToDateTimeString(minutesToAdd, oldDateTime)

    expect(newDateTime).toBe('2023-01-01 04:42')
  });

  it('adds 15 minutes to 23:44', () => {
    const minutesToAdd = 15
    const oldDateTime = '2023-03-17 23:44'

    const newDateTime = timeM.addMinutesToDateTimeString(minutesToAdd, oldDateTime)

    expect(newDateTime).toBe('2023-03-17 23:59')
  });

  it('adds 5 days to dateTimeString', () => {
    const daysToAdd = 5
    const oldDateTime = '2022-12-31 23:59'

    const newDateTime = timeM.addDaysToDateTimeString(daysToAdd, oldDateTime)

    expect(newDateTime).toBe('2023-01-05 23:59')
  });

  it('subtracts 1 day from dateTimeString', () => {
    const daysToAdd = -1
    const oldDateTime = '2030-01-01 23:59'

    const newDateTime = timeM.addDaysToDateTimeString(daysToAdd, oldDateTime)

    expect(newDateTime).toBe('2029-12-31 23:59')
  });

  it('Concludes that two date time strings have equal dates', () => {
    const string1 = '2040-09-28 12:47'
    const string2 = '2040-09-28 10:59'

    expect(timeM.dateStringsHaveEqualDates(string1, string2)).toBe(true)
  });

  it('Concludes that two date time strings have different dates', () => {
    const string1 = '1999-09-28 12:47'
    const string2 = '2999-09-28 10:59'

    expect(timeM.dateStringsHaveEqualDates(string1, string2)).toBe(false)
  });

  it('Sets the hour segment of a dateTimeString to 08:00', () => {
    const string1 = '2040-09-28 00:00'
    expect(timeM.setSegmentOfDateTimeString(string1, {hour: 8})).toBe('2040-09-28 08:00')
  })

  it('Sets the hour segment of a dateTimeString to 23:00', () => {
    const string1 = '2040-09-28 00:00'
    expect(timeM.setSegmentOfDateTimeString(string1, {hour: 23})).toBe('2040-09-28 23:00')
  });

  it('Throws an error, when trying to set the hour segment of a dateTimeString to 24:00', () => {
    const string1 = '2040-09-28 00:00'
    expect(() => timeM.setSegmentOfDateTimeString(string1, {hour: 24})).toThrow()
  })

  it('Concludes that the month of "date" is not the same as the passed month', () => {
    const date = new Date(2022, 6 - 1, 23)

    expect(timeM.isTrailingOrLeadingDate(date, 4)).toBe(true);
  });

  it('Concludes that the month of "date" is the same as the passed month', () => {
    const date = new Date(2022, 6 - 1, 23)

    expect(timeM.isTrailingOrLeadingDate(date, 5)).toBe(false);
  });

  it('Gets time points from a day boundary', () => {
    const midnight = 0;
    const noon = 12;
    const sixPM = 18;

    expect(Time.getTimePointsFromHour(midnight)).toBe(0);
    expect(Time.getTimePointsFromHour(noon)).toBe(1200);
    expect(Time.getTimePointsFromHour(sixPM)).toBe(1800);
  })

  it('Throws an error, when trying to get time points from a day boundary that is not an integer', () => {
    expect(() => Time.getTimePointsFromHour(12.5)).toThrow()
  })

  it('Throws an error, when trying to get time points from a day boundary that is not between 0 and 24', () => {
    expect(() => Time.getTimePointsFromHour(25)).toThrow()
    expect(() => Time.getTimePointsFromHour(-1)).toThrow()
  })

  it('Gets day boundaries from time points', () => {
    const midnight = 0;
    const noon = 1200;
    const sixPM = 1800;

    expect(Time.getHourFromTimePoints(midnight)).toBe(0);
    expect(Time.getHourFromTimePoints(noon)).toBe(12);
    expect(Time.getHourFromTimePoints(sixPM)).toBe(18);
  });

  it('Throws an error, when trying to get day boundaries from time points that are not integers', () => {
    expect(() => Time.getHourFromTimePoints(1200.5)).toThrow()
  });

  it('Throws an error, when trying to get day boundaries from time points that are not between 0 and 2400', () => {
    expect(() => Time.getHourFromTimePoints(2500)).toThrow()
    expect(() => Time.getHourFromTimePoints(-1)).toThrow()
  });

  it('Throws an error when trying to get day boundaries from time points that are not multiples of 100', () => {
    expect(() => Time.getHourFromTimePoints(123)).toThrow()
  });

  it('Gets the correct timeline hours for a full day', () => {
    const fullDayTimelineHours = timeM.getTimelineHours();
    expect(fullDayTimelineHours).toHaveLength(24);

    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.MIDNIGHT)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.ONE_AM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.TWO_AM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.THREE_AM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.FOUR_AM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.FIVE_AM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.SIX_AM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.SEVEN_AM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.EIGHT_AM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.NINE_AM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.TEN_AM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.ELEVEN_AM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.TWELVE_PM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.ONE_PM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.TWO_PM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.THREE_PM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.FOUR_PM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.FIVE_PM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.SIX_PM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.SEVEN_PM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.EIGHT_PM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.NINE_PM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.TEN_PM)).toBe(true);
    expect(fullDayTimelineHours.includes(DAY_TIME_POINT.ELEVEN_PM)).toBe(true);
  });

  it('Gets the correct timeline hours for a half day', () => {
    const timeInstance = new Time(
      WEEK_START_DAY.SUNDAY,
      'en',
      { start: DAY_TIME_POINT.TWELVE_PM, end: DAY_TIME_POINT.TWELVE_AM }
    );
    const halfDayTimelineHours = timeInstance.getTimelineHours();
    expect(halfDayTimelineHours).toHaveLength(12);

    expect(halfDayTimelineHours.includes(0)).toBe(false);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.MIDNIGHT)).toBe(false);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.ONE_AM)).toBe(false);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.TWO_AM)).toBe(false);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.THREE_AM)).toBe(false);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.FOUR_AM)).toBe(false);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.FIVE_AM)).toBe(false);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.SIX_AM)).toBe(false);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.SEVEN_AM)).toBe(false);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.EIGHT_AM)).toBe(false);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.NINE_AM)).toBe(false);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.TEN_AM)).toBe(false);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.ELEVEN_AM)).toBe(false);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.TWELVE_PM)).toBe(true);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.ONE_PM)).toBe(true);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.TWO_PM)).toBe(true);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.THREE_PM)).toBe(true);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.FOUR_PM)).toBe(true);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.FIVE_PM)).toBe(true);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.SIX_PM)).toBe(true);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.SEVEN_PM)).toBe(true);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.EIGHT_PM)).toBe(true);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.NINE_PM)).toBe(true);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.TEN_PM)).toBe(true);
    expect(halfDayTimelineHours.includes(DAY_TIME_POINT.ELEVEN_PM)).toBe(true);
  });

  it('Gets the correct timeline hours for a "day" stretched across two days', () => {
    const timeInstance = new Time(
      WEEK_START_DAY.SUNDAY,
      'en',
      { start: DAY_TIME_POINT.FOUR_AM, end: DAY_TIME_POINT.TWO_AM }
    );

    const stretchedDayTimelineHours = timeInstance.getTimelineHours();

    expect(stretchedDayTimelineHours).toHaveLength(22);

    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.FOUR_AM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.FIVE_AM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.SIX_AM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.SEVEN_AM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.EIGHT_AM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.NINE_AM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.TEN_AM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.ELEVEN_AM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.TWELVE_PM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.ONE_PM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.TWO_PM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.THREE_PM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.FOUR_PM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.FIVE_PM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.SIX_PM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.SEVEN_PM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.EIGHT_PM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.NINE_PM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.TEN_PM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.ELEVEN_PM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.MIDNIGHT)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.ONE_AM)).toBe(true);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.TWO_AM)).toBe(false);
    expect(stretchedDayTimelineHours.includes(DAY_TIME_POINT.THREE_AM)).toBe(false);
  });

  /**
   * (2022-02-16T08:00:00.000Z, 800, ????) should yield 0
   *
   * */
  test("Getting beginning of the day", () => {
    const startOfDay = timeM.getPercentageOfDayFromDateTimeString(
      "2022-02-16 08:00",
      800,
      1000
    );

    expect(startOfDay).toEqual(0);
  });

  test("Getting half hour into 4 hour day", () => {
    const halfHourIntoDay =
      timeM.getPercentageOfDayFromDateTimeString(
        "2022-02-16 08:30",
        800,
        1200
      );

    expect(halfHourIntoDay).toEqual(12.5);
  });

  test("Getting 4 hours into 8 hour day", () => {
    const midDay = timeM.getPercentageOfDayFromDateTimeString(
      "2022-02-16 14:00",
      1000,
      1800
    );

    expect(midDay).toEqual(50);
  });

  /**
   * 2 hours and 15 minutes = 225 points
   * (225 / 800) * 100 = 28.125
   * */
  test("Getting 2 hours and 15 minutes into 9 hour day", () => {
    const time = timeM.getPercentageOfDayFromDateTimeString(
      "2022-02-16 12:15",
      1000,
      1800
    );

    expect(time).toEqual(28.125);
  });

  test("Getting start of day for calendar day spanning two real days", () => {
    const percentageIntoDay = timeM.getPercentageOfDayFromDateTimeString(
      "2022-02-16 22:00",
      2200,
      100
    );

    expect(percentageIntoDay).toEqual(0);
  })

  test("Getting middle of day for calendar day spanning two real days", () => {
    const percentageIntoDay = timeM.getPercentageOfDayFromDateTimeString(
      "2022-02-16 00:00",
      2200,
      200,
    )

    expect(percentageIntoDay).toEqual(50);

    const anotherPercentageIntoDay = timeM.getPercentageOfDayFromDateTimeString(
      "2022-02-16 02:00",
      1700,
      300
    );

    expect(anotherPercentageIntoDay).toEqual(90);
  })

  test("Getting non full-hour event at end of 2-day-spanning day", () => {
    const percentageIntoDay = timeM.getPercentageOfDayFromDateTimeString(
      "2022-02-16 01:25",
      400,
      200
    );

    expect(+percentageIntoDay.toFixed(2)).toEqual(97.35);
  })

  test("Getting date string from date time string", () => {
    const dateString1 = timeM.dateStringFrom("2022-02-16 01:25");
    expect(dateString1).toEqual("2022-02-16");

    const dateString2 = timeM.dateStringFrom("2030-01-01 00:00");
    expect(dateString2).toEqual("2030-01-01");
  })

  test("Getting time string from date time string", () => {
    const timeString1 = timeM.timeStringFrom("2022-02-16 01:25");
    expect(timeString1).toEqual("01:25");

    const timeString2 = timeM.timeStringFrom("2030-01-01 00:00");
    expect(timeString2).toEqual("00:00");
  });

  test("Getting hour from date time string", () => {
    const hour1 = timeM.hourFrom("2022-02-16 01:25");
    expect(hour1).toEqual(1);

    const hour2 = timeM.hourFrom("2030-01-01 00:00");
    expect(hour2).toEqual(0);
  })

  test("Getting minutes from date time string", () => {
    const minutes1 = timeM.minutesFrom("2022-02-16 01:25");
    expect(minutes1).toEqual(25);

    const minutes2 = timeM.minutesFrom("2030-01-01 00:00");
    expect(minutes2).toEqual(0);
  })

  test("If two days are consecutive", () => {
    const consecutive = timeM.areDaysConsecutive(
      "2022-02-16 01:25",
      "2022-02-17 01:25"
    );

    expect(consecutive).toBe(true);
  });

  test("If two days are not consecutive", () => {
    const consecutive = timeM.areDaysConsecutive(
      "2022-02-16 01:25",
      "2022-02-18 01:25"
    );

    expect(consecutive).toBe(false);
  });

  test("If two equal days are consecutive", () => {
    const consecutive = timeM.areDaysConsecutive(
      "2022-02-16 01:25",
      "2022-02-16 01:25"
    );

    expect(consecutive).toBe(false);
  });

  test("Setting hour in date time string", () => {
    const newDateTimeString = timeM.setHourInDateTimeString(
      "2022-02-16 01:25",
      2
    );
    expect(newDateTimeString).toEqual("2022-02-16 02:25");

    const newDateTimeString2 = timeM.setHourInDateTimeString(
      "2022-12-31 23:00",
      0
    )
    expect(newDateTimeString2).toEqual("2022-12-31 00:00");
  });

  test("Setting minutes in date time string", () => {
    const newDateTimeString = timeM.setMinutesInDateTimeString(
      "2022-02-16 01:25",
      2
    );
    expect(newDateTimeString).toEqual("2022-02-16 01:02");

    const newDateTimeString2 = timeM.setMinutesInDateTimeString(
      "2022-12-31 23:59",
      0
    )
    expect(newDateTimeString2).toEqual("2022-12-31 23:00");
  });

  test("setting date time strings for day boundaries 6AM - 2AM", () => {
    const dateString = "2022-02-16 00:00";

    const timeInstance = new TimeBuilder()
      .withDayBoundaries({ start: 600, end: 200 })
      .build();

    const actualDateStringDayBoundaries = timeInstance.getDateTimeStringDayBoundariesFrom(dateString);

    expect(actualDateStringDayBoundaries.start).toEqual("2022-02-16 06:00");
    expect(actualDateStringDayBoundaries.end).toEqual("2022-02-17 02:00");
  });

  test("Setting date time strings for day boundaries 12AM - 12AM", () => {
    const dateString = "2022-02-16 00:00";

    const timeInstance = new TimeBuilder()
      .withDayBoundaries({ start: 0, end: 2400 })
      .build();

    const actualDateStringDayBoundaries = timeInstance.getDateTimeStringDayBoundariesFrom(dateString);

    expect(actualDateStringDayBoundaries.start).toEqual("2022-02-16 00:00");
    expect(actualDateStringDayBoundaries.end).toEqual("2022-02-16 23:59");
  })

  test("Setting date time strings for day boundaries 6PM - 5AM, end date being in next year", () => {
    const dateString = "2022-12-31 00:00";

    const timeInstance = new TimeBuilder()
      .withDayBoundaries({ start: 1800, end: 500 })
      .build();

    const actualDateStringDayBoundaries = timeInstance.getDateTimeStringDayBoundariesFrom(dateString);
    expect(actualDateStringDayBoundaries.start).toEqual("2022-12-31 18:00");
    expect(actualDateStringDayBoundaries.end).toEqual("2023-01-01 05:00");
  })

  test("Setting date time strings for day boundaries 3AM to 10PM", () => {
    const dateString = "2022-12-31 00:00";

    const timeInstance = new TimeBuilder()
      .withDayBoundaries({ start: 300, end: 2200 })
      .build();

    const actualDateStringDayBoundaries = timeInstance.getDateTimeStringDayBoundariesFrom(dateString);
    expect(actualDateStringDayBoundaries.start).toEqual("2022-12-31 03:00");
    expect(actualDateStringDayBoundaries.end).toEqual("2022-12-31 22:00");
  })

  test('setting a date to end of day', () => {
    const date = new Date(2022, 1, 1, 12, 30, 22, 976);
    const expectedHour = 23;
    const expectedMinutes = 59;
    const expectedSeconds = 59;
    const expectedMilliseconds = 999;
    const updatedDate = timeM.setDateToEndOfDay(date);
    expect(updatedDate.getHours()).toEqual(expectedHour);
    expect(updatedDate.getMinutes()).toEqual(expectedMinutes);
    expect(updatedDate.getSeconds()).toEqual(expectedSeconds);
    expect(updatedDate.getMilliseconds()).toEqual(expectedMilliseconds);
  })

  test('should get localized a time string for US-English', () => {
    const actualTimeString = timeM.getLocalizedTime('2022-02-16 01:25');
    expect(actualTimeString).toEqual('1:25 AM');
  })

  test('should get a localized time string for German', () => {
    const underTest = new TimeBuilder().withLocale('de-DE').build();
    const actualTimeString = underTest.getLocalizedTime('2022-02-16 01:25');
    expect(actualTimeString).toEqual('01:25');
  })

  test('should get localized start and end time separated by a dash', () => {
    const actualTimeString = timeM.getLocalizedTimeRange('2022-02-16 01:25', '2022-02-16 02:25');
    expect(actualTimeString).toEqual('1:25 AM - 2:25 AM');
  })
});

describe('Time/getTimeFromClick regular day', () => {
  const underTest = new TimeBuilder().build();

  it('should throw an error if weekHeight is 0', () => {
    const weekHeight = 0;
    expect(() => underTest.getTimeFromClick(0, weekHeight)).toThrow();
  });

  it('should throw an error if clickOffsetY is a negative number', () => {
    const clickOffsetY = -1;
    expect(() => underTest.getTimeFromClick(clickOffsetY, 100)).toThrow();
  });

  it('should return "00:00" if clickOffsetY is 0', () => {
    const clickOffsetY = 0;
    const actualTime = underTest.getTimeFromClick(clickOffsetY, 100);
    expect(actualTime).toBe('00:00');
  });

  it('should return "12:00 if clickOffsetY is half of weekHeight and a day is from 0 - 24', () => {
    const clickOffsetY = 500;
    const actualTime = underTest.getTimeFromClick(clickOffsetY, 1000);
    expect(actualTime).toBe('12:00');
  });

  it('should return 18:00 if clickOffsetY is 3/4 of weekHeight and a day is from 0 - 24', () => {
    const clickOffsetY = 750;
    const actualTime = underTest.getTimeFromClick(clickOffsetY, 1000);
    expect(actualTime).toBe('18:00');
  });

  it('should return 18:45', () => {
    const weekHeight = 960;
    const clickOffsetY = weekHeight - 210; // height - 5 hours and 1 quarter of an hour
    const actualTime = underTest.getTimeFromClick(clickOffsetY, weekHeight);
    expect(actualTime).toBe('18:45');
  })
});

describe('Time/getTimeFromClick day with custom day boundaries', () => {
  const underTest = new TimeBuilder()
  .withDayBoundaries({ start: 600, end: 1800 })
  .build();

  it('should return 08:00 if clickOffsetY is 200 and weekHeight is 1200', () => {
    const weekHeight = 1200;
    const clickOffsetY = 200;
    const actualTime = underTest.getTimeFromClick(clickOffsetY, weekHeight);
    expect(actualTime).toBe('08:00');
  });

  it('should return 12:00 if clickOffsetY is 600 and weekHeight is 1200', () => {
    const weekHeight = 1200;
    const clickOffsetY = 600;
    const actualTime = underTest.getTimeFromClick(clickOffsetY, weekHeight);
    expect(actualTime).toBe('12:00');
  });

  it('should return 16:15', () => {
    const weekHeight = 1200;
    const clickOffsetY = 1025;
    const actualTime = underTest.getTimeFromClick(clickOffsetY, weekHeight);
    expect(actualTime).toBe('16:15');
  });

  it('should return 17:50', () => {
    const weekHeight = 1200;
    const clickOffsetY = 1184;
    const actualTime = underTest.getTimeFromClick(clickOffsetY, weekHeight);
    expect(actualTime).toBe('17:50');
  });
});

describe('Time/getTimeFromClick day when DAY_END < DAY_START', () => {
  const underTest = new TimeBuilder()
  .withDayBoundaries({ start: 1800, end: 600 })
  .build();

  it('should return 21:00 if clickOffsetY is 300 and weekHeight is 1200', () => {
    const weekHeight = 1200;
    const clickOffsetY = 300;
    const actualTime = underTest.getTimeFromClick(clickOffsetY, weekHeight);
    expect(actualTime).toBe('21:00');
  });

  it('should return 03:00 if clickOffsetY is 900 and weekHeight is 1200', () => {
    const weekHeight = 1200;
    const clickOffsetY = 900;
    const actualTime = underTest.getTimeFromClick(clickOffsetY, weekHeight);
    expect(actualTime).toBe('03:00');
  });

  it('should return 05:15', () => {
    const weekHeight = 1200;
    const clickOffsetY = 1125;
    const actualTime = underTest.getTimeFromClick(clickOffsetY, weekHeight);
    expect(actualTime).toBe('05:15');
  })
});

describe('Time/getTimeFromClick day when DAY_END & DAY_START === 5', () => {
  const underTest = new TimeBuilder()
  .withDayBoundaries({ start: 500, end: 500 })
  .build();

  it('should return 05:00 if clickOffsetY is 0 and weekHeight is 1200', () => {
    const weekHeight = 1200;
    const clickOffsetY = 0;
    const actualTime = underTest.getTimeFromClick(clickOffsetY, weekHeight);
    expect(actualTime).toBe('05:00');
  });

  it('should return 04:00 if clickOffsetY is 1150 and weekHeight is 1200', () => {
    const weekHeight = 1200;
    const clickOffsetY = 1150;
    const actualTime = underTest.getTimeFromClick(clickOffsetY, weekHeight);
    expect(actualTime).toBe('04:00');
  })

  it('should return 04:30 if clickOffsetY is 1175 and weekHeight is 1200', () => {
    const weekHeight = 1200;
    const clickOffsetY = 1175;
    const actualTime = underTest.getTimeFromClick(clickOffsetY, weekHeight);
    expect(actualTime).toBe('04:30');
  })

  it('should return 17:00 if clickOffsetY is 600 and weekHeight is 1200', () => {
    const weekHeight = 1200;
    const clickOffsetY = 600;
    const actualTime = underTest.getTimeFromClick(clickOffsetY, weekHeight);
    expect(actualTime).toBe('17:00');
  })
});

describe('Time/doubleDigit', () => {
  const underTest = new TimeBuilder().build();

  it('should throw an error if number is negative', () => {
    const number = -1;
    expect(() => underTest.doubleDigit(number)).toThrow();
  });

  it('should throw an error if number is greater than 61', () => {
    const number = 61;
    expect(() => underTest.doubleDigit(number)).toThrow();
  });

  it('should return "00" if number is 0', () => {
    const number = 0;
    const actual = underTest.doubleDigit(number);
    expect(actual).toBe('00');
  });

  it('should return "01" if number is 1', () => {
    const number = 1;
    const actual = underTest.doubleDigit(number);
    expect(actual).toBe('01');
  });

  it('should return "09" if number is 9', () => {
    const number = 9;
    const actual = underTest.doubleDigit(number);
    expect(actual).toBe('09');
  })

  it('should return "10" if number is 10', () => {
    const number = 10;
    const actual = underTest.doubleDigit(number);
    expect(actual).toBe('10');
  });

  it('should return "23" if number is 23', () => {
    const number = 23;
    const actual = underTest.doubleDigit(number);
    expect(actual).toBe('23');
  });
});
