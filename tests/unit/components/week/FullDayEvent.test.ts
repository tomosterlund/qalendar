import {mount} from '@vue/test-utils';
import {mountComponent} from '../../../vitest-setup';
import FullDayEvent from '../../../../src/components/week/FullDayEvent.vue'
import {describe, expect, test} from 'vitest';
const fullDayEvent = mountComponent(mount, FullDayEvent)

describe('FullDayEvent.vue', () => {
  const EVENT_TITLE = 'Foo'
  const EVENT_SELECTOR = '.week-timeline__event'

  let wrapper = fullDayEvent({
    props: {
      mode: 'week',
      config: {},
      scheduleEvent: { id: 1, title: EVENT_TITLE, time: { start: '2022-06-15', end: '2022-06-20' }}
    }
  })

  test('Displaying the event title, as provided by prop', () => {
    expect(wrapper.find(EVENT_SELECTOR).text()).toBe(EVENT_TITLE)
  })

  test('Emitting an event "event-was-clicked"', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('event-was-clicked')
    await wrapper.find(EVENT_SELECTOR).trigger('click')
    expect(wrapper.emitted()).toHaveProperty('event-was-clicked')
  })

  test('Displaying an empty div, when no scheduleEvent is provided', () => {
    wrapper = fullDayEvent({ props: { config: {}, mode: 'day' }})
    expect(wrapper.find(EVENT_SELECTOR).text()).toBe('')
  })
})
