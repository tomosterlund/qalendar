import {describe, expect, it, vi} from "vitest";
import Week from '../../../../src/components/week/Week.vue'
import {mount} from "@vue/test-utils";
import Time, {WEEK_START_DAY} from '../../../../src/helpers/Time'
import {mountComponent} from '../../../vitest-setup'
import { EventBuilder } from "../../../../src/models/Event";

const week = mountComponent(mount, Week)

describe('Week.vue', () => {
  const defaultConfig = {
    props: {
      config: {
        week: {
          nDays: 7,
        }
      },
      time: new Time(WEEK_START_DAY.SUNDAY, 'en-US'),
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
        },
        {
          id: '456',
          title: 'Bar',
          time: { start: '2022-06-06', end: '2022-06-06' },
        }
      ],
    }
  };
  let wrapper = week(defaultConfig)

  it('Renders an event', async () => {
    await wrapper.vm.setInitialEvents()
    expect(wrapper.get('.calendar-week__event'))
  })

  it('renders a full day event', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.get('.week-timeline__event'))
  })

  it('Opens the event flyout', async () => {
    await wrapper.find('.calendar-week__event').trigger('click')
    expect(wrapper.get('.event-flyout'))
  })

  it('Emits a custom event "edit-event"', async () => {
    await wrapper.find('.is-edit-icon').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('edit-event')
    expect(wrapper.emitted()).not.toHaveProperty('delete-event')
  })

  it('Emits a custom event "delete-event"', async () => {
    await wrapper.find('.calendar-week__event').trigger('click')
    await wrapper.find('.is-trash-icon').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('delete-event')
  })

  it('Uses the default 7 day week', () => {
    const days = wrapper.findAll('.calendar-week__day')
    expect(days).toHaveLength(7)
  })

  it('Creates a week with 5 days starting Sunday', async() => {
    wrapper = week({
      props: {
        config: {
          week: {
            nDays: 5,
          }
        },
        time: new Time(WEEK_START_DAY.SUNDAY, 'en-US'),
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

  it('Creates a week with 5 days starting Monday', async() => {
    wrapper = week({
      props: {
        config: {
          week: {
            nDays: 5,
          }
        },
        time: new Time(WEEK_START_DAY.MONDAY, 'en-US'),
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

  it('does not show the currentTimeLine', () => {
    expect(() => wrapper.get('.current-time-line')).toThrow()
  })

  it('Shows the currentTimeLine', async () => {
    wrapper = week({
      props: {
        config: {
          showCurrentTime: true,
          week: { nDays: 5, }
        },
        time: new Time(WEEK_START_DAY.SUNDAY, 'en-US'),
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

  it('runs initScrollbar when receiving event "drag-end"', () => {
    const initScrollbarSpy = vi.spyOn(wrapper.vm, 'initScrollbar')
    expect(initScrollbarSpy).not.toHaveBeenCalled()
    const day = wrapper.findComponent('.calendar-week__day')
    day.vm.$emit('drag-end')
    expect(initScrollbarSpy).toHaveBeenCalled()
  })

  it('calls setInitialEvents when modeProp changes', async () => {
    const setInitialEventsSpy = vi.spyOn(wrapper.vm, 'setInitialEvents')
    expect(setInitialEventsSpy).not.toHaveBeenCalled()
    wrapper.setProps({ modeProp: 'month' })
    await wrapper.vm.$nextTick()
    expect(setInitialEventsSpy).toHaveBeenCalled()
  })

  it('calls setDay on setting mode to day', async () => {
    const setDaySpy = vi.spyOn(wrapper.vm, 'setDay')
    expect(setDaySpy).not.toHaveBeenCalled()
    wrapper.setProps({ modeProp: 'day' })
    await wrapper.vm.$nextTick()
    expect(setDaySpy).toHaveBeenCalled()
  })

  it('only has one day set after calling setDay', async () => {
    wrapper.setProps({ modeProp: 'day' })
    await wrapper.vm.$nextTick()
    const expectedDays = wrapper.findAll('.calendar-week__day')
    expect(expectedDays).toHaveLength(1)
  })

  it('renders a full day event in day mode', async () => {
    wrapper = week(defaultConfig);
    wrapper.setProps({ modeProp: 'day' })
    await wrapper.vm.$nextTick()
    expect(wrapper.get('.week-timeline__event'))
  });

  it('should pass event "datetime-was-clicked" from Day.vue to parent', async () => {
    const day = wrapper.findComponent('.calendar-week__day')
    await day.vm.$emit('datetime-was-clicked')
    expect(wrapper.emitted()).toHaveProperty('datetime-was-clicked')
  })

  it('should init scrollbar on receiving event-was-dragged event', async () => {
    const day = wrapper.findComponent('.calendar-week__day')
    const initScrollbarSpy = vi.spyOn(wrapper.vm, 'initScrollbar')
    const eventToBeDragged = new EventBuilder({
      start: '2022-06-06 17:20',
      end: '2022-06-06 18:20',
    }).build()

    await day.vm.$emit('event-was-dragged', eventToBeDragged)

    expect(initScrollbarSpy).toHaveBeenCalled()
  })

  it('should emit event "event-was-dragged" on receiving event-was-dragged event', async () => {
    const day = wrapper.findComponent('.calendar-week__day')
    const eventToBeDragged = new EventBuilder({
      start: '2022-06-06 17:20',
      end: '2022-06-06 18:20',
    }).build()

    await day.vm.$emit('event-was-dragged', eventToBeDragged)

    expect(wrapper.emitted()).toHaveProperty('event-was-dragged')
  })
})
