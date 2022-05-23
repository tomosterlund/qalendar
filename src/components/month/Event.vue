<template>
	<div class="calendar-month__event">
		<span class="calendar-month__event-title">
			{{ calendarEvent.title }}
		</span>

		<span class="calendar-month__event-time">
			{{ eventTime }}
		</span>
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import Time from "../../helpers/Time";
import {eventInterface} from "../../typings/interfaces/event.interface";

export default defineComponent({
	name: 'Event',

	props: {
		time: {
			type: Object as PropType<Time>,
			required: true
		},
		calendarEvent: {
			type: Object as PropType<eventInterface>,
			required: true,
		},
	},

	computed: {
		eventTime() {
			return this.time.getLocalizedTime(this.calendarEvent.time.start)
				+ ' - '
				+ this.time.getLocalizedTime(this.calendarEvent.time.end)
		},
	}
})
</script>

<style lang="scss" scoped>

</style>
