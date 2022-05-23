<template>
	<div class="calendar-month__weekday">
		<span class="calendar-month__day-date">
			{{ day.dateTimeString.substring(8, 10) }}
		</span>

		<Event v-for="calendarEvent in day.events"
			   :key="calendarEvent.id"
			   :calendar-event="calendarEvent"
			   :time="time"/>
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {configInterface} from "../../typings/config.interface";
import Time from "../../helpers/Time";
import Event from "./Event.vue";
import {dayInterface} from "../../typings/interfaces/day.interface";

export default defineComponent({
	name: 'Day',

	components: {Event},

	props: {
		config: {
			type: Object as PropType<configInterface>,
			required: true,
		},
		time: {
			type: Object as PropType<Time>,
			required: true
		},
		day: {
			type: Object as PropType<dayInterface>,
			required: true,
		}
	}
})
</script>

<style lang="scss" scoped>

</style>
