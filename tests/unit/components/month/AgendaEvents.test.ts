import { describe, it, expect } from "vitest";
import AgendaEvents from "../../../../src/components/month/AgendaEvents.vue";
import { mountComponent } from "../../../vitest-setup";
import { shallowMount } from "@vue/test-utils";
import Time from "../../../../src/helpers/Time";
import { dayMonday } from "../../../utils/entities/days";
const agendaEvents = mountComponent(shallowMount, AgendaEvents)

const defaultComponentOptions = {
  props: {
    config: {},
    time: new Time(),
    day: dayMonday,
  }
};
describe('AgendaEvents', () => {

  it('should pass custom event "event-was-clicked" from child event to parent component', () => {
    const underTest = agendaEvents(defaultComponentOptions);
    const agendaEventTileChildComponent = underTest.findComponent({ name: 'AgendaEventTile' });
    agendaEventTileChildComponent.vm.$emit('event-was-clicked');
    expect(underTest.emitted('event-was-clicked')).toBeTruthy();
  });

  it('should display the name of the day', () => {
    const underTest = agendaEvents(defaultComponentOptions);
    const text = underTest.find('.agenda__header-day-name').text();
    expect(text).toContain('Monday');
  });

  it('should display the date 01', () => {
    const underTest = agendaEvents(defaultComponentOptions);
    const date = underTest.find('.agenda__header-date').text();
    expect(date).toContain('01');
  });

  it('should display the element for displaying events, if day.events length is > 0', () => {
    const underTest = agendaEvents(defaultComponentOptions);
    const agendaContentEventsList = underTest.find('.agenda__content-events-list');
    expect(agendaContentEventsList.exists()).toBeTruthy();
  });

  it('should not display the element for displaying events, if day.events length is 0', () => {
    const componentOptions = JSON.parse(JSON.stringify(defaultComponentOptions));
    componentOptions.props.day.events = [];
    const underTest = agendaEvents(componentOptions);
    const agendaContentEventsList = underTest.find('.agenda__content-events-list');
    expect(agendaContentEventsList.exists()).toBeFalsy();
  });

  it('should display the text "No events" for a day with no events', () => {
    const componentOptions = JSON.parse(JSON.stringify(defaultComponentOptions));
    componentOptions.props.day.events = [];
    const underTest = agendaEvents(componentOptions);
    const text = underTest.find('.is-empty').text();
    expect(text).toContain('No events');
  });

  it('should not find element with class "is-empty" for a day with events', () => {
    const underTest = agendaEvents(defaultComponentOptions);
    const isEmpty = underTest.find('.is-empty');
    expect(isEmpty.exists()).toBeFalsy();
  });
});
