import {mount} from "@vue/test-utils";
import Day from '../../../../src/components/week/Day.vue'
import {describe, expect, test} from "vitest";
import Time from "../../../../src/helpers/Time";

describe('Day.vue', () => {
	let wrapper = mount(Day, {
		props: {
			time: new Time('sunday', 'en-US'),
			day: {
				dayName: 'Sunday',
				dateTimeString: '2022-05-22 00:00',
				events: [
					{ title: 'Foo', time: { start: '2022-05-22 00:00', end: '2022-05-22 01:00' }, id: '1' },
					{ title: 'Bar', time: { start: '2022-05-22 00:00', end: '2022-05-22 01:00' }, id: '2' },
					{ title: 'Baz', time: { start: '2022-05-22 01:00', end: '2022-05-22 02:00' }, id: '3' },
				],
			}
		}
	})

	test('Rendering three events', () => {
		const events = wrapper.findAll('.calendar-week__event')
		expect(events).toHaveLength(3)
	})
})