import { describe, it, expect } from "vitest";
import { languageKeys } from "../../../src/language/keys";

const languages = Object.keys(languageKeys.week);

describe("languageKeys", () => {
  it('should have all translations from "week" for "month"', () => {
    languages.forEach((language) => {
      expect(languageKeys.month[language]).toBeDefined();
    });
  });

  it('should have all translations from "week" for "day"', () => {
    languages.forEach((language) => {
      expect(languageKeys.day[language]).toBeDefined();
    });
  });

  it('should have all translations from "week" for "moreEvents"', () => {
    languages.forEach((language) => {
      expect(languageKeys.moreEvents[language]).toBeDefined();
    });
  });

  it('should have all translations from "week" for "noEvent"', () => {
    languages.forEach((language) => {
      expect(languageKeys.noEvent[language]).toBeDefined();
    });
  });
});
