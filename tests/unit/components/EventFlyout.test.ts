import EventFlyout from '../../../src/components/partials/EventFlyout.vue'
import { describe, expect, it } from 'vitest';
import { mountComponent } from '../../vitest-setup';
import { mount } from '@vue/test-utils';
import unidecode from 'unidecode';
import {
  eventWithLocation,
  eventWithoutLocation, eventWithoutWithProperty,
  eventWithTitle,
  eventWithWithProperty,
  eventWithoutTopic,
  eventWithTopic,
  eventWithoutDescription,
  eventWithDescription,
  eventWithColor,
  eventWithColorScheme,
  propsForAllTests,
  whenIsVisible
} from "./EventFlyout.test-utils";
import { EventBuilder } from "../../../src/models/Event";
import { EVENT_COLORS } from "../../../src/constants";

const eventFlyout = mountComponent(mount, EventFlyout)

describe('EventFlyout.vue', () => {


  it('should display a span of 2 dates, for full day events spanning over a period', () => {
    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: { id: 1, title: 'Foo', time: { start: '2022-12-01', end: '2022-12-31' }}
      }
    })

    const eventTime = wrapper.find('.is-time')
    expect(eventTime.text()).toBe('December 1, 2022 - December 31, 2022')
  })

  it('should display a date string, for a full day, single day, event', () => {
    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: { id: 1, title: 'Foo', time: { start: '2022-12-01', end: '2022-12-01' }}
      }
    })

    const eventTime = wrapper.find('.is-time')
    expect(eventTime.text()).toBe('December 1, 2022')
  })

  it('should display a localized date-time string for a timed event', () => {
    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: { id: 1, title: 'Foo', time: { start: '2022-12-01 09:00', end: '2022-12-01 10:00' }}
      }
    })

    const eventTime = wrapper.find('.is-time')

    expect(
      unidecode(eventTime.text())
    ).toContain('December 1, 2022')

    expect(
      unidecode(eventTime.text())
    ).toContain('9:00 AM - 10:00 AM')
  })

  it('should display the time for a multi-day timed event', () => {
    const multiDayTimedEvent = new EventBuilder({
      start: '2022-12-01 09:00',
      end: '2022-12-03 10:00',
    }).build()

    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: multiDayTimedEvent
      }
    })

    const eventTime = wrapper.find('.is-time')
    expect(
      unidecode(eventTime.text())
    ).toBe('December 1, 2022 9:00 AM - December 3, 2022 10:00 AM')
  })

  it('should display the event title', () => {
    const expectedTitle = 'Foo';

    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: eventWithTitle(expectedTitle)
      }
    })

    const eventTitle = wrapper.find('.is-title')
    expect(eventTitle.text()).toBe(expectedTitle)
  })

  it('should display the event location', () => {
    const expectedLocation = 'Bar';

    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: eventWithLocation(expectedLocation)
      }
    })

    const eventLocation = wrapper.find('.is-location')
    expect(eventLocation.text()).toBe(expectedLocation)
  })

  it('should not display the event location if it is not provided', () => {
    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: eventWithoutLocation()
      }
    })

    const eventLocation = wrapper.find('.is-location')
    expect(eventLocation.exists()).toBe(false)
  })

  it('should display content of the "with" property', () => {
    const expectedWithProperty = 'Baz';

    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: eventWithWithProperty(expectedWithProperty)
      }
    })

    const eventWithProperty = wrapper.find('.is-with')
    expect(eventWithProperty.text()).toBe(expectedWithProperty)
  })

  it('should not display the "with" property if it is not provided', () => {
    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: eventWithoutWithProperty()
      }
    })

    const eventWithProperty = wrapper.find('.is-with')
    expect(eventWithProperty.exists()).toBe(false)
  })

  it('should display the event topic', () => {
    const expectedTopic = 'Baz';

    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: eventWithTopic(expectedTopic)
      }
    })

    const eventTopic = wrapper.find('.is-topic')
    expect(eventTopic.text()).toBe(expectedTopic)
  })

  it('should not display the event topic if it is not provided', () => {
    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: eventWithoutTopic()
      }
    })

    const eventTopic = wrapper.find('.is-topic')
    expect(eventTopic.exists()).toBe(false)
  })

  it('should display the event description', () => {
    const expectedDescription = 'Baz';

    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: eventWithDescription(expectedDescription)
      }
    })

    const eventDescription = wrapper.find('.is-description')
    expect(eventDescription.text()).toBe(expectedDescription)
  })

  it('should not display the event description if it is not provided', () => {
    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: eventWithoutDescription()
      }
    })

    const eventDescription = wrapper.find('.is-description')
    expect(eventDescription.exists()).toBe(false)
  })

  it('should not display a custom event flyout', () => {
    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: eventWithTitle('Foo')
      }
    })

    const defaultFlyout = wrapper.find('.event-flyout__relative-wrapper')
    expect(defaultFlyout.exists()).toBe(true)
  })

  it('should display a custom event flyout', () => {
    const expectedFlyoutText = 'Custom Event Flyout'

    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: eventWithTitle('Foo'),
        config: {
          eventDialog: {
            isCustom: true
          }
        }
      },
      slots: {
        default: `<div class="custom-event-flyout">${expectedFlyoutText}</div>`
      }
    })

    expect(wrapper.text()).toContain(expectedFlyoutText)
  })

  it('should set event background color to blue per default', () => {
    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: eventWithTitle('Foo')
      }
    })

    const event = wrapper.find('.event-flyout__color-icon')
    expect(event.attributes('style')).toContain(`background-color: ${EVENT_COLORS.blue}`)
  })

  it('should set event background color to red', () => {
    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: eventWithColor('red')
      }
    })

    const event = wrapper.find('.event-flyout__color-icon')
    expect(event.attributes('style')).toContain(`background-color: ${EVENT_COLORS.red}`)
  })

  it('should set event background color to custom color scheme', () => {
    const expectedBackgroundColor = 'rgb(0, 0, 16)';
    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: eventWithColorScheme('maths'),
        config: {
          style: {
            colorSchemes: {
              maths: {
                color: '#000000',
                backgroundColor: expectedBackgroundColor
              }
            }
          }
        }
      }
    })

    const event = wrapper.find('.event-flyout__color-icon')
    expect(event.attributes('style')).toContain(`background-color: ${expectedBackgroundColor}`)
  })

  it('should close flyout on clicking outside', () => {
    const {
      wrapper,
      closeFlyoutSpy,
      elementOutsideFlyout
    } = whenIsVisible()

    wrapper.vm.closeFlyoutOnClickOutside({ target: elementOutsideFlyout })

    expect(closeFlyoutSpy).toHaveBeenCalled()
  })

  it("should not close flyout on clicking, when disabled through config",  () => {
    const {
      wrapper,
      closeFlyoutSpy,
      elementOutsideFlyout
    } = whenIsVisible(false)

    wrapper.vm.closeFlyoutOnClickOutside({ target: elementOutsideFlyout })

    expect(closeFlyoutSpy).not.toHaveBeenCalled()
  })
})
