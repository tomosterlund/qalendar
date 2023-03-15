import {describe, it, expect} from "vitest";
import DragAndDrop from "../../../src/helpers/DragAndDrop";
import {DRAG_DIRECTION} from "../../../src/typings/types";

describe("DragAndDrop", () => {
  it("should return true for an event that can be dragged further backwards", () => {
    const draggedEvent = {
      id: 1,
      title: "Event 1",
      time: {
        start: "2025-01-01 01:00",
        end: "2025-01-01 02:00"
      }
    }

    const actual = DragAndDrop.eventCanBeDraggedFurther(
      draggedEvent,
      DRAG_DIRECTION.BACKWARDS,
      '2025-01-01 00:00',
      '2025-01-01 23:59'
    )

    expect(actual).toBe(true);
  });

  it("should return false for an event that cannot be dragged further backwards", () => {
    const draggedEvent = {
      id: 1,
      title: "Event 1",
      time: {
        start: "2025-01-01 00:05",
        end: "2025-01-01 02:00"
      }
    }

    const actual = DragAndDrop.eventCanBeDraggedFurther(
      draggedEvent,
      DRAG_DIRECTION.BACKWARDS,
      '2025-01-01 00:00',
      '2025-01-01 23:59'
    )

    expect(actual).toBe(false);
  });

  it("should return true for an event that can be dragged further backwards, into previous year", () => {
    const draggedEvent = {
      id: 1,
      title: "Event 1",
      time: {
        start: "2025-01-01 00:05",
        end: "2025-01-01 02:00"
      }
    }

    const actual = DragAndDrop.eventCanBeDraggedFurther(
      draggedEvent,
      DRAG_DIRECTION.BACKWARDS,
      '2024-12-31 23:00',
      '2025-01-01 00:00'
    )

    expect(actual).toBe(true);
  });

  it("should return false for an event that cannot be dragged further forwards", () => {
    const draggedEvent = {
      id: 1,
      title: "Event 1",
      time: {
        start: "2025-10-26 22:30",
        end: "2025-10-26 22:57"
      }
    }

    const actual = DragAndDrop.eventCanBeDraggedFurther(
      draggedEvent,
      DRAG_DIRECTION.FORWARDS,
      '2025-10-26 00:00',
      '2025-10-26 23:00'
    );

    expect(actual).toBe(false);
  })

  it("should return true for an event that can be dragged further forwards", () => {
    const draggedEvent = {
      id: 1,
      title: "Event 1",
      time: {
        start: "2025-10-26 22:30",
        end: "2025-10-26 22:57"
      }
    }

    const actual = DragAndDrop.eventCanBeDraggedFurther(
      draggedEvent,
      DRAG_DIRECTION.FORWARDS,
      '2025-10-26 00:00',
      '2025-10-26 23:59'
    );

    expect(actual).toBe(true);
  });

  it("should return true for an event that can be dragged further forwards, into next year", () => {
    const draggedEvent = {
      id: 1,
      title: "Event 1",
      time: {
        start: "2025-12-31 22:30",
        end: "2025-12-31 23:50"
      }
    }

    const actual = DragAndDrop.eventCanBeDraggedFurther(
      draggedEvent,
      DRAG_DIRECTION.FORWARDS,
      '2025-12-31 06:00',
      '2026-01-01 01:00'
    );

    expect(actual).toBe(true);
  });
});
