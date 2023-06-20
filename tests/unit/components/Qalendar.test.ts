import {mount} from "@vue/test-utils";
import Qalendar from '../../../src/Qalendar.vue'
import {describe, expect, it} from "vitest";

async function whenInMonthMode() {
  const wrapper = mount(Qalendar);
  await wrapper.setData({ mode: 'month' })
  return wrapper;
}

describe('Qalendar.vue', () => {

  it('should mount the component with a loading animation', () => {
    const wrapper = mount(Qalendar, {
      props: {
        isLoading: true,
      }
    })

    expect(wrapper.get('.top-bar-loader'))
  })

  it('should mount the component without a loading animation', () => {
    const wrapper = mount(Qalendar)

    // TODO: check if this ever fails
    expect(() => wrapper.get('.top-bar-loader')).toThrow()
  })

  it.todo('emit event "updated-period" when toggling modes')

  it('should emit event "datetime-was-clicked" when receiving this from Week.vue', () => {
    const wrapper = mount(Qalendar);
    const weekComponent = wrapper.findComponent({ name: 'Week' })
    weekComponent.vm.$emit('datetime-was-clicked')
    expect(wrapper.emitted('datetime-was-clicked')).toBeTruthy()
  })

  it('should emit event "event-was-clicked" when receiving this from Week.vue', () => {
    const wrapper = mount(Qalendar);
    const weekComponent = wrapper.findComponent({ name: 'Week' })
    weekComponent.vm.$emit('event-was-clicked')
    expect(wrapper.emitted('event-was-clicked')).toBeTruthy()
  });

  it('should emit event "event-was-resized" when receiving this from Week.vue', () => {
    const wrapper = mount(Qalendar);
    const weekComponent = wrapper.findComponent({ name: 'Week' })
    weekComponent.vm.$emit('event-was-resized', { time: { start: '2022-12-10 00:00', end: '2022-12-10 01:00' } })
    expect(wrapper.emitted('event-was-resized')).toBeTruthy()
  });

  it('should emit event "event-was-dragged" when receiving this from Week.vue', () => {
    const wrapper = mount(Qalendar);
    const weekComponent = wrapper.findComponent({ name: 'Week' })
    weekComponent.vm.$emit('event-was-dragged', { time: { start: '2022-12-10 00:00', end: '2022-12-10 01:00' } })
    expect(wrapper.emitted('event-was-dragged')).toBeTruthy()
  });

  it('should emit event "edit-event" when receiving this from Week.vue', () => {
    const wrapper = mount(Qalendar);
    const weekComponent = wrapper.findComponent({ name: 'Week' })
    weekComponent.vm.$emit('edit-event')
    expect(wrapper.emitted('edit-event')).toBeTruthy()
  });

  it('should emit event "delete-event" when receiving this from Week.vue', () => {
    const wrapper = mount(Qalendar);
    const weekComponent = wrapper.findComponent({ name: 'Week' })
    weekComponent.vm.$emit('delete-event')
    expect(wrapper.emitted('delete-event')).toBeTruthy()
  })

  it('should emit event "interval-was-clicked" when receiving this from Week.vue', () => {
    const wrapper = mount(Qalendar);
    const weekComponent = wrapper.findComponent({ name: 'Week' })
    weekComponent.vm.$emit('interval-was-clicked')
    expect(wrapper.emitted('interval-was-clicked')).toBeTruthy()
  })

  it('should emit event "day-was-clicked" when receiving this from Week.vue', () => {
    const wrapper = mount(Qalendar);
    const monthComponent = wrapper.findComponent({ name: 'Week' })
    monthComponent.vm.$emit('day-was-clicked')
    expect(wrapper.emitted('day-was-clicked')).toBeTruthy()
  })

  it('should emit event "event-was-clicked" when receiving this from Month.vue', async () => {
    const wrapper = await whenInMonthMode();
    const monthComponent = wrapper.findComponent({ name: 'Month' })
    monthComponent.vm.$emit('event-was-clicked')
    expect(wrapper.emitted('event-was-clicked')).toBeTruthy()
  })

  it('should emit event "day-was-clicked" when receiving this from Month.vue', async () => {
    const wrapper = await whenInMonthMode();
    const monthComponent = wrapper.findComponent({ name: 'Month' })
    monthComponent.vm.$emit('day-was-clicked')
    expect(wrapper.emitted('day-was-clicked')).toBeTruthy()
  });

  it('should emit event "event-was-dragged" when receiving this from Month.vue', async () => {
    const wrapper = await whenInMonthMode();
    const monthComponent = wrapper.findComponent({ name: 'Month' })
    monthComponent.vm.$emit('event-was-dragged')
    expect(wrapper.emitted('event-was-dragged')).toBeTruthy()
  })

  it('should emit event "edit-event" when receiving this from Month.vue', async () => {
    const wrapper = await whenInMonthMode();
    const monthComponent = wrapper.findComponent({ name: 'Month' })
    monthComponent.vm.$emit('edit-event')
    expect(wrapper.emitted('edit-event')).toBeTruthy()
  })

  it('should emit event "delete-event" when receiving this from Month.vue', async () => {
    const wrapper = await whenInMonthMode();
    const monthComponent = wrapper.findComponent({ name: 'Month' })
    monthComponent.vm.$emit('delete-event')
    expect(wrapper.emitted('delete-event')).toBeTruthy()
  })

  it('should have class "mode-is-day" when defaultMode is "day"', () => {
    const wrapper = mount(Qalendar, {
      props: {
        config: {
          defaultMode: 'day',
        }
      }
    })
    expect(wrapper.get('.mode-is-day'))
  })

  it('should have class "mode-is-week" when defaultMode is "week"', () => {
    const wrapper = mount(Qalendar, {
      props: {
        config: {
          defaultMode: 'week',
        }
      }
    })
    expect(wrapper.get('.mode-is-week'))
  });

  it('should have class "mode-is-month" when defaultMode is "month"', () => {
    const wrapper = mount(Qalendar, {
      props: {
        config: {
          defaultMode: 'month',
        }
      }
    })
    expect(wrapper.get('.mode-is-month'))
  })
})
