import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Time, { WEEK_START_DAY } from "../../../../src/helpers/Time";
import DatePicker from "../../../../src/components/header/DatePicker.vue";
import { mountComponent } from "../../../vitest-setup";

const datePicker = mountComponent(mount, DatePicker)

const MODE_TOGGLE_ACTION = '.date-picker__toggle-mode';

const DEFAULT_SELECTED_DATE = new Date(2022, 1 - 1, 4);
describe("DatePicker.vue", () => {
  let wrapper: any;

  const openDatePicker = async () => {
    const datePicker = wrapper.find(".date-picker__value-display");
    await datePicker.trigger("click");
  };

  const defaultProps = {
    timeProp: new Time(WEEK_START_DAY.MONDAY, "en-US"),
    periodProp: {
      selectedDate: DEFAULT_SELECTED_DATE,
      start: new Date(),
      end: new Date(),
    },
  };

  it("should open the date picker", async () => {
    wrapper = datePicker({
      props: {
        timeProp: new Time(WEEK_START_DAY.MONDAY, "en-US"),
        periodProp: {
          selectedDate: new Date(2022, 5 - 1, 1),
          start: new Date(),
          end: new Date(),
        },
      },
    });
    await openDatePicker();
    const period = wrapper.find(MODE_TOGGLE_ACTION);
    expect(period.text()).toBe("May 2022");
  });

  it("should navigate a month back: January => December", async () => {
    wrapper = datePicker({
      props: defaultProps,
    });
    await openDatePicker();
    await wrapper.find(".is-chevron-left").trigger("click");
    const period = wrapper.find(MODE_TOGGLE_ACTION);
    expect(period.text()).toBe("December 2021");
  });

  it("should navigate a month forward: December => January", async () => {
    wrapper = datePicker({
      props: {
        timeProp: new Time(WEEK_START_DAY.MONDAY, "en-US"),
        periodProp: {
          selectedDate: new Date(2023, 12 - 1, 16),
          start: new Date(),
          end: new Date(),
        },
      },
    });
    await openDatePicker();
    await wrapper.find(".is-chevron-right").trigger("click");
    const period = wrapper.find(MODE_TOGGLE_ACTION);
    expect(period.text()).toBe("January 2024");
  });

  it("should navigate between months via the month picker", async () => {
    wrapper = datePicker({
      props: {
        timeProp: new Time(WEEK_START_DAY.MONDAY, "de-DE"),
        periodProp: {
          selectedDate: new Date(2023, 12 - 1, 16),
          start: new Date(),
          end: new Date(),
        },
      },
    });
    await openDatePicker();
    await wrapper.find(MODE_TOGGLE_ACTION).trigger("click");
    const months = wrapper.findAll(".has-month");
    await months[5].trigger("click");
    const period = wrapper.find(MODE_TOGGLE_ACTION);
    expect(period.text()).toBe("Juni 2023");
  });

  it("should navigate between years via the month picker", async () => {
    wrapper = datePicker({
      props: {
        timeProp: new Time(WEEK_START_DAY.MONDAY, "de-DE"),
        periodProp: {
          selectedDate: new Date(2032, 10 - 1, 16),
          start: new Date(),
          end: new Date(),
        },
      },
    });
    await openDatePicker();

    await wrapper.find(MODE_TOGGLE_ACTION).trigger("click");

    const chevronLeft = await wrapper.find(".is-chevron-left");
    await chevronLeft.trigger("click");
    await chevronLeft.trigger("click");
    await chevronLeft.trigger("click");
    let period = wrapper.find(MODE_TOGGLE_ACTION);
    expect(period.text()).toBe("2029");

    await wrapper.find(".is-chevron-right").trigger("click");
    expect(period.text()).toBe("2030");

    const months = wrapper.findAll(".has-month");
    await months[11].trigger("click");
    period = wrapper.find(MODE_TOGGLE_ACTION);
    expect(period.text()).toBe("Dezember 2030");
  });

  it("should emit the correct event, when used as a stand-alone component", async () => {
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

  it('should toggle back to month mode', async () => {
    wrapper = datePicker({
      props: defaultProps,
    });
    await openDatePicker();
    const getCalendarMonthSpy =
      vi.spyOn(wrapper.vm.time, 'getCalendarMonthSplitInWeeks')
    wrapper.setData({ datePickerMode: 'year' })

    await wrapper.find(MODE_TOGGLE_ACTION).trigger('click')

    expect(getCalendarMonthSpy).toHaveBeenCalled()
    expect(wrapper.vm.datePickerMode).toBe('month')
  })

  it('should toggle to year mode', async () => {
    wrapper = datePicker({
      props: defaultProps,
    });
    await openDatePicker();
    const getCalendarYearSpy =
      vi.spyOn(wrapper.vm.time, 'getCalendarYearMonths')
    wrapper.setData({ datePickerMode: 'month' })

    await wrapper.find(MODE_TOGGLE_ACTION).trigger('click')

    expect(getCalendarYearSpy).toHaveBeenCalled()
    expect(wrapper.vm.datePickerMode).toBe('year')
  })

  it('should move to next week when calling goToPeriod in week mode', () => {
    wrapper = datePicker({
      props: defaultProps,
    })
    const setWeekSpy = vi.spyOn(wrapper.vm, 'setWeek')
    wrapper.vm.setWeek = setWeekSpy;
    wrapper.setProps({ mode: 'week' })
    wrapper.vm.goToPeriod('next')
    expect(setWeekSpy).toHaveBeenCalled()
    const weekSpyFirstArg = setWeekSpy.mock.calls[0][0]
    console.log(weekSpyFirstArg)
    const previousDate = DEFAULT_SELECTED_DATE.getDate();
    const nextDate = new Date(DEFAULT_SELECTED_DATE.setDate(previousDate + 7))
    expect((weekSpyFirstArg as Date).getDate()).toEqual(nextDate.getDate())
  })
});
