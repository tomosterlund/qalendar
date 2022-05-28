<template>
	<div class="calendar-month__weekday">
		<span v-if="isFirstWeek" class="calendar-month__day-name">
			{{ day.dayName }}
		</span>

		<span class="calendar-month__day-date">
			{{ day.dateTimeString.substring(8, 10) }}
		</span>

		<div v-for="(calendarEvent, index) in day.events" class="calendar-month__event-wrapper">
			<Event v-if="index < 3"
				   :key="calendarEvent.id"
				   :calendar-event="calendarEvent"
				   :config="config"
				   :time="time"
				   @event-was-clicked="$emit('event-was-clicked', $event)"/>
		</div>

		<div class="calendar-month__weekday-more" v-if="day.events.length>= 4" @click="switchToWeekMode">
			{{ getLanguage(languageKeys.moreEvents, time.CALENDAR_LOCALE) }}
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent, Prop, PropType} from "vue";
import {configInterface} from "../../typings/config.interface";
import Time from "../../helpers/Time";
import Event from "./Event.vue";
import {dayInterface} from "../../typings/interfaces/day.interface";
import getLanguage from '../../language/index'

export default defineComponent({
	name: 'Day',

	components: {Event},

	mixins: [getLanguage],

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
		},
		isFirstWeek: {
			type: Boolean,
			default: false,
		}
	},

	emits: ['event-was-clicked', 'updated-period'],

	methods: {
		switchToWeekMode() {
			const { date, month, year } = this.time.getAllVariablesFromDateTimeString(this.day.dateTimeString)
			const selectedDate = new Date(year, month, date)
			const week = this.time.getCalendarWeekDateObjects(selectedDate)
			const start = week[0]
			const end = week[6]

			this.$emit('updated-period', { start, end, selectedDate })
		}
	}
})
</script>

<style lang="scss" scoped>
.calendar-month__weekday {
	height: 100%;
	flex: 1;
	display: flex;
	flex-flow: column;
	align-items: center;
	border-right: var(--qalendar-border-gray-thin);
	border-bottom: var(--qalendar-border-gray-thin);
	overflow: hidden;

	&:last-child {
		border-right: 0;
	}

	.calendar-month__week:first-child & {
		border-top: var(--qalendar-border-gray-thin);
	}

	.calendar-month__day-name,
	.calendar-month__day-date {
		font-size: 12px;
		color: var(--qalendar-gray-quite-dark);

		&:first-child {
			margin-top: 6px;
		}
	}

	.calendar-month__event-wrapper {
		width: 100%;
	}

	.calendar-month__weekday-more {
		font-size: 11px;
		width: 100%;
		padding-left: 4px;
		color: var(--qalendar-gray-quite-dark);
		cursor: pointer;
	}
}
</style>
