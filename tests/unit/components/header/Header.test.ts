import { mount } from '@vue/test-utils'
import Header from '../../../../src/components/header/Header.vue'
import {describe, expect, test} from "vitest";
import Time from "../../../../src/helpers/Time";

describe('Header.vue', () => {
	let wrapper

	test('viewing the month(s) name', () => {
		wrapper = mount(Header, {
			props: {
				time: new Time('monday', 'en-US')
			},
		})

		const monthName = wrapper.find('.calendar-header__period-name')
		expect(monthName.text()).toBeDefined()
	})
})
