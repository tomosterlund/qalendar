import { mount } from "@vue/test-utils";
import DayEvent from "../../../../src/components/week/DayEvent.vue";
import { describe, expect, test } from "vitest";
import Time from "../../../../src/helpers/Time";
import { nextTick } from "vue";
import {mountComponent} from "../../../vitest-setup";
import {decode} from 'html-entities';
const dayEvent = mountComponent(mount, DayEvent)

describe("DayEvent.vue", () => {
  const propsForAllTests = {
    time: new Time("sunday", "en-US"),
    dayInfo: { daysTotalN: 7, thisDayIndex: 1 },
    mode: 'week',
  }

  test("Displaying the texts fed as props", () => {
    let wrapper = dayEvent({
      props: {
        eventProp: {
          id: "sdfgdfsda-435643-dsfghgd",
          title: "Biology lab",
          description: "Read textbook p. 70-72",
          topic: "Biology",
          with: "Tom Österlund",
          time: { start: "2022-05-20 09:00", end: "2022-05-20 10:00" },
          color: "blue",
        },
        config: {},
        ...propsForAllTests
      },
    });
    const titleElement = wrapper.find(".is-title");
    expect(titleElement.text()).toBe("Biology lab");

    const timeElement = wrapper.find(".is-time");
    expect(
      decode(timeElement.text())
    ).toBe("9:00 AM - 10:00 AM");

    const descriptionElement = wrapper.find(".is-description");
    expect(descriptionElement.text()).toBe("Read textbook p. 70-72");
  });

  test("Setting colors via a colorScheme", async () => {
    let wrapper = dayEvent({
      props: {
        eventProp: {
          id: "sdfgdfsda-435643-dsfghgd",
          title: "Biology lab",
          time: { start: "2022-05-20 09:00", end: "2022-05-20 10:00" },
          colorScheme: "ladies",
        },
        config: {
          style: {
            colorSchemes: {
              ladies: {
                color: "#fff",
                backgroundColor: "#ff4081",
              },
            },
          },
        },
        ...propsForAllTests
      },
    });

    const eventElement = wrapper.find(".calendar-week__event");

    wrapper.vm.setColors();
    await nextTick();
    expect(eventElement.attributes().style).toContain(
      "background-color: rgb(255, 64, 129)"
    ); // The pink BG
    expect(eventElement.attributes().style).toContain(
      "color: rgb(255, 255, 255)"
    ); // The white text
  });
});
