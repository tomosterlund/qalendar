<template>
	<div class="calendar-root-wrapper">
		<div class="calendar-root">
			<Header :config="config"
					:key="wasInitialized"
					:mode="mode"
					:time="time"
					:selected-date-default="selectedDateDefault"
					:day-boundaries="week.dayBoundaries"
					@updated-period="handleUpdatedPeriod"
					@set-day-start="week.dayBoundaries.start = $event"
					@set-day-end="week.dayBoundaries.end = $event" />

			<Week :events="events"
				  :period="period"
				  :key="period.start.getDate() + period.end.getDate() + week.dayBoundaries.start + week.dayBoundaries.end"
				  :mode-prop="mode"
				  :day-boundaries="week.dayBoundaries"
				  :n-days="week.nDays"
				  :time="time"
				  @event-was-clicked="$emit('event-was-clicked', $event)"
				  @event-was-resized="$emit('event-was-resized', $event)"
				  @edit-event="$emit('edit-event', $event)"
				  @delete-event="$emit('edit-event', $event)" />
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import { eventInterface } from './typings/interfaces/event.interface'
import {configInterface, dayStartOrEnd} from "./typings/config.interface";
import Time from "./helpers/Time";
import Header from "./components/header/Header.vue";
import Week from "./components/week/Week.vue";

export default defineComponent({
	name: 'Qalendar',

	components: {
		Header,
		Week,
	},

	props: {
		config: {
			type: Object as PropType<configInterface>,
			default: () => ({}),
		},
		events: {
			type: Array as PropType<eventInterface[]>,
			default: () => ([]),
		},
		selectedDateDefault: {
			type: Date,
			default: new Date(),
		},
	},

	emits: [
		'event-was-clicked',
		'updated-period',
		'event-was-resized',
		'edit-event',
		'delete-event'
	],

	data() {
		return {
			wasInitialized: 0,
			period: {
				start: new Date(),
				end: new Date(),
				selectedDate: new Date(),
			},
			week: {
				dayBoundaries: {
					start: this.config?.week?.dayBoundaries?.start || 800 as dayStartOrEnd,
					end: this.config?.week?.dayBoundaries?.end || 1800 as dayStartOrEnd,
				},
				nDays: this.config?.week?.nDays || 7,
			},
			mode: 'week' as 'day' | 'week' | 'month',
			time: new Time(
				this.config?.week?.startsOn,
				this.config?.locale || null
			)
		}
	},

	methods: {
		setConfigOnMount() {
			this.wasInitialized = 1
		},

		handleUpdatedPeriod(value: { start: Date, end: Date; selectedDate: Date; }) {
			this.$emit('updated-period', { start: value.start, end: value.end })
			this.period = value
		},

		onCalendarResize() {
			const calendarRoot = document.querySelector('.calendar-root')

			if ( ! calendarRoot) return

			const calendarWidth = calendarRoot.clientWidth
			const dayModeBreakpoint = 700

			if (calendarWidth < dayModeBreakpoint) this.mode = 'day'
			if (calendarWidth > dayModeBreakpoint) this.mode = 'week'
		},
	},

	mounted() {
		this.setConfigOnMount()
		this.onCalendarResize() // Trigger once on mount, in order to set the correct mode, if viewing on a small screen
		window.addEventListener('resize', this.onCalendarResize)
	},

	beforeUnmount() {
		window.removeEventListener('resize', this.onCalendarResize)
	}
})
</script>

<style scoped lang="scss">
@import './styles/variables.scss';

.calendar-root-wrapper {
	width: 100%;
	min-height: 700px;
	max-height: 1400px;

	.calendar-root {
		border: var(--qalendar-border-gray-thin);
		border-radius: var(--qalendar-border-radius);
		font-family: 'Verdana', 'Open Sans';

		position: relative;
		width: calc(100% - 48px);
		margin-left: 48px;
		margin-right: 0;
		max-width: 1400px;
		height: calc(100vh - var(--qalendar-spacing-double));
		display: flex;
		flex-flow: column;
	}
}

</style>
