import {Comment, Slot, Text, VNode} from 'vue';

export default class Helpers {
  /**
   * If navigator.languages is present (correlating to the browser's Accept-Language header), then use it
   * otherwise just use navigator.language
   * */
  static getBrowserNavigatorLocale(): string {
    if (typeof navigator !== "object") return "en-US";

    return navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language;
  }

  /**
   * Solution from https://github.com/vuejs/core/issues/4733#issuecomment-1024816095
   * */
  static hasSlotContent(slot: Slot|undefined) {
    if (!slot) return false;

    return slot().some((vnode: VNode) => {
      if (vnode.type === Comment) return false;

      if (Array.isArray(vnode.children) && !vnode.children.length) return false;

      return (
        vnode.type !== Text
        || (typeof vnode.children === 'string' && vnode.children.trim() !== '')
      );
    });
  }

  static isUIEventTouchEvent(event: UIEvent): boolean {
    return 'touches' in event && typeof event.touches === 'object';
  }
}
