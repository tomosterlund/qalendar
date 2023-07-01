import { mount } from "@vue/test-utils";
import Header from "../../../../src/components/header/Header.vue";
import { describe, expect, it, vi } from "vitest";
import Time, { WEEK_START_DAY } from "../../../../src/helpers/Time";
import { nextTick } from "vue";

describe("Header.vue", () => {
  const defaultProps = {
    time: new Time(WEEK_START_DAY.MONDAY, "en-US"),
    period: {
      selectedDate: new Date(),
      start: new Date(),
      end: new Date(),
    },
  };

  const factory = (props = {}) => {
    return  mount(Header, {
      props: {
        ...defaultProps,
        ...props,
      }
    });
  }

  it("should view the month(s) name", () => {
    const wrapper = factory();
    const monthName = wrapper.find(".calendar-header__period-name");
    expect(monthName.text()).toBeDefined();
  });

  it("should emit event for changing to month mode", async () => {
    const wrapper = factory();
    await wrapper.find(".calendar-header__mode-value").trigger("click");
    await nextTick();
    await wrapper.find(".is-month-mode").trigger("click");
    const changeModeEvent = wrapper.emitted("change-mode");

    if (!changeModeEvent) throw new Error("no event");
    expect(changeModeEvent[0]).toEqual(["month"]);
  });

  it("should emit event for changing to day mode", async () => {
    const wrapper = factory();
    await wrapper.find(".calendar-header__mode-value").trigger("click");
    await wrapper.find(".is-day-mode").trigger("click");
    const changeModeEvent = wrapper.emitted("change-mode");

    if (!changeModeEvent) throw new Error("no event");
    expect(changeModeEvent[0]).toEqual(["day"]);
  });

  it("should emit event for changing to week mode", async () => {
    const wrapper = factory();
    await wrapper.find(".calendar-header__mode-value").trigger("click");
    await wrapper.find(".is-week-mode").trigger("click");
    const changeModeEvent = wrapper.emitted("change-mode");

    if (!changeModeEvent) throw new Error("no event");
    expect(changeModeEvent[0]).toEqual(["week"]);
  });

  it('should disable week & month mode, thus hiding the mode select', () => {
    const wrapper = factory({
      config: {
        disableModes: ['week', 'month'],
      },
    })

    expect(() => wrapper.get('.calendar-header__mode-picker')).toThrow();
  })

  it('should emit event "updated-period" when DatePicker sends @updated event', () => {
    const wrapper = factory();
    const expectedEventPayload = {
      start: new Date(),
      end: new Date(),
      selectedDate: new Date(),
    };
    wrapper.findComponent({ name: "DatePicker" }).vm.$emit("updated", expectedEventPayload);
    const updatePeriodEvent = wrapper.emitted("updated-period");

    if (!updatePeriodEvent) throw new Error("no event");
    expect(updatePeriodEvent[0]).toEqual([expectedEventPayload]);
  })

  it('should update current period when DatePicker sends @updated event', () => {
    const wrapper = factory();
    const expectedEventPayload = {
      start: new Date(),
      end: new Date(),
      selectedDate: new Date(),
    };
    wrapper.findComponent({ name: "DatePicker" }).vm.$emit("updated", expectedEventPayload);
    expect(wrapper.vm.currentPeriod).toEqual(expectedEventPayload);
  })

  it('should update period forwards in DatePicker, when clicking right chevron', () => {
    const wrapper = factory();
    const DatePicker = wrapper.findComponent({ name: "DatePicker" });
    const goToPeriodSpy = vi.spyOn(DatePicker.vm, 'goToPeriod');

    wrapper.find('.calendar-header__chevron-arrow-right').trigger('click');

    expect(goToPeriodSpy).toHaveBeenCalledWith('next');
  })

  it('should update period backwards in DatePicker, when clicking left chevron', () => {
    const wrapper = factory();
    const DatePicker = wrapper.findComponent({ name: "DatePicker" });
    const goToPeriodSpy = vi.spyOn(DatePicker.vm, 'goToPeriod');

    wrapper.find('.calendar-header__chevron-arrow-left').trigger('click');

    expect(goToPeriodSpy).toHaveBeenCalledWith('previous');
  })

  it.todo('should display period name for week mode')

  it.todo('should display period name for month mode')
});
