import { languageKeys } from './keys';

export default {
  data() {
    return {
      languageKeys,
    };
  },

  methods: {
    getLanguage(languageKeys: any, locale: string) {
      if (locale.startsWith('de')) locale = 'de-DE';
      if (locale.startsWith('en')) locale = 'en-US';
      if (locale.startsWith('it')) locale = 'it-IT';
      if (locale.startsWith('sv')) locale = 'sv-SE';
      if (locale.startsWith('zh')) locale = 'zh-CN';
      if (locale.startsWith('pt')) locale = 'pt-BR';
      if (locale.startsWith('fr')) locale = 'fr-FR';
      if (locale.startsWith('th')) locale = 'th-TH';
      if (locale.startsWith('nl')) locale = 'nl-NL';
      if (locale.startsWith('ru')) locale = 'ru-RU';
      if (locale.startsWith('ar')) locale = 'ar-YE';
      if (locale.startsWith('es')) locale = 'es-ES';

      return languageKeys[locale]
        ? languageKeys[locale]
        : languageKeys['en-US'] || '';
    },
  },
};
