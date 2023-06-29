import {mount, shallowMount, VueWrapper} from "@vue/test-utils";
import Day from "../../../../src/components/week/Day.vue";
import {describe, expect, it, vi, beforeEach} from "vitest";
import Time, {WEEK_START_DAY} from "../../../../src/helpers/Time";

const INTERVALS_SELECTOR = ".calendar-week__day-interval";
describe("Day.vue", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(Day, {
      props: {
        weekHeight: 2400,
        time: new Time(WEEK_START_DAY.SUNDAY, "en-US"),
        day: {
          dayName: "Sunday",
          dateTimeString: "2022-05-22 00:00",
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
        },
        config: {},
        dayIntervals: {
          length: 15,
          height: 15,
          displayClickableInterval: true,
        },
        mode: 'week',
        dayInfo: { daysTotalN: 7, thisDayIndex: 1, dateTimeString: "2022-05-22 00:00" },
      },
    });
  })


  it("Renders three events", () => {
    const events = wrapper.findAll("[data-test='day-event']");
    expect(events).toHaveLength(3);
  });

  it('renders the clickable intervals', () => {
    const intervals = wrapper.findAll(INTERVALS_SELECTOR);
    // 98 = (15 minute intervals * 4 for an hour) * 24 hours for a day
    expect(intervals).toHaveLength(96);
  })

  it('does not render clickable intervals', () => {
    const wrapperWithoutIntervals = shallowMount(Day, {
      props: {
        weekHeight: 2400,
        time: new Time(WEEK_START_DAY.SUNDAY, "en-US"),
        day: {
          dayName: "Sunday",
          dateTimeString: "2022-05-22 00:00",
          events: [],
        },
        config: {},
        dayIntervals: {
          length: 15,
          height: 15,
          displayClickableInterval: false,
        },
        mode: 'week',
        dayInfo: { daysTotalN: 7, thisDayIndex: 1, dateTimeString: "2022-05-22 00:00" },
      },
    });

    const intervals = wrapperWithoutIntervals.findAll(INTERVALS_SELECTOR);
    expect(intervals).toHaveLength(0);
  })

  it('emits event datetime-was-clicked when clicking anywhere on a day', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('datetime-was-clicked');
    const day = wrapper.find(".calendar-week__day");
    await day.trigger("click");
    expect(wrapper.emitted()).toHaveProperty('datetime-was-clicked');
    expect(wrapper.emitted('datetime-was-clicked'));
    expect(wrapper.emitted('datetime-was-clicked')[0][0]).toHaveLength(16);
  });

  it('renders the clickable events', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('interval-was-clicked');
    const firstInterval = wrapper.find(INTERVALS_SELECTOR);
    await firstInterval.trigger("click");
    expect(wrapper.emitted().click).toHaveLength(1);
    expect(wrapper.emitted()).toHaveProperty('interval-was-clicked');
    expect(wrapper.emitted('interval-was-clicked')).toEqual([[{ "intervalStart": "2022-05-22 00:00", "intervalEnd": "2022-05-22 00:15" }]]);
  })

  it('Emits event day-was-clicked', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('day-was-clicked');
    const day = wrapper.find(".calendar-week__day");
    await day.trigger("click");
    expect(wrapper.emitted()).toHaveProperty('day-was-clicked');
    expect(wrapper.emitted('day-was-clicked'));
  })

  it('Emits event-was-resized on receiving the same event', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('event-was-resized');
    const dayEventComponent = await wrapper.findComponent('.calendar-week__event');
    if (!dayEventComponent) throw new Error('dayEventComponent not found');
    (dayEventComponent as VueWrapper).vm.$emit('event-was-resized');
    expect(wrapper.emitted()).toHaveProperty('event-was-resized');
  })

  it('triggers calculating new event concurrency when events are resized', async () => {
    const dayEventComponent = await wrapper.findComponent('.calendar-week__event');
    if (!dayEventComponent) throw new Error('dayEventComponent not found');
    const calculateEventConcurrencySpy = vi.spyOn(wrapper.vm, 'calculateEventConcurrency');
    expect(calculateEventConcurrencySpy).not.toHaveBeenCalled();
    (dayEventComponent as VueWrapper).vm.$emit('event-was-resized');
    expect(calculateEventConcurrencySpy).toHaveBeenCalled();
  })

  it('passes on event-was-clicked to parent component', () => {
    expect(wrapper.emitted()).not.toHaveProperty('event-was-clicked');
    const dayEventComponent = wrapper.findComponent('.calendar-week__event');
    if (!dayEventComponent) throw new Error('dayEventComponent not found');
    (dayEventComponent as VueWrapper).vm.$emit('event-was-clicked');
    expect(wrapper.emitted()).toHaveProperty('event-was-clicked');
  })

  it('passes on event-was-dragged to parent component', () => {
    expect(wrapper.emitted()).not.toHaveProperty('event-was-dragged');
    const dayEventComponent = wrapper.findComponent('.calendar-week__event');
    if (!dayEventComponent) throw new Error('dayEventComponent not found');
    (dayEventComponent as VueWrapper).vm.$emit('event-was-dragged');
    expect(wrapper.emitted()).toHaveProperty('event-was-dragged');
  })

  it('passes on drag-start to parent component', () => {
    expect(wrapper.emitted()).not.toHaveProperty('drag-start');
    const dayEventComponent = wrapper.findComponent('.calendar-week__event');
    if (!dayEventComponent) throw new Error('dayEventComponent not found');
    (dayEventComponent as VueWrapper).vm.$emit('drag-start');
    expect(wrapper.emitted()).toHaveProperty('drag-start');
  })

  it('passing "drag-end" to parent component upon receiving it from DayEvent', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('drag-end');
    const dayEvent = wrapper.findComponent(".calendar-week__event");
    await (dayEvent as VueWrapper).vm.$emit('drag-end');
    expect(wrapper.emitted()).toHaveProperty('drag-end');
  })
});
