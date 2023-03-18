import {mount} from "@vue/test-utils";
import DayEvent from "../../../../src/components/week/DayEvent.vue";
import {describe, expect, test, it, vi } from "vitest";
import Time, {WEEK_START_DAY} from "../../../../src/helpers/Time";
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

    const eventElement = wrapper.find(EVENT_ELEMENT_SELECTOR);

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

    const eventElement = wrapper.find(EVENT_ELEMENT_SELECTOR);

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

    const eventElement = wrapper.find(EVENT_ELEMENT_SELECTOR);
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

    const eventElement = wrapper.find(EVENT_ELEMENT_SELECTOR);
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

    const eventElement = wrapper.find(EVENT_ELEMENT_SELECTOR);
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

    const eventElement = wrapper.find(EVENT_ELEMENT_SELECTOR);
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

    const eventElement = wrapper.find(EVENT_ELEMENT_SELECTOR);
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
    const eventElement = wrapper.find(EVENT_ELEMENT_SELECTOR)
    expect(initDragSpy).not.toHaveBeenCalled()
    eventElement.trigger('mousedown')
    expect(initDragSpy).toHaveBeenCalled()
  })

  it('should call initDrag on touchstart', () => {
    const wrapper = getWrapperWithRandomEvent();
    const initDragSpy = vi.spyOn(wrapper.vm, 'initDrag')
    const eventElement = wrapper.find(EVENT_ELEMENT_SELECTOR)
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
    const eventElement = wrapper.find(EVENT_ELEMENT_SELECTOR)
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
    const eventElement = wrapper.find(EVENT_ELEMENT_SELECTOR)
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

    const eventElement = wrapper.find(EVENT_ELEMENT_SELECTOR);
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

    const eventElement = wrapper.find(EVENT_ELEMENT_SELECTOR);
    await eventElement.trigger('mouseenter')

    const resizeDownElement = wrapper.find(RESIZE_DOWN_SELECTOR)
    const initResizeSpy = vi.spyOn(wrapper.vm, 'resizeEvent')
    expect(initResizeSpy).not.toHaveBeenCalled()
    resizeDownElement.trigger('mousedown')
    expect(initResizeSpy).toHaveBeenCalled()
  })
});
