import { mount } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import Event from "../../../../src/components/month/Event.vue";
import Time from "../../../../src/helpers/Time";
import {dayInterface} from '../../../../src/typings/interfaces/day.interface';
import unidecode from 'unidecode';

describe("Event.vue", () => {
  let wrapper = mount(Event, {
    props: {
      time: new Time("sunday", "en-US"),
      calendarEvent: {
        title: "Foo",
        time: { start: "2022-05-22 00:00", end: "2022-05-22 01:00" },
        id: "123",
      },
      config: {},
      day: { dayName: 'monday', events: [], dateTimeString: '2022-01-01' } as dayInterface
    },
  });

  test("Displaying the event title", () => {
    const title = wrapper.find(".calendar-month__event-title");
    expect(title.text()).toBe("Foo");
  });

  test("Displaying the time", () => {
    const time = wrapper.find(".calendar-month__event-time");
    expect(
      unidecode(time.text())
    ).toBe("12:00 AM");
  });

  test('Emitting event "event-was-clicked"', async () => {
    const eventElement = wrapper.find('.calendar-month__event')
    await eventElement.trigger('click')
    const wasClickedEvent = wrapper.emitted('event-was-clicked')

    // @ts-ignore
    expect(wasClickedEvent[0][0]).toHaveProperty('clickedEvent')
    // @ts-ignore
    expect(wasClickedEvent[0][0]).toHaveProperty('eventElement')
  })
});
