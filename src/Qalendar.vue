<template>
	<div class="calendar-root-wrapper">
		<div class="calendar-root" :class="{
			'mode-is-day': mode === 'day',
			'mode-is-week': mode === 'week',
			'qalendar-is-small': qalendarIsSmall
		}">
			<Header :config="config"
					:key="wasInitialized"
					:mode="mode"
					:time="time"
					:selected-date-default="selectedDateDefault"
					@updated-period="handleUpdatedPeriod" />

			<Week :events="events"
				  :period="period"
				  :config="config"
				  :key="period.start.getTime() + period.end.getTime()"
				  :mode-prop="mode"
				  :n-days="week.nDays"
				  :time="time"
				  @event-was-clicked="$emit('event-was-clicked', $event)"
				  @event-was-resized="$emit('event-was-resized', $event)"
				  @edit-event="$emit('edit-event', $event)"
				  @delete-event="$emit('delete-event', $event)" />
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
				nDays: this.config?.week?.nDays || 7,
			},
			mode: 'week' as 'day' | 'week' | 'month',
			time: new Time(
				this.config?.week?.startsOn,
				this.config?.locale || null
			) as Time|any,
			fontFamily: this.config?.style?.fontFamily || '\'Verdana\', \'Open Sans\', serif',
			qalendarIsSmall: false,
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

			this.qalendarIsSmall = calendarWidth < 850;

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
		font-family: v-bind(fontFamily);

		position: relative;
		width: 100%;
		margin-right: 0;
		max-width: 1400px;
		max-height: 700px;
		height: calc(100vh - var(--qalendar-spacing-double));
		display: flex;
		flex-flow: column;
	}
}

</style>
