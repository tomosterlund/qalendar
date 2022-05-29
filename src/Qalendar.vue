<template>
	<div class="calendar-root-wrapper">
		<div class="calendar-root" :class="{
			'mode-is-day': mode === 'day',
			'mode-is-week': mode === 'week',
			'qalendar-is-small': calendarWidth < 700,
		}">
			<Header :config="config"
					:key="wasInitialized + mode"
					:mode="mode"
					:time="time"
					:selected-date-default="selectedDateDefault"
					:period="period"
					@change-mode="mode = $event"
					@updated-period="handleUpdatedPeriod" />

			<Week v-if="['week', 'day'].includes(mode)"
				  :events="events"
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

			<Month v-if="mode === 'month'"
				   :key="period.start.getTime() + period.end.getTime()"
				   :events="events"
				   :time="time"
				   :config="config"
				   :period="period"
				   @event-was-clicked="$emit('event-was-clicked', $event)"
				   @updated-period="handleUpdatedPeriod($event, true)"
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
import {modeType} from "./typings/types";
import Month from "./components/month/Month.vue";
import Errors from "./helpers/Errors";

export default defineComponent({
	name: 'Qalendar',

	components: {
		Month,
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
		'delete-event',
		'updated-period',
	],

	data() {
		return {
			wasInitialized: 0,
			period: {
				start: new Date(),
				end: new Date(),
				selectedDate: this.selectedDateDefault ? this.selectedDateDefault : new Date(),
			},
			week: {
				nDays: this.config?.week?.nDays || 7,
			},
			mode: this.config?.defaultMode || 'week' as modeType,
			time: new Time(
				this.config?.week?.startsOn,
				this.config?.locale || null
			) as Time|any,
			fontFamily: this.config?.style?.fontFamily || '\'Verdana\', \'Open Sans\', serif',
			calendarWidth: 0,
		}
	},

	methods: {
		setConfigOnMount() {
			this.wasInitialized = 1
		},

		/**
		 * setModeWeek is used as flag, when the user clicks "+ see more" for a day, in the month view
		 * */
		handleUpdatedPeriod(value: { start: Date, end: Date; selectedDate: Date; }, setModeWeek: boolean = false) {
			this.$emit('updated-period', { start: value.start, end: value.end })
			this.period = value

			if (setModeWeek) this.mode = 'week'
		},

		onCalendarResize() {
			const calendarRoot = document.querySelector('.calendar-root')

			if ( ! calendarRoot) return

			this.calendarWidth = calendarRoot.clientWidth
			const dayModeBreakpoint = 700

			if (this.calendarWidth < dayModeBreakpoint) this.mode = 'day'
			if (this.calendarWidth >= dayModeBreakpoint) this.mode = this.config?.defaultMode || 'week'
		},
	},

	watch: {
		events: {
			deep: true,
			handler() {
				// Log potential warnings for events in the console
				this.events.forEach(e => Errors.checkEventProperties(e))
			},
			immediate: true,
		}
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

	.calendar-root {
		border: var(--qalendar-border-gray-thin);
		border-radius: var(--qalendar-border-radius);
		font-family: v-bind(fontFamily);

		position: relative;
		width: 100%;
		margin: 0 auto;
		max-width: 1400px;
		max-height: 700px;
		height: calc(100vh - var(--qalendar-spacing-double));
		display: flex;
		flex-flow: column;
	}
}

</style>
