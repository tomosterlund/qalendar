import {mount} from "@vue/test-utils";
import {describe, expect, it, vi} from "vitest";
import Event from "../../../../src/components/month/Event.vue";
import Time, {WEEK_START_DAY} from "../../../../src/helpers/Time";
import {dayInterface} from '../../../../src/typings/interfaces/day.interface';
import unidecode from 'unidecode';
import {dataRefFrom} from "../../../vitest-setup";
import {EventBuilder} from "../../../../src/models/Event";
import {modeType} from "../../../../src/typings/types";
import {eventInterface} from "../../../../src/typings/interfaces/event.interface";
import {EVENT_COLORS} from "../../../../src/constants";

const EVENT_TIME = ".calendar-month__event-time";

describe("Event.vue", () => {
  const defaultOptions = {
    props: {
      time: new Time(WEEK_START_DAY.SUNDAY, "en-US"),
      calendarEvent: {
        title: "Foo",
        time: { start: "2022-05-22 00:00", end: "2022-05-22 01:00" },
        id: "123",
      } as eventInterface,
      config: { style: { colorSchemes: {} } },
      day: { dayName: 'monday', events: [], dateTimeString: '2022-01-01' } as dayInterface,
    },
  }

  it("should displaying the event title", () => {
    const wrapper = mount(Event, defaultOptions);
    const title = wrapper.find(".calendar-month__event-title");
    expect(title.text()).toBe("Foo");
  });

  it("should display the time", () => {
    const wrapper = mount(Event, defaultOptions);
    const time = wrapper.find(EVENT_TIME);
    expect(
      unidecode(time.text())
    ).toBe("12:00 AM");
  });

  it('should not find any event time if calendarEvent is a full day event', () => {
    const wrapper = mount(Event, {
      ...defaultOptions,
      props: {
        ...defaultOptions.props,
        calendarEvent: new EventBuilder({
          start: '2022-05-22',
          end: '2022-05-22'
        }).build()
      }
    })
    expect(wrapper.find(EVENT_TIME).exists()).toBeFalsy()
  })

  it('should emit event "event-was-clicked"', async () => {
    const wrapper = mount(Event, defaultOptions)
    const eventElement = wrapper.find('.calendar-month__event')
    await eventElement.trigger('click')
    const wasClickedEvent = wrapper.emitted('event-was-clicked')

    expect(wasClickedEvent[0][0]).toHaveProperty('clickedEvent')
    expect(wasClickedEvent[0][0]).toHaveProperty('eventElement')
  })

  it('should render default event', () => {
    const wrapper = mount(Event, defaultOptions)
    expect(wrapper.find(dataRefFrom('default-event')).exists()).toBeTruthy()
  })

  it.each([
    // [isCustomProperty, result]
    [true,              true],
    [['month', 'week'], true],
    [['week'],          false]
  ])('should render event with custom template if isCustom is true for month mode', (
    isCustomProperty,
    result
  ) => {
    const options = {
      ...defaultOptions,
      props: {
        ...defaultOptions.props,
        calendarEvent: new EventBuilder({
          start: '2022-05-22 00:00',
          end: '2022-05-22 01:00',
        })
          .withIsCustom(isCustomProperty as boolean | modeType[])
          .build(),
      }
    }
    const wrapper = mount(Event, options)
    expect(wrapper.find(dataRefFrom('custom-event')).exists()).toBe(result)
  })

  it('should not find element with class is-draggable because event is not editable', () => {
    const wrapper = mount(Event, defaultOptions)
    expect(wrapper.find('.is-draggable').exists()).toBeFalsy()
  })

  it('should not find element with class is-draggable because DnD is disabled', () => {
    const options = { ...defaultOptions }
    options.props.calendarEvent = new EventBuilder({
      start: '2022-05-22 00:00',
      end: '2022-05-22 01:00',
    })
      .withIsEditable(true)
      .withDisableDnD(['month'])
      .build()
    const wrapper = mount(Event, options)
    expect(wrapper.find('.is-draggable').exists()).toBeFalsy()
  })

  it('should find element with class is-draggable', () => {
    const options = { ...defaultOptions }
    options.props.calendarEvent = new EventBuilder({
      start: '2022-05-22 00:00',
      end: '2022-05-22 01:00',
    })
      .withIsEditable(true)
      .withDisableDnD(['week'])
      .build()
    const wrapper = mount(Event, options)
    expect(wrapper.find('.is-draggable').exists()).toBeTruthy()
  })

  it('should set background color to blue per default', () => {
    const wrapper = mount(Event, defaultOptions)
    expect(wrapper.vm.eventBackgroundColor).toBe(EVENT_COLORS.blue)
  })

  it('should set background color to yellow', () => {
    const options = { ...defaultOptions }
    options.props.calendarEvent = new EventBuilder({
      start: '2022-05-22 00:00',
      end: '2022-05-22 01:00',
    })
      .withColor('yellow')
      .build()
    const wrapper = mount(Event, options)
    expect(wrapper.vm.eventBackgroundColor).toBe(EVENT_COLORS.yellow)
  })

  it('should set background color to custom color scheme', () => {
    const options = { ...defaultOptions }
    const expectedBackgroundColor = '#ff0000';
    options.props.config.style.colorSchemes = {
      women: {
        backgroundColor: expectedBackgroundColor,
        color: '#ffa',
      }
    }
    options.props.calendarEvent = new EventBuilder({
      start: '2022-05-22 00:00',
      end: '2022-05-22 01:00',
    })
      .withColorScheme('women')
      .build()
    const wrapper = mount(Event, options)
    expect(wrapper.vm.eventBackgroundColor).toBe(expectedBackgroundColor)
  })

  it('should set data onto the data transfer of a drag event', async () => {
    const calendarEvent = new EventBuilder({
      start: '2022-05-22 00:00',
      end: '2022-05-22 01:00',
    }).build()
    const options = { ...defaultOptions }
    options.props.calendarEvent = calendarEvent
    const wrapper = mount(Event, options)
    const dragEvent = {
      dataTransfer: {
        effectAllowed: '',
        setData: vi.fn(),
      }
    }

    await wrapper.find('.is-event').trigger('dragstart', dragEvent)

    expect(dragEvent.dataTransfer.effectAllowed).toBe('move')
    expect(dragEvent.dataTransfer.setData).toHaveBeenCalledWith(
      'json',
      JSON.stringify(calendarEvent)
    )
  })
});
