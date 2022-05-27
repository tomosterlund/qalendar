<template>
	<div class="app-container" :class="'layout-has-' + layout">
		<DevSidebar v-if="layout === 'sidebar'" />

		<DevHeader v-if="layout === 'header'" />

		<main>
			<Qalendar :key="config.locale + config.week.nDays"
					  :selected-date-default="new Date()"
					  :config="config"
					  :events="events"
					  @event-was-clicked="reactToEvent"
					  @updated-period="reactToEvent"
					  @event-was-resized="reactToEvent"
					  @edit-event="reactToEvent"
					  @delete-event="reactToEvent" />
		</main>

		<DevToolbar @selected-locale="config.locale = $event" @selected-layout="layout = $event" @selected-n-days="config.week.nDays = $event" />
	</div>
</template>

<script lang="ts">
import Qalendar from "../Qalendar.vue";
import {defineComponent} from "vue";
import {configInterface} from "../typings/config.interface";
import {eventInterface} from "../typings/interfaces/event.interface";
import {seededEvents} from "./data/seeded-events";
import DevToolbar from "./components/DevToolbar.vue";
import DevSidebar from "./components/DevSidebar.vue";
import DevHeader from "./components/DevHeader.vue";

export default defineComponent({
	name: 'App',

	components: {
		DevHeader,
		DevSidebar,
		DevToolbar,
		Qalendar,
	},

	data() {
		return {
			config: {
				week: {
					startsOn: 'monday',
					nDays: 7,
				},
				locale: 'en-US',
				style: {
					fontFamily: 'Verdana',
					colorSchemes: {
						meetings: {
							color: '#fff',
							backgroundColor: '#131313',
						},
						ladies: {
							color: '#fff',
							backgroundColor: '#ff4081',
						}
					}
				},
			} as configInterface,
			events: seededEvents as eventInterface[],

			layout: 'none',
		}
	},

	methods: {
		reactToEvent(payload: any) {
			console.log(payload)
		}
	}
})
</script>

<style lang="scss">

.app-container {
	padding: 10px;
}

body {
	margin: 0;
}

.layout-has-sidebar {
	display: flex;

	main {
		width: 100%;
	}
}

.layout-has-header {

	main {
		display: flex;
		justify-content: center;
	}
}

</style>