export default class Helpers {
	static getBrowserNavigatorLocale(): string {
		if (typeof navigator !== 'object') return 'en-US'

		return (navigator.languages && navigator.languages.length)
			? navigator.languages[0]
			: navigator.language
	}
}