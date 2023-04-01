import {describe, it, expect} from "vitest";
import Helpers from "../../../src/helpers/Helpers";

describe('Helpers/isUIEventTouchEvent', () => {
  it('should return true if event is a touch event', () => {
    const event = new TouchEvent('touchstart');
    const isTouchEvent = Helpers.isUIEventTouchEvent(event);
    expect(isTouchEvent).toBe(true);
  })

  it('should return false if event is not a touch event', () => {
    const event = new MouseEvent('click');
    const isTouchEvent = Helpers.isUIEventTouchEvent(event);
    expect(isTouchEvent).toBe(false);
  });
});
