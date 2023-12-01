import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Day from "../../../../src/components/month/Day.vue";
import Time, { WEEK_START_DAY } from "../../../../src/helpers/Time";
import { mountComponent } from "../../../vitest-setup";
import {EventBuilder} from "../../../../src/models/Event";

const day = mountComponent(mount, Day)

const MORE_EVENTS_ACTION = ".calendar-month__weekday-more";

describe("Day.vue", () => {
  const defaultProps = {
    isSelected: true,
    config: { },
    time: new Time(WEEK_START_DAY.SUNDAY, "en-US"),
    weekHeight: 2400,
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

  const propsWith4Events = {
    ...defaultProps,
    day: {
      ...defaultProps.day,
      events: [
        ...defaultProps.day.events,
        {
          title: "Foo",
          time: { start: "2022-05-22 00:00", end: "2022-05-22 01:00" },
          id: "4",
        },
      ],
    },
  }

  const whenIsDroppable = async () => {
    const wrapper = day({ props: defaultProps });
    const dayBody = wrapper.find(".calendar-month__weekday");
    await dayBody.trigger("dragover");

    return wrapper;
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

  it('should emit "date-was-clicked" when the body of a day is clicked', async () => {
    const underTest = day({ props: defaultProps });
    const dayBody = underTest.find(".calendar-month__weekday");
    await dayBody.trigger("click");
    expect(underTest.emitted("date-was-clicked")).toBeTruthy();
    // expect payload to be a dateString of format YYYY-MM-DD
    expect(underTest.emitted("date-was-clicked")[0][0]).toBe("2022-05-23");
  });

  it('should not emit "date-was-clicked" when an event is clicked', () => {
    const underTest = day({ props: defaultProps });
    const dayEvent = underTest.find(".calendar-month__event");

    dayEvent.trigger("click");

    expect(underTest.emitted("date-was-clicked")).toBeFalsy();
  })

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

  it('should have "is-selected" class if isSelected prop is true', () => {
    const underTest = day({ props: defaultProps });
    const dayBody = underTest.find(".calendar-month__weekday");
    expect(dayBody.classes()).toContain("is-selected");
  })

  it('should not have "is-selected" class if isSelected prop is false', () => {
    const props = defaultProps
    props.isSelected = false
    const underTest = day({ props });
    const dayBody = underTest.find(".calendar-month__weekday");
    expect(dayBody.classes()).not.toContain("is-selected");
  })

  it('should not contain an element with class "is-today" if the given day.dateTimeString is not today', () => {
    const underTest = day({ props: defaultProps });
    const dayBody = underTest.find(".calendar-month__weekday");
    expect(dayBody.classes()).not.toContain("is-today");
  });

  it('should contain an element with class "is-today" if the given day.dateTimeString is today', () => {
    const dateTimeString = new Time().getDateTimeStringFromDate(new Date());
    const props = {
      ...defaultProps,
      day: {
        ...defaultProps.day,
        dateTimeString,
      },
    }

    const underTest = day({ props });
    const dayBody = underTest.find(".calendar-month__weekday");
    expect(dayBody.classes()).toContain("is-today");
  });

  it('should not display day element if day.isTrailingOrLeadingDate is true and ', () => {
    const props = {
      ...defaultProps,
      config: {
        month: {
          showTrailingAndLeadingDates: false,
        }
      },
      day: {
        ...defaultProps.day,
        isTrailingOrLeadingDate: true,
      },
    }

    const underTest = day({ props });
    const dayBody = underTest.find(".calendar-month__weekday");
    expect(dayBody.exists()).toBeFalsy();
  });

  it('should not show "more events" button if day.events.length is less than 4', () => {
    const underTest = day({ props: defaultProps });
    const moreEventsButton = underTest.find(MORE_EVENTS_ACTION);
    expect(moreEventsButton.exists()).toBeFalsy();
  });

  it('should show "more events" button if day.events.length is greater than 3', () => {


    const underTest = day({ props: propsWith4Events });
    const moreEventsButton = underTest.find(MORE_EVENTS_ACTION);
    expect(moreEventsButton.exists()).toBeTruthy();
  });

  it('should emit custom event "updated-period" when clicking "more events" button', () => {
    const underTest = day({ props: propsWith4Events });
    const moreEventsButton = underTest.find(MORE_EVENTS_ACTION);
    moreEventsButton.trigger("click");
    expect(underTest.emitted("updated-period")).toBeTruthy();
  });

  it('should not contain class "is-droppable" when @dragover is not triggered', () => {
    const underTest = day({ props: defaultProps });
    const dayBody = underTest.find(".calendar-month__weekday");
    expect(dayBody.classes()).not.toContain("is-droppable");
  })

  it('should contain class "is-droppable" when @dragover is triggered', async () => {
    const underTest = day({ props: defaultProps });
    const dayBody = underTest.find(".calendar-month__weekday");
    await dayBody.trigger("dragover");
    expect(dayBody.classes()).toContain("is-droppable");
  })

  it.each([
    ['dragleave'],
    ['dragend'],
    ['drop']
  ])('should remove class "is-droppable" when @%s is triggered', async customEvent => {
    const underTest = await whenIsDroppable();
    const dayBody = underTest.find(".calendar-month__weekday");
    expect(dayBody.classes()).toContain("is-droppable");

    await dayBody.trigger(customEvent);

    expect(dayBody.classes()).not.toContain("is-droppable");
  })

  it('should not emit @event-was-dragged, if there is no dataTransfer on drop-event', async () => {
    const wrapper = await whenIsDroppable()

    await wrapper.find('.is-droppable').trigger('drop', {
      dataTransfer: null
    })

    expect(wrapper.emitted('event-was-dragged')).toBeFalsy()
  })

  it('should emit @event-was-dragged, if there is dataTransfer on drop-event', async () => {
    const wrapper = await whenIsDroppable()
    const expectedNewDate = '2022-05-23'

    await wrapper.find('.is-droppable').trigger('drop', {
      dataTransfer: {
        getData: () => JSON.stringify(new EventBuilder({
          start: '2022-05-01', end: '2022-05-01'
        }).build())
      }
    })

    expect(wrapper.emitted('event-was-dragged')).toBeTruthy()
    expect(wrapper.emitted('event-was-dragged')[0][0].time.start).toContain(expectedNewDate)
    expect(wrapper.emitted('event-was-dragged')[0][0].time.end).toContain(expectedNewDate)
  })

  it('should not emit @event-was-dragged, if event is dropped on its current day', async () => {
    const wrapper = await whenIsDroppable()

    await wrapper.find('.is-droppable').trigger('drop', {
      dataTransfer: {
        getData: () => JSON.stringify(new EventBuilder({
          start: '2022-05-23', end: '2022-05-23'
        }).build())
      }
    })

    expect(wrapper.emitted('event-was-dragged')).toBeFalsy()
  })
});
