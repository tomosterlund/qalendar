<template>
	<header>
		Timezone offset: {{ new Date().getTimezoneOffset() }}
	</header>
	<main>
		<Qalendar :selected-date-default="new Date()"
				  :config="config"
				  :events="events" />
	</main>
</template>

<script lang="ts">
import Qalendar from "../Qalendar.vue";
import {defineComponent} from "vue";
import {configInterface} from "../typings/config.interface";
import {eventInterface} from "../typings/interfaces/event.interface";
import {eventsList} from "./data/manually-created-events";
import {seededEvents} from "./data/seeded-events";

export default defineComponent({
	name: 'App',

	components: {
		Qalendar,
	},

	data() {
		return {
			config: {
				week: {
					startsOn: 'monday',
					dayBoundaries: {
						start: 0,
						end: 2400,
					},
					nDays: 7,
				},
				locale: 'de-DE'
			} as configInterface,
			events: seededEvents as eventInterface[],
		}
	},
})
</script>

<style></style>