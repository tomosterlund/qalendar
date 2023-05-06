type elementDimensions = { height: number; width: number };
import type { DOMRect } from "../typings/types";
const calendarDomRectForVitest = {
  x: 8,
  y: 26,
  width: 903,
  height: 702,
  top: 26,
  right: 911,
  bottom: 728,
  left: 8,
}

export const EVENT_FLYOUT_WIDTH = 400;

export default class EventFlyoutPosition {
  calculateFlyoutPosition(
    eventElementDOMRect: DOMRect,
    flyoutDimensions: elementDimensions,
    calendarDomRectParam: DOMRect | null = null
  ): { top: number | null; left: number | null } | undefined {
    const calendarDomRect = calendarDomRectParam || calendarDomRectForVitest;

    // The four variables below, contain the space in pixels, from the event to the calendar border
    // i.e. spaceTop === length from event top border, to calendar top border
    // and spaceRight === length from event right border to calendar right border
    const spaceTop = eventElementDOMRect.top - calendarDomRect.top;
    const spaceRight = calendarDomRect.right - eventElementDOMRect.right;
    const spaceBottom = calendarDomRect.bottom - eventElementDOMRect.bottom;
    const spaceLeft = eventElementDOMRect.left - calendarDomRect.left;

    const flyoutNeededWidth = flyoutDimensions.width + 10;

    // Set 'top' for events whose bottom is outside the viewport
    const topWhenSpaceToBottomIsNegative =
      spaceBottom < 0
        ? calendarDomRect.bottom - flyoutDimensions.height - 10
        : null;

    const topWhenSpaceTopIsNegative =
      spaceTop < 0 ? calendarDomRect.top + 10 : null;

    // Position flyout to the right of event, facing downwards, when possible
    if (
      spaceBottom > flyoutDimensions.height &&
      spaceRight > flyoutNeededWidth
    ) {
      return {
        top: topWhenSpaceTopIsNegative
          ? topWhenSpaceTopIsNegative
          : Math.round(eventElementDOMRect.top),
        left: Math.round(eventElementDOMRect.right) + 10,
      };
    }

    // Position flyout to the right of event, facing upwards, when too close to the bottom
    if (spaceTop > flyoutDimensions.height && spaceRight > flyoutNeededWidth) {
      return {
        top: topWhenSpaceToBottomIsNegative
          ? topWhenSpaceToBottomIsNegative
          : Math.round(eventElementDOMRect.bottom) - flyoutDimensions.height,
        left: Math.round(eventElementDOMRect.right) + 10,
      };
    }

    // Position flyout left of event, facing downwards, when possible
    if (
      spaceLeft > flyoutNeededWidth &&
      spaceBottom > flyoutDimensions.height
    ) {
      return {
        top: topWhenSpaceTopIsNegative
          ? topWhenSpaceTopIsNegative
          : eventElementDOMRect.top,
        left: Math.round(
          eventElementDOMRect.left - (flyoutDimensions.width + 10)
        ),
      };
    }

    // Position flyout left of event, facing upwards when possible
    if (spaceLeft > flyoutNeededWidth && spaceTop > flyoutDimensions.height) {
      return {
        top: topWhenSpaceToBottomIsNegative
          ? topWhenSpaceToBottomIsNegative
          : Math.round(eventElementDOMRect.bottom - flyoutDimensions.height),
        left: Math.round(
          eventElementDOMRect.left - (flyoutDimensions.width + 10)
        ),
      };
    }

    // Fallback for smaller screens - scenario 1
    // Flyout is glued to the bottom of the calendar and horizontally centered
    if (spaceBottom < flyoutDimensions.height) {
      return { top: calendarDomRect.bottom - flyoutDimensions.height, left: null };
    }

    // Fallback for smaller screens - scenario 2
    // Flyout is placed vertically based on the top of the event, and centered horizontally
    return { top: eventElementDOMRect.top, left: null };
  }
}
