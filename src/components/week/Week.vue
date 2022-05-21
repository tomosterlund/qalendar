<template>
	<WeekTimeline :days="days" :time="time" />
	<section class="calendar-week">

		<div class="calendar-week__events">
			<DayTimeline :day-boundaries="dayBoundaries"
						 :time="time"
						 :key="period.start + period.end + mode" />

			<EventFlyout :calendar-event-prop="selectedEvent"
						 :event-element-dom-rect="selectedEventDOMRect"
						 :time="time"
						 @hide="selectedEvent = null"
						 @edit-event="$emit('edit-event', $event)"
						 @delete-event="$emit('edit-event', $event)" />

			<Day v-for="day in days"
				 :key="day.dateTimeString + mode"
				 :day="day"
				 :day-boundaries="dayBoundaries"
				 :time="time"
				 @event-was-clicked="handleClickOnEvent"
				 @event-was-resized="$emit('event-was-resized', $event)" />
		</div>
	</section>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import { configInterface } from "../../typings/config.interface";
import DayTimeline from "./DayTimeline.vue";
import {periodInterface} from "../../typings/interfaces/period.interface";
import { dayInterface } from "../../typings/interfaces/day.interface";
import WeekTimeline from "./WeekTimeline.vue";
import Day from "./Day.vue";
import {dayBoundaries} from "../../typings/types";
import EventFlyout from "../partials/EventFlyout.vue";
import {eventInterface} from "../../typings/interfaces/event.interface";
import Time from "../../helpers/Time";

export default defineComponent({
	name: 'Week',

	components: {Day, WeekTimeline, DayTimeline, EventFlyout},

	props: {
		config: {
			type: Object as PropType<configInterface>,
			default: () => ({}),
		},
		events: {
			type: Array as PropType<eventInterface[]>,
			default: () => ([]),
		},
		period: {
			type: Object as PropType<periodInterface>,
			required: true
		},
		dayBoundaries: {
			type: Object as PropType<dayBoundaries>,
			required: true,
		},
		nDays: {
			type: Number as PropType<5 | 7>,
			default: 5,
		},
		modeProp: {
			type: String as PropType<'day' | 'week' | 'month'>,
			default: 'week',
		},
		time: {
			type: Object as PropType<Time>,
			required: true,
		},
	},

	emits: [
		'event-was-clicked',
		'event-was-resized',
		'edit-event',
		'delete-event',
	],

	data() {
		return {
			days: [] as dayInterface[],
			mode: this.modeProp as 'day' | 'week' |'month',
			selectedEvent: null as eventInterface | null,
			selectedEventDOMRect: {},
		}
	},

	methods: {
		setDays() {
			const days = []

			const week = this.time.getCalendarWeekDateObjects(this.period.start)

			for (const day of week) {
				days.push({
					dayName: this.time.getLocalizedNameOfWeekday(day, 'long'),
					dateTimeString: this.time.getDateTimeStringFromDate(day, 'start'),
					events: [] as eventInterface[],
				})
			}

			for (const calendarEvent of this.events) {
				const eventIsInPeriod = calendarEvent.time.start > this.time.getDateTimeStringFromDate(this.period?.start, 'start')
					&& calendarEvent.time.start < this.time.getDateTimeStringFromDate(this.period.end, 'end')
				if ( ! eventIsInPeriod) continue

				for (const [dayIndex, day] of days.entries()) {
					const dayDate = day.dateTimeString.substring(0, 11)
					const eventDate = calendarEvent.time.start.substring(0, 11)

					if (dayDate === eventDate) days[dayIndex].events.push(calendarEvent)
				}
			}

			if (this.nDays === 5) days.splice(5, 2)

			this.days = days
		},

		setDay() {
			console.log('setDay')
			// Since we will still iterate over this.days for showing a single day, we'll initialize an array here too
			const days = [{
				dayName: new Date(this.period.selectedDate).toLocaleDateString((<any>window)?.qalendar?.locale || navigator.language, { weekday: 'long' }),
				dateTimeString: this.time.getDateTimeStringFromDate(this.period.selectedDate, 'start'),
				events: [] as eventInterface[],
			}]

			for (const calendarEvent of this.events) {
				const eventIsInPeriod =
					calendarEvent.time.start.substring(0, 10) === this.time.getDateTimeStringFromDate(this.period.selectedDate).substring(0, 10)
				if ( ! eventIsInPeriod) continue

				for (const [dayIndex, day] of days.entries()) {
					const dayDate = day.dateTimeString.substring(0, 11)
					const eventDate = calendarEvent.time.start.substring(0, 11)

					if (dayDate === eventDate) days[dayIndex].events.push(calendarEvent)
				}
			}

			this.days = days
		},

		setInitialEvents(mode: 'day' | 'week' | 'month') {
			if (mode === 'day') this.setDay()
			if (mode === 'week') this.setDays()
		},

		handleClickOnEvent(event: { eventElement: HTMLDivElement, clickedEvent: eventInterface }) {
			this.$emit('event-was-clicked', event)

			this.selectedEventDOMRect = event.eventElement.getBoundingClientRect()
			this.selectedEvent = event.clickedEvent
		},
	},

	mounted() {
		this.setInitialEvents(this.modeProp)
	},

	watch: {
		period: {
			deep: true,
			handler() {
				this.setInitialEvents(this.mode)
			}
		},
		modeProp: {
			deep: true,
			handler(value) {
				this.mode = value
				this.setInitialEvents(value)
			}
		}
	}
})
</script>

<style scoped lang="scss">

.calendar-week {
	width: 100%;
	flex: 1 1 auto;

	&__events {
		position: relative;
		display: flex;
		width: 100%;
		height: 100%;
	}
}
</style>
