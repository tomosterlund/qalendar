type elementDimensions = { height: number; width: number }

import {DOMRect} from "../typings/types";

export default class EventFlyoutPosition {

	calculateFlyoutPosition(
		eventElementDOMRect: DOMRect,
		windowDimensions: elementDimensions,
		flyoutDimensions: elementDimensions,
	) : { top: number, left: number } {
		const spaceOnRight = windowDimensions.width - eventElementDOMRect.right
		const spaceToBottom = windowDimensions.height - eventElementDOMRect.bottom

		/** Small screens */
		if (windowDimensions.width < 972) {
			if (spaceToBottom > flyoutDimensions.height) return {
				top: Math.round(eventElementDOMRect.top),
				left: Math.round(eventElementDOMRect.left)
			}

			return {
				top: Math.round(eventElementDOMRect.bottom - flyoutDimensions.height),
				left: Math.round(eventElementDOMRect.left)
			}
		}

		/** Larger screens */

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
				top: Math.round(eventElementDOMRect.bottom) - flyoutDimensions.height,
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
					top: Math.round(eventElementDOMRect.bottom - flyoutDimensions.height),
					left: Math.round(eventElementDOMRect.left - (flyoutDimensions.width + 10))
				}
			}
		}

		return { top: 0, left: 0 }
	}
}