const getLanguage = (languageKeys: any, locale: string) => {
	if (locale.startsWith('de')) locale = 'de-DE'
	if (locale.startsWith('en')) locale = 'en-US'
	if (locale.startsWith('sv')) locale = 'sv-SE'
	if (locale.startsWith('zn')) locale = 'zn-CH'

	return languageKeys[locale] ? languageKeys[locale] : languageKeys['en-US'] || ''
}

export default getLanguage