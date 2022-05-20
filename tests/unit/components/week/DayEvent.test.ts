import {mount} from "@vue/test-utils";
import DayEvent from '../../../../src/components/week/DayEvent.vue'
import {describe, expect, test} from "vitest";
import Time from "../../../../src/helpers/Time";

describe('DayEvent.vue', () => {
	let wrapper = mount(DayEvent, {
		props: {
			eventProp: {
				id: 'sdfgdfsda-435643-dsfghgd',
				title: 'Biology lab',
				description: 'Read textbook p. 70-72',
				topic: 'Biology',
				with: 'Tom Österlund',
				time: { start: '2022-05-20 09:00', end: '2022-05-20 10:00' },
				color: 'blue',
			},
			dayBoundaries: { start: 1200, end: 1600},
			time: new Time('sunday', 'en-US')
		}
	})

	test('Displaying the texts fed as props', () => {
		const titleElement = wrapper.find('.is-title')
		expect(titleElement.text()).toBe('Biology lab')

		const timeElement = wrapper.find('.is-time')
		expect(timeElement.text()).toBe('9:00 AM - 10:00 AM')
	})
})