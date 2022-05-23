// .vitepress/theme/index.js
import Layout from './Layout.vue'
import Qalendar from '../../src/Qalendar';

export default {
	Layout,
	// NotFound: () => 'custom 404', // <- this is a Vue 3 functional component
	enhanceApp({ app, router, siteData }) {
		// app is the Vue 3 app instance from `createApp()`. router is VitePress'
		// custom router. `siteData` is a `ref` of current site-level metadata.
		// app.component('Qalendar', Qalendar)
	}
}