import EventFlyout from '../../../src/components/partials/EventFlyout.vue'
import {describe, expect, test} from 'vitest';
import {mountComponent} from '../../vitest-setup';
import {mount} from '@vue/test-utils';
import Time from '../../../src/helpers/Time';
const eventFlyout = mountComponent(mount, EventFlyout)

describe('EventFlyout.vue', () => {
  const propsForAllTests = {
    config: {},
    time: new Time('sunday', 'en-US'),
  }

  test('Displaying a span of 2 dates, for full day events spanning over a period', () => {
    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: { id: 1, title: 'Foo', time: { start: '2022-12-01', end: '2022-12-31' }}
      }
    })

    const eventTime = wrapper.find('.is-time')
    expect(eventTime.text()).toBe('December 1, 2022 - December 31, 2022')
  })

  test('Displaying a date string, for a full day, single day, event', () => {
    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: { id: 1, title: 'Foo', time: { start: '2022-12-01', end: '2022-12-01' }}
      }
    })

    const eventTime = wrapper.find('.is-time')
    expect(eventTime.text()).toBe('December 1, 2022')
  })

  test('Displaying a localized date-time string for a timed event', () => {
    const wrapper = eventFlyout({
      props: {
        ...propsForAllTests,
        calendarEventProp: { id: 1, title: 'Foo', time: { start: '2022-12-01 09:00', end: '2022-12-01 10:00' }}
      }
    })

    const eventTime = wrapper.find('.is-time')
    expect(eventTime.text()).toBe('December 1, 2022 ⋅ 9:00 AM - 10:00 AM')
  })
})