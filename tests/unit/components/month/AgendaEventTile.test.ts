import { describe, it, expect } from "vitest";
import AgendaEventTile from '../../../../src/components/month/AgendaEventTile.vue';
import { mount } from "@vue/test-utils";
import { TimeBuilder } from "../../../../src/helpers/Time";
import { EventBuilder } from "../../../../src/models/Event";
import { mountComponent } from "../../../vitest-setup";
import { EVENT_COLORS } from "../../../../src/constants";

describe('AgendaEventTile', () => {
  const timeInstance = new TimeBuilder().build();
  const config = {}
  const EXPECTED_EVENT_START = '2024-01-01 10:00';
  const EXPECTED_EVENT_END = '2024-01-01 11:00';
  const EXPECTED_EVENT_TITLE = 'Test Event';
  const EXPECTED_EVENT_WITH = 'Test person';
  const EXPECTED_EVENT_LOCATION = 'Test location';
  const event = new EventBuilder({
    start: EXPECTED_EVENT_START, end: EXPECTED_EVENT_END
  })
  .withTitle(EXPECTED_EVENT_TITLE)
  .withWith(EXPECTED_EVENT_WITH)
  .withLocation(EXPECTED_EVENT_LOCATION)
  .build();
  const agendaEventTile = mountComponent(mount, AgendaEventTile)
  const defaultOptions = { props: {
    calendarEvent: event,
    time: timeInstance,
    config,
  }}

  const getComponentWithOnlyTimeAndTitle = () => {
    const event = new EventBuilder({
      start: '2024-01-01', end: '2024-01-01'
    }).build()
    return agendaEventTile({
      props: {
        calendarEvent: event,
        time: timeInstance,
        config,
      }
    });
  }

  it('should display an event title', () => {
    const underTest = agendaEventTile(defaultOptions);
    const eventTitle = underTest.find('.agenda__event-title');
    expect(eventTitle.text()).toBe(EXPECTED_EVENT_TITLE);
  });

  it('should display the event start time', () => {
    const underTest = agendaEventTile(defaultOptions);
    const eventTime = underTest.find('.agenda__event-time');
    const expectedTime = timeInstance.timeStringFrom(EXPECTED_EVENT_START);
    expect(eventTime.text()).toContain(expectedTime);
  });

  it('should display the event end time', () => {
    const underTest = agendaEventTile(defaultOptions);
    const eventTime = underTest.find('.agenda__event-time');
    const expectedTime = timeInstance.timeStringFrom(EXPECTED_EVENT_END);
    expect(eventTime.text()).toContain(expectedTime);
  });

  it('should display no time if the event is a full-day event', () => {
    const fullDayEvent = new EventBuilder({
      start: '2024-01-01', end: '2024-01-01'
    }).build();
    const underTest = agendaEventTile({ props: {
      calendarEvent: fullDayEvent,
      time: timeInstance,
      config,
    }});
    const eventTime = underTest.find('.agenda__event-time');
    expect(eventTime.exists()).toBe(false);
  });

  it('should display the value of the event\'s "with" property', () => {
    const underTest = agendaEventTile(defaultOptions);
    const eventWith = underTest.find('.agenda__event-with');
    expect(eventWith.text()).toContain(EXPECTED_EVENT_WITH);
  });

  it('should display the value of the event\'s "location" property', () => {
    const underTest = agendaEventTile(defaultOptions);
    const eventLocation = underTest.find('.agenda__event-location');
    expect(eventLocation.text()).toContain(EXPECTED_EVENT_LOCATION);
  });

  it('should emit event-was-clicked when clicked', async () => {
    const underTest = agendaEventTile(defaultOptions);
    const eventTile = underTest.find('.agenda__event');
    await eventTile.trigger('click');
    expect(underTest.emitted()).toHaveProperty('event-was-clicked');
  });

  it('should not display a time if the event is a full-day event', () => {
    const underTest = getComponentWithOnlyTimeAndTitle();
    const eventTime = underTest.find('.agenda__event-time');
    expect(eventTime.exists()).toBe(false);
  });

  it('should not display a "with" if the event has no "with" property', () => {
    const underTest = getComponentWithOnlyTimeAndTitle();
    const eventWith = underTest.find('.agenda__event-with');
    expect(eventWith.exists()).toBe(false);
  })

  it('should not display a "location" if the event has no "location" property', () => {
    const underTest = getComponentWithOnlyTimeAndTitle();
    const eventLocation = underTest.find('.agenda__event-location');
    expect(eventLocation.exists()).toBe(false);
  })

  it('should set color to white and background to blue per default', () => {
    const underTest = agendaEventTile(defaultOptions);
    expect(underTest.vm.eventBackgroundColor).toBe(EVENT_COLORS.blue);
    expect(underTest.vm.eventColor).toBe('#fff');
  })

  it('should set background color to purple', () => {
    const options = { ...defaultOptions }
    options.props.calendarEvent = new EventBuilder({
      start: '2024-01-01', end: '2024-01-01'
    })
    .withColor('purple')
    .build()
    const underTest = agendaEventTile(options);
    expect(underTest.vm.eventBackgroundColor).toBe(EVENT_COLORS.purple);
  })

  it('should use a color scheme for setting background color', () => {
    const options = { ...defaultOptions }
    options.props.calendarEvent = new EventBuilder({
      start: '2024-01-01', end: '2024-01-01'
    })
    .withColorScheme('men')
    .build();
    const expectedColor = 'white';
    const expectedBackgroundColor = '#123';
    options.props.config = {
      style: {
        colorSchemes: {
          men: {
            backgroundColor: expectedBackgroundColor,
            color: expectedColor,
          }
        }
      }
    }
    const underTest = agendaEventTile(options);
    expect(underTest.vm.eventBackgroundColor).toBe(expectedBackgroundColor);
    expect(underTest.vm.eventColor).toBe(expectedColor);
  })
});
