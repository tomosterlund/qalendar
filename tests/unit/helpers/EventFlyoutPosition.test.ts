import {describe, expect, test} from "vitest";
import EventFlyoutPositionHelper from "../../../src/helpers/EventFlyoutPosition";
const eventFlyoutPositionHelper = new EventFlyoutPositionHelper()

describe('EventFlyoutPositionHelper.ts', () => {
	/**
	 * Yield a position that opens on the right-hand side,
	 * of an event positioned far to the top left of the window
	 * */
	test('Positioning the Flyout relative to an event in the top left', () => {
		const flyoutPosition = eventFlyoutPositionHelper.calculateFlyoutPosition(
			{
				bottom: 369,
				height: 109.5,
				left: 310.203125,
				right: 449.40625,
				top: 259.5,
				width: 139.203125,
				x: 310.203125,
				y: 259.5,
			},
			{ height: 1200, width: 15000 },
			{ height: 300, width: 350 }
		)

		expect(flyoutPosition.top).toEqual(260)
		// expect space to the DOMRect.right + 10 (for having space between event and flyout)
		expect(flyoutPosition.left).toEqual(459)
	})

	test('Positioning the Flyout on a small device, with space to bottom', () => {
		const flyoutPosition = eventFlyoutPositionHelper.calculateFlyoutPosition(
			{
				bottom: 369,
				height: 109.5,
				left: 50,
				right: 400,
				top: 259.5,
				width: 139.203125,
				x: 310.203125,
				y: 259.5,
			},
			{ height: 800, width: 350 },
			{ height: 300, width: 350 }
		)

		expect(flyoutPosition.top).toEqual(260)
		expect(flyoutPosition.left).toEqual(50)
	})

	test('Positioning the Flyout on a small device, without space to bottom', () => {
		const flyoutHeight = 300
		const flyoutRectBottom = 750

		const flyoutPosition = eventFlyoutPositionHelper.calculateFlyoutPosition(
			{
				bottom: flyoutRectBottom,
				height: 200,
				left: 50,
				right: 449.40625,
				top: 600,
				width: 139.203125,
				x: 310.203125,
				y: 259.5,
			},
			{ height: 800, width: 350 },
			{ height: flyoutHeight, width: 350 }
		)

		expect(flyoutPosition.top).toEqual(flyoutRectBottom - flyoutHeight)
		expect(flyoutPosition.left).toEqual(50)
	})

	test('Positioning the flyout for an event close to the bottom of the screen', () => {
		const flyoutPosition = eventFlyoutPositionHelper.calculateFlyoutPosition(
			{
				bottom: 1227,
				height: 80.625,
				left: 173,
				right: 447.203125,
				top: 1146.375,
				width: 274.203125,
				x: 173,
				y: 1146.375,
			},
			{ width: 1720, height: 1247 },
			{ height: 350, width: 350 }
		)

		expect(flyoutPosition.top).toEqual(877)
		expect(flyoutPosition.left).toEqual(457)
	})

	test('Positioning the flyout for an event close to the right border of the screen', () => {
		const flyoutPosition = eventFlyoutPositionHelper.calculateFlyoutPosition(
			{
				bottom: 232.625,
				height: 80.625,
				left: 1273.8125,
				right: 1548.015625,
				top: 152,
				width: 274.203125,
				x: 1273.8125,
				y: 152,
			},
			{width: 1720, height: 1247},
			{height: 116, width: 350}
		)

		expect(flyoutPosition.top).toEqual(152)
		expect(flyoutPosition.left).toEqual(914)
	})

	test('Positioning the flyout for an event close to the right & bottom borders of the screen', () => {
		const flyoutPosition = eventFlyoutPositionHelper.calculateFlyoutPosition(
			{
				bottom: 1227,
				height: 80.625,
				left: 1273.8125,
				right: 1548.015625,
				top: 1146.375,
				width: 274.203125,
				x: 1273.8125,
				y: 1146.375,
			},
			{width: 1720, height: 1247},
			{height: 116, width: 350}
		)

		expect(flyoutPosition.top).toEqual(1227 - 116)
		expect(flyoutPosition.left).toEqual(Math.round(1273.8125 - (350 + 10)))
	})
})