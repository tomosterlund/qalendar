type elementDimensions = { height: number; width: number }
import { DOMRect } from "../typings/types";

export const EVENT_FLYOUT_WIDTH = 400

export default class EventFlyoutPosition {

	calculateFlyoutPosition(
		eventElementDOMRect: DOMRect,
		windowDimensions: elementDimensions,
		flyoutDimensions: elementDimensions,
	) : { top: number|null, left: number|null } | undefined {
		const calendarRoot = document.querySelector('.calendar-root')
		if ( ! calendarRoot) return

		const calendarWidth = calendarRoot.clientWidth
		const calendarDomRect = calendarRoot.getBoundingClientRect()
		const spaceOnRight = calendarDomRect.width - eventElementDOMRect.right
		const spaceToBottom = calendarDomRect.height - eventElementDOMRect.bottom

		/** Calendar is thin */
		if (calendarWidth < 850) {
			return { top: null, left: null }
		}

		/** Calendar is wide */
		// Set 'top' for events whose bottom is outside the viewport
		const topWhenSpaceToBottomIsNegative = spaceToBottom < 0
				? (windowDimensions.height - flyoutDimensions.height) - 10
				: null

		// Position flyout to the right of event, facing downwards, when possible
		if (
			spaceToBottom > flyoutDimensions.height
			&& spaceOnRight > (flyoutDimensions.width + 10)
		) {
			return {
				top: Math.round(eventElementDOMRect.top),
				left: Math.round(eventElementDOMRect.right) + 10
			}
		}

		// Position flyout to the right of event, facing upwards, when too close to the bottom
		if (
			spaceToBottom < flyoutDimensions.height
			&& spaceOnRight > (flyoutDimensions.width + 10)
		) {
			return {
				top: topWhenSpaceToBottomIsNegative
					? topWhenSpaceToBottomIsNegative
					: Math.round(eventElementDOMRect.bottom) - flyoutDimensions.height,
				left: Math.round(eventElementDOMRect.right) + 10
			}
		}

		if (spaceOnRight < (flyoutDimensions.width + 10)) {
			if (spaceToBottom > flyoutDimensions.height) {
				return {
					top: eventElementDOMRect.top,
					left: Math.round(eventElementDOMRect.left - (flyoutDimensions.width + 10))
				}
			} else {
				return {
					top: topWhenSpaceToBottomIsNegative
						? topWhenSpaceToBottomIsNegative
						: Math.round(eventElementDOMRect.bottom - flyoutDimensions.height),
					left: Math.round(eventElementDOMRect.left - (flyoutDimensions.width + 10))
				}
			}
		}

		return { top: 0, left: 0 }
	}
}