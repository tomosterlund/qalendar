import {mount} from "@vue/test-utils";
import DayEvent from "../../../../src/components/week/DayEvent.vue";
import {describe, expect, test, it, vi } from "vitest";
import Time, {TimeBuilder, WEEK_START_DAY} from "../../../../src/helpers/Time";
import {nextTick} from "vue";
import {mountComponent} from "../../../vitest-setup";
import unidecode from 'unidecode';
import {EventBuilder} from "../../../../src/models/Event";
import {EVENT_COLORS} from "../../../../src/constants";

const propsForAllTests = {
  time: new Time(WEEK_START_DAY.SUNDAY, "en-US"),
  dayInfo: { daysTotalN: 7, thisDayIndex: 1, dateTimeString: "2022-05-20" },
  config: {},
  mode: 'week',
}

const dayEvent = mountComponent(mount, DayEvent)
const getWrapperWithRandomEvent = () => {
  const event = new EventBuilder({
    start: "2022-05-20 09:00",
    end: "2022-05-20 09:30",
  }).build()

  return dayEvent({
    props: {
      ...propsForAllTests,
      eventProp: event,
    }
  })
}
const RESIZE_UP_SELECTOR = '.calendar-week__event-resize-up';
const RESIZE_DOWN_SELECTOR = '.calendar-week__event-resize-down';
const EVENT_ELEMENT_SELECTOR = ".calendar-week__event";
const GRADIENT_SELECTOR = '.calendar-week__event-blend-out';

function getEventElement(wrapper: any) {
  return wrapper.find(EVENT_ELEMENT_SELECTOR);
}

