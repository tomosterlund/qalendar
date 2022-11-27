import {describe, expect, test} from "vitest";
import Week from '../../../../src/components/week/Week.vue'
import {mount} from "@vue/test-utils";
import Time from '../../../../src/helpers/Time'
import {mountComponent} from '../../../vitest-setup'

const week = mountComponent(mount, Week)

describe('Week.vue', () => {
  let wrapper = week({
    props: {
      config: {
        week: {
          nDays: 7,
        }
      },
      time: new Time('sunday', 'en-US'),
      period: {
        selectedDate: new Date(2022, (6 - 1), 6),
        start: new Date(2022, (6 - 1), 6),
        end: new Date(2022, (6 - 1), 6)
      },
      eventsProp: [
        {
          id: '123',
          title: 'Foo',
          time: { start: '2022-06-06 17:20', end: '2022-06-06 18:20' },
          isEditable: true,
        }
      ],
    }
  })

  test('Rendering an event', async () => {
    await wrapper.vm.setDays()
    expect(wrapper.get('.calendar-week__event'))
  })

  test('Opening the event flyout', async () => {
    await wrapper.find('.calendar-week__event').trigger('click')
    expect(wrapper.get('.event-flyout'))
  })

  test('Emitting a custom event "edit-event"', async () => {
    await wrapper.find('.is-edit-icon').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('edit-event')
    expect(wrapper.emitted()).not.toHaveProperty('delete-event')
  })

  test('Emitting a custom event "delete-event"', async () => {
    await wrapper.find('.calendar-week__event').trigger('click')
    await wrapper.find('.is-trash-icon').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('delete-event')
  })

  test('Using the default 7 day week', () => {
    const days = wrapper.findAll('.calendar-week__day')
    expect(days).toHaveLength(7)
  })

  test('Creating a week with 5 days', async() => {
    wrapper = week({
      props: {
        config: {
          week: {
            nDays: 5,
          }
        },
        time: new Time('sunday', 'en-US'),
        period: {
          selectedDate: new Date(),
          start: new Date(),
          end: new Date()
        },
      }
    })

    await wrapper.vm.setDays()
    const days = wrapper.findAll('.calendar-week__day')
    expect(days).toHaveLength(5)
  })

  test('Not showing the currentTimeLine', () => {
    expect(() => wrapper.get('.current-time-line')).toThrow()
  })

  test('Showing the currentTimeLine', async () => {
    wrapper = week({
      props: {
        config: {
          showCurrentTime: true,
          week: { nDays: 5, }
        },
        time: new Time('sunday', 'en-US'),
        period: {
          selectedDate: new Date(),
          start: new Date(),
          end: new Date()
        },
      }
    })

    await wrapper.vm.setDays()
    expect(wrapper.get('.current-time-line'))
  })
})
