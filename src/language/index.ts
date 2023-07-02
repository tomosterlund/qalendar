import { languageKeys } from './keys';

export const localeMap = new Map<string, string>([
  ['de', 'de-DE'],
  ['en', 'en-US'],
  ['it', 'it-IT'],
  ['sv', 'sv-SE'],
  ['zh', 'zh-CN'],
  ['pt', 'pt-BR'],
  ['fr', 'fr-FR'],
  ['th', 'th-TH'],
  ['nl', 'nl-NL'],
  ['ru', 'ru-RU'],
  ['ar', 'ar-YE'],
  ['es', 'es-ES'],
  ['ja', 'ja-JP'],
]);

export default {
  data() {
    return {
      languageKeys,
    };
  },

  methods: {
    getLanguage(languageKeys: any, locale: string) {
      locale = this.overrideShortLocaleWithLongLocale(locale);

      return languageKeys[locale]
        ? languageKeys[locale]
        : languageKeys['en-US'];
    },

    overrideShortLocaleWithLongLocale(locale: string): string {
      if (localeMap.has(locale)) {
        locale = localeMap.get(locale) as string;
      }

      return locale;
    }
  },
};
