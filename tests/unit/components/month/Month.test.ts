import { mount } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import Month from "../../../../src/components/month/Month.vue";
import Time from "../../../../src/helpers/Time";
import { nextTick } from "vue";

describe("Month.vue", () => {
  const wrapper = mount(Month, {
    props: {
      eventsProp: [],

      time: new Time("monday", "de-DE"),
      config: {},
      period: {
        start: new Date(2023, 3 - 1, 1),
        end: new Date(2023, 3 - 1, 31),
        selectedDate: new Date(2023, 3 - 1, 23),
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
  test("Displaying the correct number of leading and trailing day", async () => {
    wrapper.vm.setMonth();
    await nextTick();
    const trailingAndLeadingDays = wrapper.findAll(".trailing-or-leading");
    console.log(trailingAndLeadingDays);
    
    expect(trailingAndLeadingDays).toHaveLength(4);
  });
});
