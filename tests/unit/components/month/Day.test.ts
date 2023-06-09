import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Day from "../../../../src/components/month/Day.vue";
import Time, { WEEK_START_DAY } from "../../../../src/helpers/Time";
import { mountComponent } from "../../../vitest-setup";

const day = mountComponent(mount, Day)

describe("Day.vue", () => {
  const defaultProps = {
    config: { },
    time: new Time(WEEK_START_DAY.SUNDAY, "en-US"),
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
  }

  it('should display all events passed as props', () => {
    const underTest = day({ props: defaultProps });
    const dayEvents = underTest.findAll(".calendar-month__event");
    expect(dayEvents).toHaveLength(3);
  });

  it('should display the date of the day', () => {
    const underTest = day({ props: defaultProps });
    const dateDisplay = underTest.find(".calendar-month__day-date");
    expect(dateDisplay.text()).toBe("23");
  });

  it('should emit "day-was-clicked" when the body of a day is clicked', async () => {
    const underTest = day({ props: defaultProps });
    const dayBody = underTest.find(".calendar-month__weekday");
    await dayBody.trigger("click");
    expect(underTest.emitted("day-was-clicked")).toBeTruthy();
  });

  it('should not emit custom event "day-was-selected" when qalendar !isSmall and a day is clicked', async () => {
    const underTest = day({ props: {
      ...defaultProps,
      config: { isSmall: false }
    }})
    const dayBody = underTest.find('.calendar-month__weekday');
    await dayBody.trigger('click');
    expect(underTest.emitted('day-was-selected')).toBeFalsy();
  });

  it('should emit custom event "day-was-selected" when qalendar isSmall and a day is clicked', async () => {
    const underTest = day({ props: {
      ...defaultProps,
      config: { isSmall: true }
    }})
    const dayBody = underTest.find('.calendar-month__weekday');
    await dayBody.trigger('click');
    expect(underTest.emitted('day-was-selected')).toBeTruthy();
  });

  // Comment in, if @click.self starts working in Vue test utils
  // test("Not emitting day-was-clicked, when a child element of the day is clicked", async () => {
  //   const dayEvent = wrapper.find(".calendar-month__day-date");
  //   await dayEvent.trigger("click");
  //   expect(wrapper.emitted("day-was-clicked")).toBeFalsy();
  // })
});
