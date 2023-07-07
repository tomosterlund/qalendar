import {mount, shallowMount, VueWrapper} from "@vue/test-utils";
import Day from "../../../../src/components/week/Day.vue";
import {describe, expect, it, vi} from "vitest";
import Time, {WEEK_START_DAY} from "../../../../src/helpers/Time";
import { defaultOptions, optionsWithIntervalStyles, intervalColor, intervalBackgroundColor } from "./Day.test-utils";

const INTERVALS_SELECTOR = ".calendar-week__day-interval";
describe("Day.vue", () => {
  it("Renders three events", async () => {
    const wrapper = await shallowMount(Day, defaultOptions);
    const events = wrapper.findAll("[data-test='day-event']");
    expect(events).toHaveLength(3);
  });

  it('renders the clickable intervals', async () => {
    const wrapper = await shallowMount(Day, defaultOptions);
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
    const wrapper = shallowMount(Day, defaultOptions);
    expect(wrapper.emitted()).not.toHaveProperty('datetime-was-clicked');
    const day = wrapper.find(".calendar-week__day");
    await day.trigger("click");
    expect(wrapper.emitted()).toHaveProperty('datetime-was-clicked');
    expect(wrapper.emitted('datetime-was-clicked'));
    expect(wrapper.emitted('datetime-was-clicked')[0][0]).toHaveLength(16);
  });

  it('renders the clickable events', async () => {
    const wrapper = await shallowMount(Day, defaultOptions);
    expect(wrapper.emitted()).not.toHaveProperty('interval-was-clicked');
    const firstInterval = wrapper.find(INTERVALS_SELECTOR);
    await firstInterval.trigger("click");
    expect(wrapper.emitted().click).toHaveLength(1);
    expect(wrapper.emitted()).toHaveProperty('interval-was-clicked');
    expect(wrapper.emitted('interval-was-clicked')).toEqual([[{ "intervalStart": "2022-05-22 00:00", "intervalEnd": "2022-05-22 00:15" }]]);
  })

  it('Emits event day-was-clicked', async () => {
    const wrapper = shallowMount(Day, defaultOptions);
    expect(wrapper.emitted()).not.toHaveProperty('day-was-clicked');
    const day = wrapper.find(".calendar-week__day");
    await day.trigger("click");
    expect(wrapper.emitted()).toHaveProperty('day-was-clicked');
    expect(wrapper.emitted('day-was-clicked'));
  })

  it('triggers calculating new event concurrency when events are resized', async () => {
    const wrapper = await mount(Day, defaultOptions);
    const dayEventComponent = await wrapper.findComponent('.calendar-week__event');
    if (!dayEventComponent) throw new Error('dayEventComponent not found');
    const calculateEventConcurrencySpy = vi.spyOn(wrapper.vm, 'calculateEventConcurrency');
    expect(calculateEventConcurrencySpy).not.toHaveBeenCalled();
    (dayEventComponent as VueWrapper).vm.$emit('event-was-resized');
    expect(calculateEventConcurrencySpy).toHaveBeenCalled();
  })

  it.each([
    ['event-was-clicked'],
    ['event-was-dragged'],
    ['drag-start'],
    ['drag-end'],
    ['event-was-resized'],
  ])('passes on %s to parent component', async eventName => {
    const wrapper = await mount(Day, defaultOptions);
    expect(wrapper.emitted()).not.toHaveProperty(eventName);
    const dayEventComponent = wrapper.findComponent('.calendar-week__event');
    (dayEventComponent as VueWrapper).vm.$emit(eventName);
    expect(wrapper.emitted()).toHaveProperty(eventName);
  })

  it('should display an interval with custom styles', async () => {
    const wrapper = await shallowMount(Day, optionsWithIntervalStyles);
    const firstInterval = await wrapper.find('.calendar-week__day-interval')
    expect(firstInterval.attributes('style')).toContain(`color: ${intervalColor};`)
    expect(firstInterval.attributes('style')).toContain(`background-color: ${intervalBackgroundColor};`)
  })

  it('should not display any custom interval styles', async () => {
    const options = optionsWithIntervalStyles;
    options.props.config.dayIntervals.intervalStyles = null;
    const wrapper = await shallowMount(Day, options);
    const firstInterval = wrapper.find('.calendar-week__day-interval')
    expect(firstInterval.attributes('style')).toBeUndefined()
  })
});
