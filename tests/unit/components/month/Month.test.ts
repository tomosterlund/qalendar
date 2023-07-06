import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import Month from "../../../../src/components/month/Month.vue";
import Time, { WEEK_START_DAY } from "../../../../src/helpers/Time";
import { nextTick } from "vue";
import { dayMonday } from "../../../utils/entities/days";
import { EventBuilder } from "../../../../src/models/Event";

describe("Month.vue", () => {
  let wrapper = mount(Month, {
    props: {
      eventsProp: [],

      time: new Time(WEEK_START_DAY.MONDAY, "de-DE"),
      config: {

      month: {
          showTrailingAndLeadingDates: false,
          isSmall: true,
        }
      },
      period: {
        start: new Date(2023, 3 - 1, 1),
        end: new Date(2023, 3 - 1, 31),
        selectedDate: new Date(2023, 3 - 1, 23),
      },
    },
  });

  it("should display the correct number of weeks and days", async () => {
    wrapper.vm.setMonth();
    await nextTick();

    const expectedCalendarWeeksCount = 5;
    const calendarWeeks = wrapper.findAll(".calendar-month__week");
    expect(calendarWeeks).toHaveLength(expectedCalendarWeeksCount);
    const calendarWeekdays = wrapper.findAll(".calendar-month__weekday");
    expect(calendarWeekdays).toHaveLength(31);
  });

  it("should show space reservers when hiding trailing and leading months", async () => {
    wrapper.vm.setMonth();
    await nextTick();
    const trailingAndLeadingDays = wrapper.findAll(".space-reserver");
    expect(trailingAndLeadingDays).toHaveLength(4);
  });

  it("should show trailing and leading days by config option", async () => {
    wrapper = mount(Month, {
      props: {
        eventsProp: [],

        time: new Time(WEEK_START_DAY.MONDAY, "de-DE"),
        config: {
          isSmall: true,
          month: {
            showTrailingAndLeadingDates: true,
          }
        },
        period: {
          start: new Date(2023, 3 - 1, 1),
          end: new Date(2023, 3 - 1, 31),
          selectedDate: new Date(2023, 3 - 1, 23),
        },
      },
    });

    wrapper.vm.setMonth();
    await nextTick();
    const trailingAndLeadingDays = wrapper.findAll(".trailing-or-leading");
    expect(trailingAndLeadingDays).toHaveLength(4);
  })

  it('should show trailing and leading days by omitting month config', async () => {
    wrapper = mount(Month, {
      props: {
        eventsProp: [],

        time: new Time(WEEK_START_DAY.MONDAY, "de-DE"),
        config: {
          isSmall: true,
        },
        period: {
          start: new Date(2023, 3 - 1, 1),
          end: new Date(2023, 3 - 1, 31),
          selectedDate: new Date(2023, 3 - 1, 23),
        },
      },
    });

    wrapper.vm.setMonth();
    await nextTick();
    const trailingAndLeadingDays = wrapper.findAll(".trailing-or-leading");
    expect(trailingAndLeadingDays).toHaveLength(4);
  })

  it('should show AgendaEvents child component upon mounting', async () => {
    const agendaEvents = wrapper.findComponent({ name: "AgendaEvents" });
    expect(agendaEvents.exists()).toBe(true);
  });

  it('should propagate event "date-was-clicked" from child to parent', () => {
    const day = wrapper.findComponent({ name: "Day" });
    day.vm.$emit("date-was-clicked", new Date());
    expect(wrapper.emitted("date-was-clicked")).toBeTruthy();
  })

  it('should propagate event "updated-period" from Day.vue to parent', () => {
    const day = wrapper.findComponent({ name: "Day" });
    day.vm.$emit("updated-period", new Date());
    expect(wrapper.emitted("updated-period")).toBeTruthy();
  });

  it('should set selectedDay when receiving event "day-was-selected" from Day.vue', () => {
    const day = wrapper.findComponent({ name: "Day" });
    day.vm.$emit("day-was-selected", dayMonday);
    expect(wrapper.vm.selectedDay).toEqual(dayMonday);
  });

  it('should set the selected event element when receiving "event-was-clicked" from child component', () => {
    const day = wrapper.findComponent({ name: 'Day' });
    const clickedElement = document.createElement("div")
    day.vm.$emit("event-was-clicked", { eventElement: clickedElement });
    expect(wrapper.vm.selectedEventElement).toEqual(clickedElement);
  });

  it('should set the selected event when receiving "event-was-clicked" from Day.vue', () => {
    const day = wrapper.findComponent({ name: "Day" });
    day.vm.$emit("event-was-clicked", { clickedEvent: dayMonday.events[0] });
    expect(wrapper.vm.selectedEvent).toEqual(dayMonday.events[0]);
  });

  it('should propagate event "event-was-clicked" from Day.vue to parent', () => {
    const day = wrapper.findComponent({ name: "Day" });
    day.vm.$emit("event-was-clicked", { clickedEvent: dayMonday.events[0] });
    expect(wrapper.emitted("event-was-clicked")).toBeTruthy();
  });

  it('should propagate event "event-was-dragged" from Day.vue to parent', () => {
    const day = wrapper.findComponent({ name: "Day" });
    day.vm.$emit("event-was-dragged", dayMonday.events[0]);
    expect(wrapper.emitted("event-was-dragged")).toBeTruthy();
  });

  it('should initialize month anew when receiving event-was-dragged', () => {
    const initMonthSpy = vi.spyOn(wrapper.vm, 'initMonth');
    const day = wrapper.findComponent({ name: "Day" });
    day.vm.$emit("event-was-dragged", dayMonday.events[0]);
    expect(initMonthSpy).toHaveBeenCalled();
  });

  it('should display component EventFlyout', () => {
    const eventFlyout = wrapper.findComponent({ name: "EventFlyout" });
    expect(eventFlyout.exists()).toBe(true);
  })

  it('should reset selected event when receving event "hide" from EventFlyout', () => {
    wrapper.vm.selectedEvent = dayMonday.events[0];
    const eventFlyout = wrapper.findComponent({ name: "EventFlyout" });
    eventFlyout.vm.$emit("hide");
    expect(wrapper.vm.selectedEvent).toEqual(null);
  })

  it.each([
    ["edit-event"],
    ["delete-event"]
  ])('should propagate %s from EventFlyout', eventName => {
    const eventFlyout = wrapper.findComponent({ name: "EventFlyout" });
    eventFlyout.vm.$emit(eventName, dayMonday.events[0]);
    expect(wrapper.emitted(eventName)).toBeTruthy();
  })

  it('should not display component EventFlyout when disabled via prop', () => {
    wrapper = mount(Month, {
      props: {
        eventsProp: [],
        time: new Time(WEEK_START_DAY.MONDAY, "de-DE"),
        config: {
          eventDialog: {
            isDisabled: true,
          }
        },
        period: {
          start: new Date(2023, 3 - 1, 1),
          end: new Date(2023, 3 - 1, 31),
          selectedDate: new Date(2023, 3 - 1, 23),
        },
      },
    });

    const eventFlyout = wrapper.findComponent({ name: "EventFlyout" });
    expect(eventFlyout.exists()).toBe(false);
  })

  it('should separate timed events from full day events', () => {
    const timedEvent = new EventBuilder({
      start: '2023-03-27 10:00',
      end: '2023-03-27 11:00',
    }).build()

    const fullDayEvent = new EventBuilder({
      start: '2023-03-27',
      end: '2023-03-27',
    }).build()

    wrapper = mount(Month, {
      props: {
        eventsProp: [timedEvent, fullDayEvent],
        time: new Time(WEEK_START_DAY.MONDAY, "de-DE"),
        config: {},
        period: {
          start: new Date(2023, 3 - 1, 1),
          end: new Date(2023, 3 - 1, 31),
          selectedDate: new Date(2023, 3 - 1, 23),
        }
      }
    })

    expect(wrapper.vm.events).toHaveLength(1)
    expect(wrapper.vm.fullDayEvents).toHaveLength(1)
  })
});
