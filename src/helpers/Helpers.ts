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
}
