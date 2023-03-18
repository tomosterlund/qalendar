import {mount} from "@vue/test-utils";
import DayEvent from "../../../../src/components/week/DayEvent.vue";
import {describe, expect, test, it, vi } from "vitest";
import Time, {WEEK_START_DAY} from "../../../../src/helpers/Time";
import {nextTick} from "vue";
import {mountComponent} from "../../../vitest-setup";
import unidecode from 'unidecode';
import {EventBuilder} from "../../../../src/models/Event";
import {EVENT_COLORS} from "../../../../src/constants";

const dayEvent = mountComponent(mount, DayEvent)

describe("DayEvent.vue", () => {
  const propsForAllTests = {
    time: new Time(WEEK_START_DAY.SUNDAY, "en-US"),
    dayInfo: { daysTotalN: 7, thisDayIndex: 1, dateTimeString: "2022-05-20" },
    config: {},
    mode: 'week',
  }

  it("should display the title of av event", () => {
    const event = new EventBuilder({ start: "2022-05-20 09:00", end: "2022-05-20 10:00" })
      .withTitle("Biology lab")
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      },
    });
    const titleElement = wrapper.find(".is-title");
    expect(titleElement.text()).toBe("Biology lab");
    //
    // const withElement = wrapper.find(".is-with");
    // expect(withElement.text()).toBe("Tom Österlund");
  });

  it('should display the time of an event', () => {
    const event = new EventBuilder({ start: "2022-05-20 09:00", end: "2022-05-20 10:00" })
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      },
    });
    const timeElement = wrapper.find(".is-time");
    expect(
      unidecode(timeElement.text())
    ).toBe("9:00 AM - 10:00 AM");
  });

  it('should display the description of an event', () => {
    const expectedDescription = "Read textbook p. 70-72";
    const event = new EventBuilder({ start: "2022-05-20 09:00", end: "2022-05-20 10:00" })
      .withDescription(expectedDescription)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      },
    });
    const descriptionElement = wrapper.find(".is-description");
    expect(descriptionElement.text()).toBe(expectedDescription);
  })

  it('should display the topic of an event', () => {
    const expectedTopic = "Biology";
    const event = new EventBuilder({ start: "2022-05-20 09:00", end: "2022-05-20 10:00" })
      .withTopic(expectedTopic)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      },
    });
    const topicElement = wrapper.find(".is-topic");
    expect(topicElement.text()).toBe(expectedTopic);
  })

  it('should display the "with" property of an event', () => {
    const expectedWith = "Tom Österlund";
    const event = new EventBuilder({ start: "2022-05-20 09:00", end: "2022-05-20 10:00" })
      .withWith(expectedWith)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      }
    })

    const withElement = wrapper.find(".is-with");
    expect(withElement.text()).toBe(expectedWith);
  })

  it('should display the location of an event', () => {
    const expectedLocation = "School";
    const event = new EventBuilder({ start: "2022-05-20 09:00", end: "2022-05-20 10:00" })
      .withLocation(expectedLocation)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      },
    });
    const locationElement = wrapper.find(".is-location");
    expect(locationElement.text()).toBe(expectedLocation);
  });

  it("should set background-color via a colorScheme", async () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    })
      .withColorScheme("ladies")
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
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

  it("should set background-color via a color", async () => {
    const expectedColor = 'green';
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    })
      .withColor(expectedColor)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      },
    });

    const eventElement = wrapper.find(".calendar-week__event");

    wrapper.vm.setColors();
    await nextTick();
    expect(eventElement.attributes().style).toContain(
      `background-color: ${EVENT_COLORS[expectedColor]}`
    ); // The green BG
    expect(eventElement.attributes().style).toContain(
      "color: rgb(255, 255, 255)"
    ); // The white text
  })

  it("should set blue as default background color", async () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    }).withColor('blue').build()

    const wrapper = dayEvent({
      props: {
        eventProp: event,
        ...propsForAllTests
      }
    });

    const eventElement = wrapper.find(".calendar-week__event");
    wrapper.vm.setColors();
    await nextTick();
    expect(eventElement.attributes().style).toContain(
      `background-color: ${EVENT_COLORS.blue}`
    )
  })

  it('should emit "drag-end" on mouseup after dragging', () => {
    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: {
          id: "sdfgdfsda-435643-dsfghgd",
          title: "Biology lab",
          time: { start: "2022-05-20 09:00", end: "2022-05-20 10:00" },
        },
      },
    });

    expect(wrapper.emitted('drag-end')).toBe(undefined);
    wrapper.vm.onMouseUpWhenDragging();
    expect(wrapper.emitted('drag-end')).toBeTruthy();
  })
});
