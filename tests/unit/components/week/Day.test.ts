import { mount } from "@vue/test-utils";
import Day from "../../../../src/components/week/Day.vue";
import { describe, expect, test } from "vitest";
import Time from "../../../../src/helpers/Time";

describe("Day.vue", () => {
  let wrapper = mount(Day, {
    props: {
      time: new Time("sunday", "en-US"),
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
      dayInfo: { daysTotalN: 7, thisDayIndex: 1 },
    },
  });

  test("Rendering three events", () => {
    const events = wrapper.findAll(".calendar-week__event");
    expect(events).toHaveLength(3);
  });

  test('Rendering the clickable events', () => {
    const intervals = wrapper.findAll(".calendar-week__day-interval");
    // 98 = (15 minute intervals * 4 for an hour) * 24 hours for a day
    expect(intervals).toHaveLength(96);
  })

  test('Rendering the clickable events', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('interval-was-clicked');
    const firstInterval = wrapper.find(".calendar-week__day-interval");
    await firstInterval.trigger("click");
    expect(wrapper.emitted().click).toHaveLength(1);
    expect(wrapper.emitted()).toHaveProperty('interval-was-clicked');
    expect(wrapper.emitted('interval-was-clicked')).toEqual([[{ "intervalStart": "2022-05-22 00:00", "intervalEnd": "2022-05-22 00:15" }]]);
  })

  test('Emitting event day-was-clicked', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('day-was-clicked');
    const day = wrapper.find(".calendar-week__day");
    await day.trigger("click");
    expect(wrapper.emitted()).toHaveProperty('day-was-clicked');
    expect(wrapper.emitted('day-was-clicked'));
  })
});
