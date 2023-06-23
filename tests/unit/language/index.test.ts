import { describe, expect, it } from "vitest";
import languageMixin, { localeMap } from '../../../src/language/index'
import { languageKeys } from "../../../src/language/keys";

describe('language mixin', () => {
  const localeList = Array.from(localeMap)


  it.each(localeList)(
    'should enter %s short locale and get %s long locale back', (shortLocale, longLocale) => {
    const underTest = languageMixin.methods.overrideShortLocaleWithLongLocale;
    const actual = underTest(shortLocale);
    expect(actual).toBe(longLocale);
  })

  it('should return the swedish translation of week', () => {
    const actual = languageMixin.methods.getLanguage(languageKeys['week'], 'sv');
    expect(actual).toBe('Vecka');
  })

  it('should return the default translation when the locale is not found', () => {
    const actual = languageMixin.methods.getLanguage(languageKeys['week'], 'xx');
    expect(actual).toBe('Week');
  });
})
