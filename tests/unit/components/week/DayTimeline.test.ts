import { mount } from "@vue/test-utils";
import DayTimeline from "../../../../src/components/week/DayTimeline.vue";
import { describe, expect, test } from "vitest";
import Time from "../../../../src/helpers/Time";
import unidecode from 'unidecode';

describe("DayTimeline.vue", () => {
  const propsForAll = {
    time: new Time("sunday", "en-US"),
    weekHeight: '1600px',
  }

  let wrapper = mount(DayTimeline, {
    props: propsForAll,
  });

  test("Rendering all 24 hours", () => {
    const hours = wrapper.findAll(".day-timeline__hour");
    expect(hours).toHaveLength(24);
  });

  test("Displaying en-US localized hours", () => {
    const hours = wrapper.findAll(".day-timeline__hour");
    expect(
      unidecode(hours[1].text())
    ).toContain("01 AM");

    expect(
      unidecode(hours[12].text())
    ).toContain("12 PM");
  });
});
