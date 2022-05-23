import {mount} from "@vue/test-utils";
import {describe, test, expect} from "vitest";
import Day from '../../../../src/components/month/Day.vue'
import Time from '../../../../src/helpers/Time'

describe('Day.vue', () => {
	let wrapper = mount(Day, {
		props: {
			time: new Time('sunday', 'en-US'),
			config: {},
			day: {
				events: [
					{ title: 'Foo', time: { start: '2022-05-22 00:00', end: '2022-05-22 01:00' }, id: '1' },
					{ title: 'Bar', time: { start: '2022-05-22 00:00', end: '2022-05-22 01:00' }, id: '2' },
					{ title: 'Baz', time: { start: '2022-05-22 01:00', end: '2022-05-22 02:00' }, id: '3' },
				],
				dayName: 'Monday',
				dateTimeString: '2022-05-23 16:38'
			}
		}
	})

	test('Displaying all events passed as props', () => {
		const dayEvents = wrapper.findAll('.calendar-month__event')
		expect(dayEvents).toHaveLength(3)
	})

	test('Displaying the date of the day', () => {
		const dateDisplay = wrapper.find('.calendar-month__day-date')
		expect(dateDisplay.text()).toBe('23')
	})
})