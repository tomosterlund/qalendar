import EventFlyout from '../../../src/components/partials/EventFlyout.vue'
import { EventBuilder } from "../../../src/models/Event";
import { EventColor } from "../../../src/typings/interfaces/event.interface";
import { shallowMount } from "@vue/test-utils";
import Time, { WEEK_START_DAY } from "../../../src/helpers/Time";
import { expect, vi } from "vitest";
import { configInterface } from "../../../src/typings/config.interface";

export const eventWithTitle = (title: string) => {
  return new EventBuilder({
    start: '2022-12-01 09:00',
    end: '2022-12-01 10:00',
  })
    .withTitle(title)
    .build()
}

const minimalEvent = () => {
  return new EventBuilder({
    start: '2022-12-01 09:00',
    end: '2022-12-01 10:00',
  })
    .withTitle('Foo')
    .build()
}

export const eventWithoutLocation = () => minimalEvent();

export const eventWithLocation = (location: string) => {
  return new EventBuilder({
    start: '2022-12-01 09:00',
    end: '2022-12-01 10:00',
  })
    .withLocation(location)
    .build()
}

export const eventWithoutWithProperty = () => minimalEvent()

export const eventWithWithProperty = (withProperty: string) => {
  return new EventBuilder({
    start: '2022-12-01 09:00',
    end: '2022-12-01 10:00',
  })
    .withWith(withProperty)
    .build()
}

export const eventWithoutTopic = () => minimalEvent()

export const eventWithTopic = (topic: string) => {
  return new EventBuilder({
    start: '2022-12-01 09:00',
    end: '2022-12-01 10:00',
  })
    .withTopic(topic)
    .build()
}

export const eventWithoutDescription = () => minimalEvent()

export const eventWithDescription = (description: string) => {
  return new EventBuilder({
    start: '2022-12-01 09:00',
    end: '2022-12-01 10:00',
  })
    .withDescription(description)
    .build()
}

export const eventWithColor = (color: EventColor) => {
  return new EventBuilder({
    start: '2022-12-01 09:00',
    end: '2022-12-01 10:00',
  })
    .withTitle('Foo')
    .withColor(color)
    .build()
}

export const eventWithColorScheme = (colorScheme: string) => {
  return new EventBuilder({
    start: '2022-12-01 09:00',
    end: '2022-12-01 10:00',
  })
    .withTitle('Foo')
    .withColorScheme(colorScheme)
    .build()
}

export const propsForAllTests = {
  config: {} satisfies configInterface as configInterface,
  time: new Time(WEEK_START_DAY.SUNDAY, 'en-US'),
}

export const whenIsVisible = (closeOnClickOutside = true) => {
  const wrapper = shallowMount(EventFlyout, {
    props: {
      ...propsForAllTests,
      calendarEventProp: eventWithTitle('Foo'),
      config: {
        ...propsForAllTests.config,
        eventDialog: {
          ...propsForAllTests.config.eventDialog,
          closeOnClickOutside,
        },
      },
    },
    attachTo: document.body,
  })
  const closeFlyoutSpy = vi.spyOn(wrapper.vm, 'closeFlyout')
  const eventFlyoutElement = document.createElement('div')
  eventFlyoutElement.classList.add('event-flyout')
  const elementOutsideFlyout = document.createElement('div')
  expect(closeFlyoutSpy).not.toHaveBeenCalled()
  wrapper.setData({ isVisible: true })

  return {
    wrapper,
    closeFlyoutSpy,
    elementOutsideFlyout,
  }
}
