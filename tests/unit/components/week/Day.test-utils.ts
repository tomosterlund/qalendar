import Time, { WEEK_START_DAY } from "../../../../src/helpers/Time";

export const defaultOptions = {
  props: {
    weekHeight: 2400,
    time: new Time(WEEK_START_DAY.SUNDAY, "en-US"),
    day: {
      dayName: "Sunday",
      dateTimeString: "2022-05-22 00:00",
      events: [
        {
          title: "Foo",
          time: { start: "2022-05-22 00:00", end: "2022-05-22 01:00" },
          id: "1",
        },
        {
          title: "Bar",
          time: { start: "2022-05-22 00:00", end: "2022-05-22 01:00" },
          id: "2",
        },
        {
          title: "Baz",
          time: { start: "2022-05-22 01:00", end: "2022-05-22 02:00" },
          id: "3",
        },
      ],
    },
    config: {},
    dayIntervals: {
      length: 15,
      height: 15,
      displayClickableInterval: true,
    },
    mode: 'week',
    dayInfo: { daysTotalN: 7, thisDayIndex: 1, dateTimeString: "2022-05-22 00:00" },
  },
}

export const intervalBackgroundColor = "red";
export const intervalColor = "white";

export const optionsWithIntervalStyles = {
  props: {
    ...defaultOptions.props,
    config: {
      dayIntervals: {
        length: 15,
        height: 15,
        displayClickableInterval: true,
        intervalStyles: {
          backgroundColor: intervalBackgroundColor,
          color: intervalColor,
        }
      }
    }
  }
}
