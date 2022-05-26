<template>
	<header>
		Timezone offset: {{ new Date().getTimezoneOffset() }}
	</header>
	<main>
		<Qalendar :selected-date-default="new Date()"
				  :config="config"
				  :events="events"
				  @event-was-clicked="reactToEvent"
				  @updated-period="reactToEvent"
				  @event-was-resized="reactToEvent"
				  @edit-event="reactToEvent"
				  @delete-event="reactToEvent" />
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
					nDays: 7,
				},
				locale: 'de-DE',
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
			},
			events: seededEvents as eventInterface[],
		}
	},

	methods: {
		reactToEvent(payload: any) {
			console.log(payload)
		}
	}
})
</script>

<style></style>