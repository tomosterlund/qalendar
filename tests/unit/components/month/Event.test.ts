import {mount} from "@vue/test-utils";
import {describe, test, expect} from "vitest";
import Event from '../../../../src/components/month/Event.vue'
import Time from '../../../../src/helpers/Time'

describe('Event.vue', () => {
	let wrapper = mount(Event, {
		props: {
			time: new Time('sunday', 'en-US'),
			calendarEvent: { title: 'Foo', time: { start: '2022-05-22 00:00', end: '2022-05-22 01:00' }, id: '1' },
		}
	})

	test('Displaying the event title', () => {
		const title = wrapper.find('.calendar-month__event-title')
		expect(title.text()).toBe('Foo')
	})

	test('Displaying the time', () => {
		const time = wrapper.find('.calendar-month__event-time')
		expect(time.text()).toBe('12:00 AM')
	})
})