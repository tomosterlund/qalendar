import {describe, expect, it} from "vitest";
import {WeekHelper} from "../../../src/helpers/Week";
import {TimeBuilder} from "../../../src/helpers/Time";

describe("WeekHelper", () => {

  it('Gets nHoursIntoDayFromHour for dayBoundaries 0 - 24 and hour 8', () => {
    const expectedHoursIntoDay = 8;
    const timeInstance = new TimeBuilder().build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(8, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  })

  it('Gets nHoursIntoDayFromHour for dayBoundaries 0 - 24 and hour 0', () => {
    const expectedHoursIntoDay = 0;
    const timeInstance = new TimeBuilder().build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(0, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  });

  it('Gets nHoursIntoDayFromHour for dayBoundaries 0 - 24 and hour 23', () => {
    const expectedHoursIntoDay = 23;
    const timeInstance = new TimeBuilder().build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(23, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  });

  it('Gets nHoursIntoDayFromHour for dayBoundaries 6 - 18 and hour 9', () => {
    const expectedHoursIntoDay = 3;
    const timeInstance = new TimeBuilder().withDayBoundaries({ start: 600, end: 1800 }).build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(9, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  });

  it('Gets nHoursIntoDayFromHour for dayBoundaries 6 - 18 and hour 6', () => {
    const expectedHoursIntoDay = 0;
    const timeInstance = new TimeBuilder().withDayBoundaries({ start: 600, end: 1800 }).build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(6, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  });

  it('Gets nHoursIntoDayFromHour for dayBoundaries 6 - 3 and hour 10', () => {
    const expectedHoursIntoDay = 4;
    const timeInstance = new TimeBuilder().withDayBoundaries({ start: 600, end: 300 }).build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(10, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  });

  it('Gets nHoursIntoDayFromHour for dayBoundaries 22 - 10 and hour 2', () => {
    const expectedHoursIntoDay = 4;
    const timeInstance = new TimeBuilder().withDayBoundaries({ start: 2200, end: 1000 }).build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(2, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  })

  it('Gets nHoursIntoDayFromHour for dayBoundaries 22 - 10 and hour 22', () => {
    const expectedHoursIntoDay = 0;
    const timeInstance = new TimeBuilder().withDayBoundaries({ start: 2200, end: 1000 }).build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(22, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  })

  it('Gets nHoursIntoDayFromHour for dayBoundaries 22 - 10 and hour 23', () => {
    const expectedHoursIntoDay = 1;
    const timeInstance = new TimeBuilder().withDayBoundaries({ start: 2200, end: 1000 }).build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(23, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  });

  it('Gets nHoursIntoDayFromHour for dayBoundaries 18 - 18 and hour 9', () => {
    const expectedHoursIntoDay = 15;
    const timeInstance = new TimeBuilder().withDayBoundaries({ start: 1800, end: 1800 }).build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(9, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  })

  it('Gets nHoursIntoDayFromHour for dayBoundaries 18 - 18 and hour 18', () => {
    const expectedHoursIntoDay = 0;
    const timeInstance = new TimeBuilder().withDayBoundaries({ start: 1800, end: 1800 }).build();
    const actualHoursIntoDay = WeekHelper.getNHoursIntoDayFromHour(18, timeInstance);
    expect(actualHoursIntoDay).toBe(expectedHoursIntoDay);
  });
})
