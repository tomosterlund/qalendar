import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import DatePickerView from "./DatePickerView.vue";
import QalendarView from "./QalendarView.vue";

const routes = [
	{ path: '/', component: QalendarView },
	{ path: '/date-picker', component: DatePickerView },
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