describe("DayEvent.vue", () => {
  it("should display the title of av event", () => {
    const event = new EventBuilder({ start: "2022-05-20 09:00", end: "2022-05-20 10:00" })
      .withTitle("Biology lab")
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      },
    });
    const titleElement = wrapper.find(".is-title");
    expect(titleElement.text()).toBe("Biology lab");
    //
    // const withElement = wrapper.find(".is-with");
    // expect(withElement.text()).toBe("Tom Österlund");
  });

  it('should display the time of an event', () => {
    const event = new EventBuilder({ start: "2022-05-20 09:00", end: "2022-05-20 10:00" })
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      },
    });
    const timeElement = wrapper.find(".is-time");
    expect(
      unidecode(timeElement.text())
    ).toBe("9:00 AM - 10:00 AM");
  });

  it('should display the description of an event', () => {
    const expectedDescription = "Read textbook p. 70-72";
    const event = new EventBuilder({ start: "2022-05-20 09:00", end: "2022-05-20 10:00" })
      .withDescription(expectedDescription)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      },
    });
    const descriptionElement = wrapper.find(".is-description");
    expect(descriptionElement.text()).toBe(expectedDescription);
  })

  it('should display the topic of an event', () => {
    const expectedTopic = "Biology";
    const event = new EventBuilder({ start: "2022-05-20 09:00", end: "2022-05-20 10:00" })
      .withTopic(expectedTopic)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      },
    });
    const topicElement = wrapper.find(".is-topic");
    expect(topicElement.text()).toBe(expectedTopic);
  })

  it('should display the "with" property of an event', () => {
    const expectedWith = "Tom Österlund";
    const event = new EventBuilder({ start: "2022-05-20 09:00", end: "2022-05-20 10:00" })
      .withWith(expectedWith)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      }
    })

    const withElement = wrapper.find(".is-with");
    expect(withElement.text()).toBe(expectedWith);
  })

  it('should display the location of an event', () => {
    const expectedLocation = "School";
    const event = new EventBuilder({ start: "2022-05-20 09:00", end: "2022-05-20 10:00" })
      .withLocation(expectedLocation)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      },
    });
    const locationElement = wrapper.find(".is-location");
    expect(locationElement.text()).toBe(expectedLocation);
  });

  it("should set background-color via a colorScheme", async () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    })
      .withColorScheme("ladies")
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
        config: {
          style: {
            colorSchemes: {
              ladies: {
                color: "#fff",
                backgroundColor: "#ff4081",
              },
            },
          },
        },
      },
    });

    const eventElement = getEventElement(wrapper);

    wrapper.vm.setColors();
    await nextTick();
    expect(eventElement.attributes().style).toContain(
      "background-color: rgb(255, 64, 129)"
    ); // The pink BG
    expect(eventElement.attributes().style).toContain(
      "color: rgb(255, 255, 255)"
    ); // The white text
  });

  it("should set background-color via a color", async () => {
    const expectedColor = 'green';
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    })
      .withColor(expectedColor)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      },
    });

    const eventElement = getEventElement(wrapper)

    wrapper.vm.setColors();
    await nextTick();
    expect(eventElement.attributes().style).toContain(
      `background-color: ${EVENT_COLORS[expectedColor]}`
    ); // The green BG
    expect(eventElement.attributes().style).toContain(
      "color: rgb(255, 255, 255)"
    ); // The white text
  })

  it("should set blue as default background color", async () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    }).withColor('blue').build()

    const wrapper = dayEvent({
      props: {
        eventProp: event,
        ...propsForAllTests
      }
    });

    const eventElement = getEventElement(wrapper)
    wrapper.vm.setColors();
    await nextTick();
    expect(eventElement.attributes().style).toContain(
      `background-color: ${EVENT_COLORS.blue}`
    )
  })

  it('should emit "drag-end" on mouseup after dragging', () => {
    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: {
          id: "sdfgdfsda-435643-dsfghgd",
          title: "Biology lab",
          time: { start: "2022-05-20 09:00", end: "2022-05-20 10:00" },
        },
      },
    });

    expect(wrapper.emitted('drag-end')).toBe(undefined);
    wrapper.vm.onMouseUpWhenDragging();
    expect(wrapper.emitted('drag-end')).toBeTruthy();
  })

  it('should not set a white border for an event with no previous concurrent events', () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    })
    .withNOfPreviousConcurrentEvents(0)
    .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      }
    });

    const eventElement = getEventElement(wrapper)
    expect(eventElement.attributes().style).not.toContain(
      "border: 1px solid #fff"
    )
  })

  it('should set a white border for an event with previous concurrent events', () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    })
      .withNOfPreviousConcurrentEvents(1)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      }
    });

    const eventElement = getEventElement(wrapper);
    expect(eventElement.attributes().style).toContain(
      "border: 1px solid #fff"
    )
  })

  it('Displays not display the resize elements, for an editable event that is not hovered', () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    })
      .withIsEditable(true)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      }
    })

    const resizeUpElement = wrapper.findAll(RESIZE_UP_SELECTOR)
    const resizeDownElement = wrapper.findAll(RESIZE_DOWN_SELECTOR)
    expect(resizeUpElement.length).toBe(0)
    expect(resizeDownElement.length).toBe(0)
  })

  it('Displays the resize elements, for an editable event that is hovered', async () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    })
      .withIsEditable(true)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      }
    })

    const eventElement = getEventElement(wrapper);
    await eventElement.trigger('mouseenter')

    const resizeUpElement = wrapper.findAll(RESIZE_UP_SELECTOR)
    const resizeDownElement = wrapper.findAll(RESIZE_DOWN_SELECTOR)
    expect(resizeUpElement.length).toBe(1)
    expect(resizeDownElement.length).toBe(1)
  })

  it('should hide the resize elements when the mouse leaves the event', async () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    })
      .withIsEditable(true)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      }
    })

    const eventElement = getEventElement(wrapper);
    await eventElement.trigger('mouseenter')

    let resizeUpElement = wrapper.findAll(RESIZE_UP_SELECTOR)
    let resizeDownElement = wrapper.findAll(RESIZE_DOWN_SELECTOR)
    expect(resizeUpElement.length).toBe(1)
    expect(resizeDownElement.length).toBe(1)

    await eventElement.trigger('mouseleave')
    resizeUpElement = wrapper.findAll(RESIZE_UP_SELECTOR)
    resizeDownElement = wrapper.findAll(RESIZE_DOWN_SELECTOR)
    expect(resizeUpElement.length).toBe(0)
    expect(resizeDownElement.length).toBe(0)
  })

  it('Does not display the resize elements, for a non-editable event that is hovered', async () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    })
      .withIsEditable(false)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      }
    })

    const eventElement = wrapper.find(EVENT_ELEMENT_SELECTOR);
    await eventElement.trigger('mouseenter')

    const resizeUpElement = wrapper.findAll(RESIZE_UP_SELECTOR)
    const resizeDownElement = wrapper.findAll(RESIZE_DOWN_SELECTOR)
    expect(resizeUpElement.length).toBe(0)
    expect(resizeDownElement.length).toBe(0)
  });

  it('should not display a gradient for blending out event texts, for an event shorter than 30 minutes', () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 09:25",
    }).build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      }
    })

    const gradientElement = wrapper.find(GRADIENT_SELECTOR)
    expect(gradientElement.exists()).toBe(false)
  })

  it('should display a gradient for blending out event texts, for an event longer than 30 minutes', () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 09:30",
    }).build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      }
    })

    const gradientElement = wrapper.find(GRADIENT_SELECTOR)
    expect(gradientElement.exists()).toBe(true)
  })

  it('should call initDrag on mousedown', () => {
    const wrapper = getWrapperWithRandomEvent();
    const initDragSpy = vi.spyOn(wrapper.vm, 'initDrag')
    const eventElement = getEventElement(wrapper)
    expect(initDragSpy).not.toHaveBeenCalled()
    eventElement.trigger('mousedown')
    expect(initDragSpy).toHaveBeenCalled()
  })

  it('should call initDrag on touchstart', () => {
    const wrapper = getWrapperWithRandomEvent();
    const initDragSpy = vi.spyOn(wrapper.vm, 'initDrag')
    const eventElement = getEventElement(wrapper)
    expect(initDragSpy).not.toHaveBeenCalled()
    eventElement.trigger('touchstart')
    expect(initDragSpy).toHaveBeenCalled()
  })

  it('should call initDrag on mousedown for custom event', () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    })
      .withIsCustom(true)
      .withIsEditable(true)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      }
    })

    const initDragSpy = vi.spyOn(wrapper.vm, 'initDrag')
    const eventElement = getEventElement(wrapper)
    expect(initDragSpy).not.toHaveBeenCalled()
    eventElement.trigger('mousedown')
    expect(initDragSpy).toHaveBeenCalled()
  })

  it('should call initDrag on touchstart for custom event', () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    })
      .withIsCustom(true)
      .withIsEditable(true)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      }
    })

    const initDragSpy = vi.spyOn(wrapper.vm, 'initDrag')
    const eventElement = getEventElement(wrapper)
    expect(initDragSpy).not.toHaveBeenCalled()
    eventElement.trigger('touchstart')
    expect(initDragSpy).toHaveBeenCalled()
  })

  it('Starts a resizing action on mousedown on the resize up element', async () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    })
      .withIsEditable(true)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      }
    })

    const eventElement = getEventElement(wrapper);
    await eventElement.trigger('mouseenter')

    const resizeUpElement = wrapper.find(RESIZE_UP_SELECTOR)
    const initResizeSpy = vi.spyOn(wrapper.vm, 'resizeEvent')
    expect(initResizeSpy).not.toHaveBeenCalled()
    resizeUpElement.trigger('mousedown')
    expect(initResizeSpy).toHaveBeenCalled()
  });

  it('Starts a resizing action on mouswdown on the resize down element', async () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    })
      .withIsEditable(true)
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      }
    })

    const eventElement = getEventElement(wrapper);
    await eventElement.trigger('mouseenter')

    const resizeDownElement = wrapper.find(RESIZE_DOWN_SELECTOR)
    const initResizeSpy = vi.spyOn(wrapper.vm, 'resizeEvent')
    expect(initResizeSpy).not.toHaveBeenCalled()
    resizeDownElement.trigger('mousedown')
    expect(initResizeSpy).toHaveBeenCalled()
  })

  it('Emits event-was-resized when resize action ends', () => {
    const wrapper = getWrapperWithRandomEvent();
    expect(wrapper.emitted('event-was-resized')).toBeUndefined()
    wrapper.vm.stopResizing()
    expect(wrapper.emitted('event-was-resized')).toBeDefined()
  })

  it('should not allow resize when disabled via event prop', async () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    })
      .withIsEditable(true)
      .withDisableResize(['week'])
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      }
    })

    const eventElement = getEventElement(wrapper);
    await eventElement.trigger('mouseenter')

    const resizeUpElement = wrapper.find(RESIZE_UP_SELECTOR)
    const resizeDownElement = wrapper.find(RESIZE_DOWN_SELECTOR)
    expect(resizeUpElement.exists()).toBe(false)
    expect(resizeDownElement.exists()).toBe(false)
  })

  it('Emits event-was-dragged when drag action ends', () => {
    const wrapper = getWrapperWithRandomEvent();
    expect(wrapper.emitted('event-was-dragged')).toBeUndefined()
    wrapper.vm.changeInDaysOnDrag = 1 // to pass condition for emitting event
    wrapper.vm.handleDragEnd()
    expect(wrapper.emitted('event-was-dragged')).toBeDefined()
  })

  it('changes event.time.start on changes in changeInQuarterHoursEventStart', async () => {
    const wrapper = getWrapperWithRandomEvent();
    const event = wrapper.vm.event
    const initialStart = event.time.start
    const initialStartPlus15minutes = new Time().addMinutesToDateTimeString(15, initialStart);
    wrapper.vm.changeInQuarterHoursEventStart = 1
    await nextTick()
    expect(event.time.start).toEqual(initialStartPlus15minutes)
  })

  it('changes event.time.end on changes in changeInQuarterHoursEventEnd', async () => {
    const wrapper = getWrapperWithRandomEvent();
    const event = wrapper.vm.event
    const initialEnd = event.time.end
    const initialEndPlus15minutes = new Time().addMinutesToDateTimeString(15, initialEnd);
    wrapper.vm.changeInQuarterHoursEventEnd = 1
    await nextTick()
    expect(event.time.end).toEqual(initialEndPlus15minutes)
  })

  it('changes event.time.start on changes in changeInQuartersOnDrag', async () => {
    const wrapper = getWrapperWithRandomEvent();
    const event = wrapper.vm.event
    const initialStart = event.time.start
    const initialStartPlus15minutes = new Time().addMinutesToDateTimeString(15, initialStart);
    expect(event.time.start).not.toEqual(initialStartPlus15minutes)
    wrapper.vm.changeInQuartersOnDrag = 1
    await nextTick()
    expect(event.time.start).toEqual(initialStartPlus15minutes)
  })

  it('changes event.time.end on changes in changeInQuartersOnDrag', async () => {
    const wrapper = getWrapperWithRandomEvent();
    const event = wrapper.vm.event
    const initialEnd = event.time.end
    const initialEndPlus15minutes = new Time().addMinutesToDateTimeString(15, initialEnd);
    expect(event.time.end).not.toEqual(initialEndPlus15minutes)
    wrapper.vm.changeInQuartersOnDrag = 1
    await nextTick()
    expect(event.time.end).toEqual(initialEndPlus15minutes)
  })

  it('changes event.time.start on changes in changeInDaysOnDrag', async () => {
    const wrapper = getWrapperWithRandomEvent();
    const event = wrapper.vm.event
    const initialStart = event.time.start
    const initialStartPlus1Day = new Time().addDaysToDateTimeString(1, initialStart);
    expect(event.time.start).not.toEqual(initialStartPlus1Day)
    wrapper.vm.dayElement = document.createElement('div') // needed to deactivate guard
    wrapper.vm.changeInDaysOnDrag = 1
    await nextTick()
    expect(event.time.start).toEqual(initialStartPlus1Day)
  })

  it('changes event.time.end on changes in changeInDaysOnDrag', async () => {
    const wrapper = getWrapperWithRandomEvent();
    const event = wrapper.vm.event
    const initialEnd = event.time.end
    const initialEndPlus1Day = new Time().addDaysToDateTimeString(1, initialEnd);
    expect(event.time.end).not.toEqual(initialEndPlus1Day)
    wrapper.vm.dayElement = document.createElement('div') // needed to deactivate guard
    wrapper.vm.changeInDaysOnDrag = 1
    await nextTick()
    expect(event.time.end).toEqual(initialEndPlus1Day)
  })

  it('detects if event is custom, through checking an isCustom-Array against the calendar mode', () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    })
      .withIsCustom(['week'])
      .build()

    const wrapperCustomEvent = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      }
    })

    expect(wrapperCustomEvent.vm.isCustomEvent).toBe(true)
  })

  it('calculates the number of timePoints in a full day', () => {
    const wrapper = getWrapperWithRandomEvent();
    expect(wrapper.vm.timePointsInDay).toBe(2400)
  })

  it('calculates the number of timePoints in a shortened day', () => {
    const wrapperInShortenedDay = dayEvent({
      props: {
        ...propsForAllTests,
        time: new TimeBuilder().withDayBoundaries({ start: 800, end: 1800 }).build(),
        eventProp: new EventBuilder({ start: '2022-01-01 00:00', end: '2022-01-01 00:10' }).build()
      }
    })

    expect(wrapperInShortenedDay.vm.timePointsInDay).toBe(1000)
  })

  it('calculates the number of timePoints in a minute', () => {
    const wrapper = getWrapperWithRandomEvent();
    expect(wrapper.vm.timePointsInOneMinute).toBe(100 / 60)
  })

  it('has no class for forbidden cursor, when not disabling drag & drop through disableDnD array', () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    })
      .withDisableDnD(['month'])
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      }
    })

    const eventElement = getEventElement(wrapper)
    expect(eventElement.classes()).not.toContain('has-disabled-dnd')
  })

  it('sets class for forbidden cursor, when disabling drag & drop through disableDnD array', () => {
    const event = new EventBuilder({
      start: "2022-05-20 09:00",
      end: "2022-05-20 10:00",
    })
      .withDisableDnD(['week'])
      .build()

    const wrapper = dayEvent({
      props: {
        ...propsForAllTests,
        eventProp: event,
      }
    })

    const eventElement = getEventElement(wrapper)
    expect(eventElement.classes()).toContain('has-disabled-dnd')
  })
});
