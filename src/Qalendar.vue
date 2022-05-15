<template>
	<div class="calendar-root-wrapper">
		<div class="calendar-root">
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import { eventInterface } from './typings/interfaces/event.interface'
import {configInterface, dayStartOrEnd} from "./typings/config.interface";
import Time from "./helpers/Time";

export default defineComponent({
	name: 'Qalendar',

	components: {},

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
			type: String,
			default: ''
		}
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
				start: '',
				end: '',
				selectedDate: new Date().toISOString(),
			},
			week: {
				dayBoundaries: {
					start: this.config?.week?.dayBoundaries.start || 0 as dayStartOrEnd,
					end: this.config?.week?.dayBoundaries.end || 2400 as dayStartOrEnd,
				},
				nDays: this.config?.week?.nDays || 7,
			},
			mode: 'week' as 'day' | 'week' | 'month',
			time: new Time(
				this.config?.week?.startsOn,
				this.config?.locale
			)
		}
	},

	methods: {
		setConfigOnMount() {
			this.wasInitialized = 1
		},

		handleUpdatedPeriod(value: { start: string, end: string; selectedDate: string; }) {
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

<style scoped>
/*@import './styles/variables.css';*/

/*.calendar-root-wrapper {*/
/*	width: 100%;*/
/*	min-height: 700px;*/
/*	max-height: 1400px;*/
/*}*/

/*.calendar-root {*/
/*	border: var(--qalendar-border-gray-thin);*/
/*	border-radius: var(--qalendar-border-radius);*/
/*	font-family: 'Verdana', 'Open Sans';*/

/*	position: relative;*/
/*	width: calc(100% - 48px);*/
/*	margin-left: 48px;*/
/*	margin-right: 0;*/
/*	max-width: 1400px;*/
/*	height: calc(100vh - var(--qalendar-spacing-double));*/
/*	display: flex;*/
/*	flex-flow: column;*/
/*}*/

</style>
