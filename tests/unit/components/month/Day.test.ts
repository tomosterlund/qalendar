import { mount } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import Day from "../../../../src/components/month/Day.vue";
import Time from "../../../../src/helpers/Time";
import {mountComponent} from "../../../vitest-setup";
const day = mountComponent(mount, Day)

describe("Day.vue", () => {
  const propsForAllTests = {
    dayInfo: { daysTotalN: 7, thisDayIndex: 1 },
    config: {},
    time: new Time("sunday", "en-US"),
    mode: 'week',
  }

  let wrapper = day({
    props: {
      day: {
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
        dayName: "Monday",
        dateTimeString: "2022-05-23 16:38",
      },
      ...propsForAllTests
    },
  });

  test("Displaying all events passed as props", () => {
    const dayEvents = wrapper.findAll(".calendar-month__event");
    expect(dayEvents).toHaveLength(3);
  });

  test("Displaying the date of the day", () => {
    const dateDisplay = wrapper.find(".calendar-month__day-date");
    expect(dateDisplay.text()).toBe("23");
  });

  test("Emitting event day-was-clicked when the body of a day is clicked", async () => {
    const dayBody = wrapper.find(".calendar-month__weekday");
    await dayBody.trigger("click");
    expect(wrapper.emitted("day-was-clicked")).toBeTruthy();
  })

  // Comment in, if @click.self starts working in Vue test utils
  // test("Not emitting day-was-clicked, when a child element of the day is clicked", async () => {
  //   const dayEvent = wrapper.find(".calendar-month__day-date");
  //   await dayEvent.trigger("click");
  //   expect(wrapper.emitted("day-was-clicked")).toBeFalsy();
  // })

  test("Displaying the day name, if the isFirstWeek-prop === true", () => {
    wrapper = day({
      props: {
        day: { events: [], dayName: "Mon", dateTimeString: "2022-05-23 16:38" },
        isFirstWeek: true,
        ...propsForAllTests
      },
    });

    const dayName = wrapper.find(".calendar-month__day-name");
    expect(dayName.text()).toContain("Mon");
  });
});
