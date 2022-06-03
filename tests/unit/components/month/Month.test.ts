import { mount } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import Month from "../../../../src/components/month/Month.vue";
import Time from "../../../../src/helpers/Time";
import { nextTick } from "vue";

describe("Month.vue", () => {
  let wrapper = mount(Month, {
    props: {
      events: [],

      time: new Time("monday", "de-DE"),
      config: {},
      period: {
        start: new Date(2022, 5 - 1, 1),
        end: new Date(2022, 5 - 1, 31),
        selectedDate: new Date(2022, 5 - 1, 23),
      },
    },
  });

  test("Displaying the correct number of weeks and days", async () => {
    wrapper.vm.setMonth();
    await nextTick();
    const calendarWeeks = wrapper.findAll(".calendar-month__week");
    expect(calendarWeeks).toHaveLength(6);
    const calendarWeekdays = wrapper.findAll(".calendar-month__weekday");
    expect(calendarWeekdays).toHaveLength(42);
  });
});
