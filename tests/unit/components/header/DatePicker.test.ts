import { describe, expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import Time from "../../../../src/helpers/Time";
import DatePicker from "../../../../src/components/header/DatePicker.vue";
import {mountComponent} from "../../../vitest-setup";
const datePicker = mountComponent(mount, DatePicker)

describe("DatePicker.vue", () => {
  let wrapper: any;

  const openDatePicker = async () => {
    const datePicker = wrapper.find(".c-date-picker__value-display");
    await datePicker.trigger("click");
  };

  test("Opening the date picker", async () => {
    wrapper = datePicker({
      props: {
        timeProp: new Time("monday", "en-US"),
        periodProp: {
          selectedDate: new Date(2022, 5 - 1, 1),
          start: new Date(),
          end: new Date(),
        },
      },
    });
    await openDatePicker();
    const period = wrapper.find(".c-date-picker__toggle-mode");
    expect(period.text()).toBe("May 2022");
  });

  test("Navigating a month back: January => December", async () => {
    wrapper = datePicker({
      props: {
        timeProp: new Time("monday", "en-US"),
        periodProp: {
          selectedDate: new Date(2022, 1 - 1, 4),
          start: new Date(),
          end: new Date(),
        },
      },
    });
    await openDatePicker();
    await wrapper.find(".is-chevron-left").trigger("click");
    const period = wrapper.find(".c-date-picker__toggle-mode");
    expect(period.text()).toBe("December 2021");
  });

  test("Navigating a month forward: December => January", async () => {
    wrapper = datePicker({
      props: {
        timeProp: new Time("monday", "en-US"),
        periodProp: {
          selectedDate: new Date(2023, 12 - 1, 16),
          start: new Date(),
          end: new Date(),
        },
      },
    });
    await openDatePicker();
    await wrapper.find(".is-chevron-right").trigger("click");
    const period = wrapper.find(".c-date-picker__toggle-mode");
    expect(period.text()).toBe("January 2024");
  });

  test("Navigating between months via the month picker", async () => {
    wrapper = datePicker({
      props: {
        timeProp: new Time("monday", "de-DE"),
        periodProp: {
          selectedDate: new Date(2023, 12 - 1, 16),
          start: new Date(),
          end: new Date(),
        },
      },
    });
    await openDatePicker();
    await wrapper.find(".c-date-picker__toggle-mode").trigger("click");
    const months = wrapper.findAll(".has-month");
    await months[5].trigger("click");
    const period = wrapper.find(".c-date-picker__toggle-mode");
    expect(period.text()).toBe("Juni 2023");
  });

  test("Navigating between years via the month picker", async () => {
    wrapper = datePicker({
      props: {
        timeProp: new Time("monday", "de-DE"),
        periodProp: {
          selectedDate: new Date(2032, 10 - 1, 16),
          start: new Date(),
          end: new Date(),
        },
      },
    });
    await openDatePicker();

    await wrapper.find(".c-date-picker__toggle-mode").trigger("click");

    const chevronLeft = await wrapper.find(".is-chevron-left");
    await chevronLeft.trigger("click");
    await chevronLeft.trigger("click");
    await chevronLeft.trigger("click");
    let period = wrapper.find(".c-date-picker__toggle-mode");
    expect(period.text()).toBe("2029");

    await wrapper.find(".is-chevron-right").trigger("click");
    expect(period.text()).toBe("2030");

    const months = wrapper.findAll(".has-month");
    await months[11].trigger("click");
    period = wrapper.find(".c-date-picker__toggle-mode");
    expect(period.text()).toBe("Dezember 2030");
  });

  test("Emitting the correct event, when used as a stand-alone component", async () => {
    wrapper = datePicker({
      props: {
        locale: "sv-SE",
        firstDayOfWeek: "monday",
      },
    });

    await wrapper.setData({ showDatePicker: true });

    const firstDay = wrapper.find(".has-day");
    await firstDay.trigger("click");
    const emittedEvent = wrapper.emitted("updated");
    expect(emittedEvent[0][0]).toHaveProperty("year");
    expect(emittedEvent[0][0]).toHaveProperty("month");
    expect(emittedEvent[0][0]).toHaveProperty("date");
  });
});
