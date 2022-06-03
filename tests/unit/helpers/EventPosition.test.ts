import { describe, expect, test } from "vitest";
import EventPositionHelper from "../../../src/helpers/EventPosition";
const eventPositionHelper = new EventPositionHelper();

describe("EventPositionHelper.ts", () => {
  let wrapper;

  /**
   * (2022-02-16T08:00:00.000Z, 800, ????) should yield 0
   *
   * */
  test("Getting beginning of the day", () => {
    const startOfDay = eventPositionHelper.getPercentageOfDayFromDateTimeString(
      "2022-02-16 08:00",
      800,
      1000
    );

    expect(startOfDay).toEqual(0);
  });

  test("Getting half hour into 4 hour day", () => {
    const halfHourIntoDay =
      eventPositionHelper.getPercentageOfDayFromDateTimeString(
        "2022-02-16 08:30",
        800,
        1200
      );

    expect(halfHourIntoDay).toEqual(12.5);
  });

  test("Getting 4 hours into 8 hour day", () => {
    const midDay = eventPositionHelper.getPercentageOfDayFromDateTimeString(
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
    const time = eventPositionHelper.getPercentageOfDayFromDateTimeString(
      "2022-02-16 12:15",
      1000,
      1800
    );

    expect(time).toEqual(28.125);
  });
});
