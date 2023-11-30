import {mount} from "@vue/test-utils";
import Qalendar from '../../../src/Qalendar.vue'
import { describe, expect, it, vi } from "vitest";
import { periodInterface } from "../../../src/typings/interfaces/period.interface";
import { WEEK_START_DAY } from "../../../src/helpers/Time";
import { EventBuilder } from "../../../src/models/Event";

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

  // TODO: remove with v4. day-was-clicked is deprecated
  it('should emit event "day-was-clicked" when receiving this from Month.vue', async () => {
    const wrapper = await whenInMonthMode();
    const monthComponent = wrapper.findComponent({ name: 'Month' })
    monthComponent.vm.$emit('date-was-clicked')
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

  it('should call window.removeEventListener when component is destroyed', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const wrapper = mount(Qalendar)
    wrapper.unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', wrapper.vm.onCalendarResize)
  })

  it('should propagate "updated-period" when receiving event from header component', () => {
    const wrapper = mount(Qalendar)
    const headerComponent = wrapper.findComponent({ name: 'AppHeader' })
    const periodPayload: periodInterface = { start: new Date(), end: new Date(), selectedDate: new Date() }
    headerComponent.vm.$emit('updated-period', periodPayload)
    expect(wrapper.emitted('updated-period')).toBeTruthy();
  });

  it('should update period when receiving event from header component', async () => {
    const pastDate = new Date(2000, 0, 1)
    const wrapper = mount(Qalendar, {
      props: { selectedDate: pastDate }
    })
    const headerComponent = wrapper.findComponent({ name: 'AppHeader' })
    const periodPayload: periodInterface = { start: new Date(), end: new Date(), selectedDate: new Date() }
    headerComponent.vm.$emit('updated-period', periodPayload)
    expect(wrapper.vm.period.selectedDate).not.toEqual(pastDate)
    expect(wrapper.vm.period).toEqual(periodPayload)
  });

  it.each([
    ['month', 'day'],
    ['day', 'week'],
    ['week', 'month'],
  ])('should set mode to %s when receiving "change-mode" event from header component', async (
    initialMode,
    expectedNewMode
    ) => {
    const wrapper = mount(Qalendar, {
      props: { config: { defaultMode: initialMode } }
    })
    const headerComponent = wrapper.findComponent({ name: 'AppHeader' })
    expect(wrapper.vm.mode).toEqual(initialMode)
    headerComponent.vm.$emit('change-mode', expectedNewMode)
    expect(wrapper.vm.mode).toEqual(expectedNewMode)
  })

  it('should set period when changing to day mode', async () => {
    const initialSelectedDate = new Date();
    const wrapper = mount(Qalendar, {
      props: {
        config: {
          defaultMode: 'month'
        },
        selectedDate: initialSelectedDate
      }
    })
    const headerComponent = wrapper.findComponent({ name: 'AppHeader' })

    headerComponent.vm.$emit('change-mode', 'day')

    expect(wrapper.vm.period.start).toEqual(initialSelectedDate)
    const newPeriodEnd = wrapper.vm.period.end;
    expect(newPeriodEnd.getFullYear()).toEqual(initialSelectedDate.getFullYear());
    expect(newPeriodEnd.getMonth()).toEqual(initialSelectedDate.getMonth());
    expect(newPeriodEnd.getDate()).toEqual(initialSelectedDate.getDate());
    expect(newPeriodEnd.getHours()).toEqual(23);
    expect(newPeriodEnd.getMinutes()).toEqual(59);
    expect(newPeriodEnd.getSeconds()).toEqual(59);
    expect(newPeriodEnd.getMilliseconds()).toEqual(999);
  });

  it('should set period when changing to week mode', async () => {
    const initialSelectedDate = new Date(2023, 5, 29);
    const wrapper = mount(Qalendar, {
      props: {
        config: {
          defaultMode: 'day'
        },
        selectedDate: initialSelectedDate
      }
    })
    const headerComponent = wrapper.findComponent({ name: 'AppHeader' })

    headerComponent.vm.$emit('change-mode', 'week')

    const newPeriodStart = wrapper.vm.period.start;
    expect(newPeriodStart.getFullYear()).toEqual(2023);
    expect(newPeriodStart.getMonth()).toEqual(5);
    expect(newPeriodStart.getDate()).toEqual(26);
    const newPeriodEnd = wrapper.vm.period.end;
    expect(newPeriodEnd.getFullYear()).toEqual(2023);
    expect(newPeriodEnd.getMonth()).toEqual(6);
    expect(newPeriodEnd.getDate()).toEqual(2);
    expect(newPeriodEnd.getHours()).toEqual(23);
    expect(newPeriodEnd.getMinutes()).toEqual(59);
    expect(newPeriodEnd.getSeconds()).toEqual(59);
    expect(newPeriodEnd.getMilliseconds()).toEqual(999);
  })

  it('should set period when changing to month mode', async () => {
    const initialSelectedDate = new Date(2023, 5, 29);
    const wrapper = mount(Qalendar, {
      props: {
        config: {
          defaultMode: 'day'
        },
        selectedDate: initialSelectedDate
      }
    })
    const headerComponent = wrapper.findComponent({ name: 'AppHeader' })

    headerComponent.vm.$emit('change-mode', 'month')

    const newPeriodStart = wrapper.vm.period.start;
    expect(newPeriodStart.getFullYear()).toEqual(2023);
    expect(newPeriodStart.getMonth()).toEqual(4); // for leading dates from previous month
    expect(newPeriodStart.getDate()).toEqual(29);
    const newPeriodEnd = wrapper.vm.period.end;
    expect(newPeriodEnd.getFullYear()).toEqual(2023);
    expect(newPeriodEnd.getMonth()).toEqual(6); // for trailing dates from next month
    expect(newPeriodEnd.getDate()).toEqual(2);
    expect(newPeriodEnd.getHours()).toEqual(23);
    expect(newPeriodEnd.getMinutes()).toEqual(59);
    expect(newPeriodEnd.getSeconds()).toEqual(59);
    expect(newPeriodEnd.getMilliseconds()).toEqual(999);
  })

  it('should propagate event "updated-mode" when changing mode', async () => {
    const wrapper = mount(Qalendar)
    const headerComponent = wrapper.findComponent({ name: 'AppHeader' })
    headerComponent.vm.$emit('change-mode', 'week')
    expect(wrapper.emitted('updated-mode')).toBeTruthy();
  })

  const whenQalendarIsSmall = async (mode: string) => {
    const wrapper = mount(Qalendar, {
      props: {
        config: {
          defaultMode: mode,
        },
      },
      attachTo: document.body
    });
    document.documentElement.style.fontSize = '16px'
    const calendarRoot = document.createElement('div')
    calendarRoot.classList.add('calendar-root')
    await wrapper.setData({ isSmall: false })
    expect(wrapper.vm.isSmall).toBe(false)

    return wrapper;
  }

  it('should set isSmall to true on resizing to a small width', async () => {
    const wrapper = await whenQalendarIsSmall('month')

    window.dispatchEvent(new Event('resize')) // triggers onCalendarResize()

    expect(wrapper.vm.isSmall).toBe(true)
  })

  it.each([
    // initialMode, expectedMode
    ['month', 'month'],
    ['day', 'day'],
    ['week', 'day'],
  ])('should set the correct mode when resizing to a small width', async (
    initialMode,
    expectedMode
  ) => {
    const wrapper = await whenQalendarIsSmall(initialMode)

    window.dispatchEvent(new Event('resize')) // triggers onCalendarResize()

    expect(wrapper.vm.mode).toBe(expectedMode)
  });

  it('should set the correct data-lang attribute on the calendar root element', async () => {
    const calendarRoot = document.createElement('div')
    calendarRoot.classList.add('calendar-root')
    const wrapper = mount(Qalendar, {
      props: {
        config: {
          defaultMode: 'month',
          locale: 'es'
        },
      },
      attachTo: document.body
    });
    const mountedCalendarRoot = wrapper.find('.calendar-root')
    expect(mountedCalendarRoot.attributes('data-lang')).toBe('es')
  });

  it('should set the correct fallback data-lang attribute on the calendar root element', async () => {
    const calendarRoot = document.createElement('div')
    calendarRoot.classList.add('calendar-root')
    const wrapper = mount(Qalendar, {
      props: {
        config: {
          defaultMode: 'month',
        },
      },
      attachTo: document.body
    });
    const mountedCalendarRoot = wrapper.find('.calendar-root')
    const expectedFallbackDataLang = 'en';
    expect(mountedCalendarRoot.attributes('data-lang')).toBe(expectedFallbackDataLang)
  })

  it('should set the correct first day of week in Time-instance', () => {
    const wrapper = mount(Qalendar, {
      props: {
        config: {
          week: {
            startsOn: WEEK_START_DAY.SUNDAY
          },
        },
      },
    });
    const time = wrapper.vm.time;
    expect(time.FIRST_DAY_OF_WEEK).toBe(WEEK_START_DAY.SUNDAY);
  })

  it('should set Monday as default first day of week in Time-instance', () => {
    const wrapper = mount(Qalendar);
    const actual = wrapper.vm.time.FIRST_DAY_OF_WEEK;
    const expected = WEEK_START_DAY.MONDAY;
    expect(actual).toBe(expected);
  })

  it('should set the correct locale in Time-instance', () => {
    const expectedLocale = 'ar';
    const wrapper = mount(Qalendar, {
      props: {
        config: {
          locale: expectedLocale
        }
      }
    })
    const actualLocale = wrapper.vm.time.CALENDAR_LOCALE;
    expect(actualLocale).toBe(expectedLocale);
  })

  it('should set the correct default locale in Time-instance', () => {
    const expectedLocale = 'en-US'; // default locale because no browser locale is set in this environment
    const wrapper = mount(Qalendar)
    const actualLocale = wrapper.vm.time.CALENDAR_LOCALE;
    expect(actualLocale).toBe(expectedLocale);
  })

  it('should set the correct day boundaries in Time-instance', () => {
    const selectedDayStart = 8;
    const selectedDayEnd = 20;

    const wrapper = mount(Qalendar, {
      props: {
        config: {
          dayBoundaries: {
            start: selectedDayStart,
            end: selectedDayEnd,
          },
        },
      },
    });
    const time = wrapper.vm.time;
    expect(time.DAY_START).toBe(selectedDayStart * 100);
    expect(time.DAY_END).toBe(selectedDayEnd * 100);
  })

  it('should set the correct default day boundaries in Time-instance', () => {
    const wrapper = mount(Qalendar);
    const time = wrapper.vm.time;
    expect(time.DAY_START).toBe(0);
    expect(time.DAY_END).toBe(2400);
  })

  it('should set the correct font family from config', () => {
    const expectedFontFamily = 'Roboto';
    const wrapper = mount(Qalendar, {
      props: {
        config: {
          style: {
            fontFamily: expectedFontFamily,
          }
        }
      }
    })
    const actualFontFamily = wrapper.vm.fontFamily;
    expect(actualFontFamily).toBe(expectedFontFamily);
  })

  it('should set the correct default font family', () => {
    const expectedFontFamily = "'Verdana', 'Open Sans', serif";
    const wrapper = mount(Qalendar)
    const actualFontFamily = wrapper.vm.fontFamily;
    expect(actualFontFamily).toBe(expectedFontFamily);
  })

  it('should check structure of events given as prop', async () => {
    const wrapper = mount(Qalendar)
    const checkEventPropertiesSpy = vi.spyOn(wrapper.vm.ErrorsHelper, 'checkEventProperties')
    await wrapper.setProps({
      events: [new EventBuilder({ start: '2023-07-01', end: '2024-07-01' }).build()],
    })
    expect(checkEventPropertiesSpy).toHaveBeenCalled();
  })

  it('should not check structure of events when config is set to silent', () => {
    const wrapper = mount(Qalendar, {
      props: {
        config: {
          isSilent: true,
        }
      }
    })
    const checkEventPropertiesSpy = vi.spyOn(wrapper.vm.ErrorsHelper, 'checkEventProperties')
    wrapper.setProps({
      events: [new EventBuilder({ start: '2023-07-01', end: '2024-07-01' }).build()],
    })
    expect(checkEventPropertiesSpy).not.toHaveBeenCalled();
  })

  it('should set mode to day, when receiving event "updated-period" from Month', async () => {
    const wrapper = await whenInMonthMode()
    const month = wrapper.findComponent({ name: 'Month' })
    month.vm.$emit('updated-period', { start: new Date(), end: new Date(), selectedDate: new Date() })
    expect(wrapper.vm.mode).toBe('day')
  })

  it('should invoke the goToPeriod method in the header', () => {
    const wrapper = mount(Qalendar)
    const header = wrapper.findComponent({ name: 'AppHeader' })
    const goToPeriodSpy = vi.spyOn(header.vm, 'goToPeriod')
    const expectedDirection = 'forward'

    wrapper.vm.goToPeriod(expectedDirection)

    expect(goToPeriodSpy).toHaveBeenCalledWith(expectedDirection)
  })
})
