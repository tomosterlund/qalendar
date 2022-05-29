<template>
	<div class="calendar-month">
		<div class="calendar-month__timeline"></div>

		<div class="calendar-month__weeks">
			<div v-for="(week, weekIndex) in month"
				 :key="weekIndex"
				 class="calendar-month__week">
				<Day v-for="(day, dayIndex) in week"
					 :is-first-week="weekIndex === 0"
					 :config="config"
					 :key="dayIndex"
					 :day="day"
					 :time="time"
					 @event-was-clicked="handleClickOnEvent"
					 @updated-period="$emit('updated-period', $event)" />
			</div>
		</div>

		<EventFlyout :calendar-event-prop="selectedEvent"
					 :event-element="selectedEventElement"
					 :time="time"
					 :config="config"
					 @hide="selectedEvent = null"
					 @edit-event="$emit('edit-event', $event)"
					 @delete-event="$emit('edit-event', $event)" />
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import Day from "./Day.vue";
import Time from "../../helpers/Time";
import {periodInterface} from "../../typings/interfaces/period.interface";
import {configInterface} from "../../typings/config.interface";
import {eventInterface} from "../../typings/interfaces/event.interface";
import EDate from "../../helpers/EDate";
import {dayInterface} from "../../typings/interfaces/day.interface";
import EventFlyout from "../partials/EventFlyout.vue";

export default defineComponent({
	name: 'Month',

	components: {
		Day,
		EventFlyout,
	},

	props: {
		config: {
			type: Object as PropType<configInterface>,
			required: true,
		},
		time: {
			type: Object as PropType<Time>,
			required: true
		},
		period: {
			type: Object as PropType<periodInterface>,
			required: true
		},
		events: {
			type: Array as PropType<eventInterface[]>,
			default: () => ([]),
		},
	},

	emits: ['edit-event', 'delete-event', 'event-was-clicked', 'updated-period'],

	data() {
		return {
			month: [] as dayInterface[][],
			selectedEvent: null as eventInterface | null,
			selectedEventElement: null as any | null,
		}
	},

	methods: {
		setMonth() {
			const { month, fullYear } = new EDate(this.period.selectedDate)
			const calendarMonth = this.time.getCalendarMonthSplitInWeeks(fullYear, month)

			this.month = calendarMonth.map(week => {
				return week.map(day => {
					const dateTimeString = this.time.getDateTimeStringFromDate(day)
					const events = this.events.filter(event => {
						return event.time.start.substring(0, 11) === dateTimeString.substring(0, 11)
					})

					return {
						dayName: this.time.getLocalizedNameOfWeekday(day),
						dateTimeString: this.time.getDateTimeStringFromDate(day),
						events: events
					}
				})
			})
		},

		handleClickOnEvent(event: { eventElement: HTMLDivElement, clickedEvent: eventInterface }) {
			this.$emit('event-was-clicked', event)

			this.selectedEventElement = event.eventElement
			this.selectedEvent = event.clickedEvent
		},
	},

	mounted() {
		this.setMonth()
	},
})
</script>

<style lang="scss" scoped>

.calendar-month {
	height: 100%;
	width: 100%;

	.calendar-month__weeks {
		height: 100%;
		display: flex;
		flex-flow: column;
		justify-content: space-between;
	}

	.calendar-month__week {
		display: flex;
		flex: 1;
	}
}
</style>