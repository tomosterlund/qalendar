import {describe, expect, test} from "vitest";
import EventFlyoutPositionHelper from "../../../src/helpers/EventFlyoutPosition";
const eventFlyoutPosition = new EventFlyoutPositionHelper()

describe('EventFlyoutPositionHelper.ts', () => {

	test('Positioning the flyout where spaceRight && spaceBottom is enough', () => {
		const eventDOMRect = { "x": 186.71875,  "y": 155.328125,  "width": 119.71875,  "height": 100,  "top": 155.328125,  "right": 306.4375,  "bottom": 255.328125,  "left": 186.71875}
		const flyoutDimensions = { "height": 171,  "width": 400 }
		const calendarDomRect = { "x": 8, "y": 26, "width": 903, "height": 702, "top": 26, "right": 911, "bottom": 728, "left": 8 }

		const position = eventFlyoutPosition.calculateFlyoutPosition(eventDOMRect, flyoutDimensions, calendarDomRect)

		if ( ! position) throw new Error('No position')

		expect(position.top).toBe(155)
		expect(position.left).toBe(316)
	})

	test('Positioning the flyout where spaceRight && spaceBottom is just about enough', () => {
		const eventDOMRect = { "x": 270.84375, "y": 197, "width": 101.421875, "height": 100, "top": 197, "right": 372.265625, "bottom": 297, "left": 270.84375 }
		const flyoutDimensions = { "height": 262,  "width": 400 }
		const calendarDomRect = { "x": 8, "y": 26, "width": 775, "height": 702, "top": 26, "right": 783, "bottom": 728, "left": 8 }

		const position = eventFlyoutPosition.calculateFlyoutPosition(eventDOMRect, flyoutDimensions, calendarDomRect)

		if ( ! position) throw new Error('No position')

		expect(position.top).toBe(197)
		expect(position.left).toBe(382)
	})

	test('Positioning the flyout where spaceTop && spaceRight is enough', () => {
		const eventDOMRect = { "x": 168.421875, "y": 647, "width": 101.421875, "height": 75, "top": 647, "right": 269.84375, "bottom": 722, "left": 168.421875 }
		const flyoutDimensions = { "height": 148,  "width": 400 }
		const calendarDomRect = { "x": 8, "y": 26, "width": 775, "height": 702, "top": 26, "right": 783, "bottom": 728, "left": 8 }

		const position = eventFlyoutPosition.calculateFlyoutPosition(eventDOMRect, flyoutDimensions, calendarDomRect)

		if ( ! position) throw new Error('No position')

		expect(position.top).toBe(574)
		expect(position.left).toBe(280)
	})

	test('Positioning the flyout where spaceLeft && spaceBottom is enough', () => {
		const eventDOMRect = { "x": 680.53125, "y": 197, "width": 101.421875, "height": 41.65625, "top": 197, "right": 781.953125, "bottom": 238.65625, "left": 680.53125 }
		const flyoutDimensions = { "height": 148,  "width": 400 }
		const calendarDomRect = { "x": 8, "y": 26, "width": 775, "height": 702, "top": 26, "right": 783, "bottom": 728, "left": 8 }

		const position = eventFlyoutPosition.calculateFlyoutPosition(eventDOMRect, flyoutDimensions, calendarDomRect)

		if ( ! position) throw new Error('No position')

		expect(position.top).toBe(197)
		expect(position.left).toBe(271)
	})

	test('Positioning the flyout where spaceLeft && spaceTop is enough', () => {
		const eventDOMRect = { "x": 1197.46875, "y": 551, "width": 187.578125, "height": 75, "top": 551, "right": 1385.046875, "bottom": 626, "left": 1197.46875 }
		const flyoutDimensions = { "height": 206,  "width": 400 }
		const calendarDomRect = { "x": 8, "y": 26, "width": 1378, "height": 702, "top": 26, "right": 1386, "bottom": 728, "left": 8 }

		const position = eventFlyoutPosition.calculateFlyoutPosition(eventDOMRect, flyoutDimensions, calendarDomRect)

		if ( ! position) throw new Error('No position')

		expect(position.top).toBe(420)
		expect(position.left).toBe(787)
	})

	test('Positioning the flyout where spaceRight && spaceBottom is enough, but spaceTop is negative', () => {
		const eventDOMRect = { "x": 505.671875, "y": -188, "width": 127.046875, "height": 414.5, "top": -188, "right": 632.71875, "bottom": 226.5, "left": 505.671875 }
		const flyoutDimensions = { "height": 183,  "width": 400 }
		const calendarDomRect = { "x": 8, "y": 26, "width": 1378, "height": 702, "top": 26, "right": 1386, "bottom": 728, "left": 8 }

		const position = eventFlyoutPosition.calculateFlyoutPosition(eventDOMRect, flyoutDimensions, calendarDomRect)

		if ( ! position) throw new Error('No position')

		expect(position.top).toBe(36)
		expect(position.left).toBe(643)
	})

	test('Positioning the flyout where spaceRight && spaceTop is enough, but spaceBottom is negative', () => {
		const eventDOMRect = { "x": 443.15625, "y": 687, "width": 187.578125, "height": 100, "top": 687, "right": 630.734375, "bottom": 787, "left": 443.15625 }
		const flyoutDimensions = { "height": 206,  "width": 400 }
		const calendarDomRect = { "x": 8, "y": 26, "width": 1378, "height": 702, "top": 26, "right": 1386, "bottom": 728, "left": 8 }

		const position = eventFlyoutPosition.calculateFlyoutPosition(eventDOMRect, flyoutDimensions, calendarDomRect)

		if ( ! position) throw new Error('No position')

		expect(position.top).toBe(512)
		expect(position.left).toBe(641)
	})

	test('Getting null values for small calendar widths, which are then used to position flyout centered over the calendar', () => {
		const eventDOMRect = { "x": 66, "y": 495, "width": 509, "height": 75, "top": 495, "right": 575, "bottom": 570, "left": 66 }
		const flyoutDimensions = { "height": 125,  "width": 400 }
		const calendarDomRect = { "x": 8, "y": 26, "width": 568, "height": 702, "top": 26, "right": 576, "bottom": 728, "left": 8 }

		const position = eventFlyoutPosition.calculateFlyoutPosition(eventDOMRect, flyoutDimensions, calendarDomRect)

		if ( ! position) throw new Error('No position')

		expect(position.top).toBeNull()
		expect(position.left).toBeNull()
	})
})