import { mount } from '@vue/test-utils'
import Header from '../../../src/components/header/Header.vue'
import {describe, test} from "vitest";
import Time from "../../../src/helpers/Time";

describe('Header.vue', () => {
	let wrapper

	test('mounting the header', () => {
		wrapper = mount(Header, {
			props: {
				dayBoundaries: {
					start: 0,
					end: 2400
				},
				time: new Time('monday', 'en-US')
			},
		})
	})
})
