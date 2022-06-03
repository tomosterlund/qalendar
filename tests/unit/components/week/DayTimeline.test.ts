import { mount } from "@vue/test-utils";
import DayTimeline from "../../../../src/components/week/DayTimeline.vue";
import { describe, expect, test } from "vitest";
import Time from "../../../../src/helpers/Time";
import { eventInterface } from "../../../../src/typings/interfaces/event.interface";

describe("DayTimeline.vue", () => {
  let wrapper = mount(DayTimeline, {
    props: {
      time: new Time("sunday", "en-US"),
    },
  });

  test("Rendering all 24 hours", () => {
    const hours = wrapper.findAll(".day-timeline__hour");
    expect(hours).toHaveLength(24);
  });

  test("Displaying en-US localized hours", () => {
    const hours = wrapper.findAll(".day-timeline__hour");
    expect(hours[1].text()).toContain("01 AM");
    expect(hours[12].text()).toContain("12 PM");
  });
});
