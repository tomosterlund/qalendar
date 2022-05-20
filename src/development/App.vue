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
						start: 600,
						end: 1800,
					},
					nDays: 5,
				},
				locale: 'de-DE'
			} as configInterface,
			events: [
				{
					id: 'sdfgdfsda-435643-dsfghgd',
					title: 'Biology lab',
					description: 'Read textbook p. 70-72',
					topic: 'Biology',
					with: 'Tom Österlund',
					time: { start: '2022-05-20 09:00', end: '2022-05-20 10:00' },
					color: 'blue',
				},
				{
					id: 'sdfgdfs454da-435643-dsfg4545hgd',
					title: 'Algebra',
					topic: 'Maths',
					with: 'Ingela Sunnqvist',
					time: { start: '2022-05-20 10:15', end: '2022-05-20 11:00' },
					color: 'yellow',
				},
				{
					id: 'sdfgdfsda-435643-dsfghgd',
					title: 'French seminar',
					description: 'Practice vocabulary from p. 124',
					topic: 'French',
					with: 'Tom Österlund',
					time: { start: '2022-05-20 12:00', end: '2022-05-20 13:30' },
					color: 'blue',
				},
				{
					id: 'sdfgdfsda-4343-dsfgh545gd',
					title: 'German seminar',
					description: 'Practice vocabulary from p. 180',
					topic: 'German',
					with: 'Tom Österlund',
					time: {start: '2022-05-20 12:00', end: '2022-05-20 13:30'},
					color: 'green',
				}
			] as eventInterface[],
		}
	},
})
</script>

<style></style>