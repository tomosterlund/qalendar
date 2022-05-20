import { mount } from '@vue/test-utils'
import {beforeEach, describe, expect, test} from "vitest";
import DayBoundaries from '../../../src/components/header/DayBoundaries.vue'
import Time from "../../../src/helpers/Time";

describe('DayBoundaries.vue', () => {
	let wrapper = mount(DayBoundaries, {
		props: {
			boundaries: {
				start: 400,
				end: 1600,
			},
			time: new Time('monday', 'de-DE')
		}
	})

	beforeEach(async () => {
		await wrapper.find('.day-boundaries').trigger('click')
	})

	test('mounting the component and rendering all hours', async () => {
		const hours = wrapper.findAll('.day-boundaries__menu-list-item')
		// Expect 50 hours to be shown, 25 in each column
		expect(hours).toHaveLength(50)
	})

	test('emitting a specific day boundary value', async () => {
		const menuListItems = wrapper.findAll('.day-boundaries__menu-list-item')
		// Set day start to 12 AM (0)
		await menuListItems[0].trigger('click')
		expect(wrapper.emitted()).toHaveProperty('set-day-start')
		expect(wrapper.emitted()['set-day-start'][0]).toEqual([0])

		// Set day end to 10 PM (2200)
		await menuListItems[menuListItems.length - 3].trigger('click')
		expect(wrapper.emitted()).toHaveProperty('set-day-end')
		expect(wrapper.emitted()['set-day-end'][0]).toEqual([2200])
	})
})