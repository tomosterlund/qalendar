import {describe, expect, test} from "vitest";
import {mount} from "@vue/test-utils";
import Time from "../../../src/helpers/Time";
import DatePicker from '../../../src/components/header/DatePicker.vue'

describe('DatePicker.vue', () => {
	let wrapper

	test.todo('viewing the selected dates', () => {
		wrapper = mount(DatePicker, {
			props: { time: new Time('monday', 'en-US') },
		})
		const selectedDates = wrapper.find('.date-picker__value-display')
		expect(selectedDates.text()).toBeDefined()
	})
})