import {registerComponentsPlugin} from '@vuepress/plugin-register-components';
import path from 'path';

export default defineClientConfig({
	enhance({ app, router, siteData }) {},
	setup() {},
	rootComponents: [],
	plugins: [
		registerComponentsPlugin({
			components: {
				Qalendar: path.resolve(__dirname, '../../src/Qalendar.vue')
			},
		}),
	],
})