import {mount} from "@vue/test-utils";
import Qalendar from '../../../src/Qalendar.vue'
import {describe, expect, test} from "vitest";

describe('Qalendar.vue', () => {

  test('Mounting the component with a loading animation', () => {
    const wrapper = mount(Qalendar, {
      props: {
        isLoading: true,
      }
    })

    expect(wrapper.get('.top-bar-loader'))
  })

  test('Mounting the component without a loading animation', () => {
    const wrapper = mount(Qalendar, {})

    expect(() => wrapper.get('.top-bar-loader')).toThrow()
  })
})