import { mount } from '@vue/test-utils'
import Header from '../../../../src/components/header/Header.vue'
import {describe, expect, test} from "vitest";
import Time from "../../../../src/helpers/Time";

describe('Header.vue', () => {
	let wrapper = mount(Header, {
		props: {
			time: new Time('monday', 'en-US'),
			period: {
				selectedDate: new Date(),
				start: new Date(),
				end: new Date(),
			}
		},
	})

	test('viewing the month(s) name', () => {
		const monthName = wrapper.find('.calendar-header__period-name')
		expect(monthName.text()).toBeDefined()
	})

	test('Emitting event for changing to month mode',  () => {
		wrapper.find('.is-month-mode').trigger('click')
		const changeModeEvent = wrapper.emitted('change-mode')

		if ( ! changeModeEvent) throw new Error('no event')
		expect(changeModeEvent[0]).toEqual(['month'])
	})

	test('Emitting event for changing to day mode',  () => {
		wrapper = mount(Header, {
			props: {
				time: new Time('monday', 'en-US'),
				period: {
					selectedDate: new Date(),
					start: new Date(),
					end: new Date(),
				}
			},
		})
		wrapper.find('.is-day-mode').trigger('click')
		const changeModeEvent = wrapper.emitted('change-mode')

		if ( ! changeModeEvent) throw new Error('no event')
		expect(changeModeEvent[0]).toEqual(['day'])
	})

	test('Emitting event for changing to week mode',  () => {
		wrapper = mount(Header, {
			props: {
				time: new Time('monday', 'en-US'),
				period: {
					selectedDate: new Date(),
					start: new Date(),
					end: new Date(),
				}
			},
		})
		wrapper.find('.is-week-mode').trigger('click')
		const changeModeEvent = wrapper.emitted('change-mode')

		if ( ! changeModeEvent) throw new Error('no event')
		expect(changeModeEvent[0]).toEqual(['week'])
	})
})
