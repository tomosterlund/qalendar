<template>
	<div class="calendar-week__event"
		 :class="`${isEditable ? 'is-editable' : 'is-not-editable'}`"
		 :style="{
			 top: getPositionInDay(event.time.start),
		 	 height: getLengthOfEvent(event.time.start, event.time.end),
		 	 left: getLeftRule + '%',
		 	 width: getWidthRule + '%',
		 	 border: getBorderRule,
		 	 color: eventColor,
		 	 backgroundColor: eventBackgroundColor
		 }"
		 @click="handleClickOnEvent"
		 @mouseenter="showResizeElements = isEditable"
		 @mouseleave="showResizeElements = false">
		<div class="calendar-week__event-info-wrapper">
			<div v-if="showResizeElements" class="calendar-week__event-resize calendar-week__event-resize-up"
				 @mousedown="resizeEvent('up')" />

			<div class="calendar-week__event-row is-title">{{ event.title }}</div>

			<div class="calendar-week__event-row is-time">
				<font-awesome-icon :icon="icons.clock" class="calendar-week__event-icon" />
				<span>{{ getEventTime }}</span>
			</div>

			<div class="calendar-week__event-row is-location" v-if="event.location">
				<font-awesome-icon :icon="icons.location" class="calendar-week__event-icon" />
				<span>{{ event.location }}</span>
			</div>

			<div class="calendar-week__event-row is-with" v-if="event.with">
				<font-awesome-icon :icon="icons.user" class="calendar-week__event-icon" />
				<span>{{ event.with }}</span>
			</div>

			<div class="calendar-week__event-row is-description" v-if="event.description">
				<font-awesome-icon :icon="icons.description" class="calendar-week__event-icon" />
				<span>{{ event.description }}</span>
			</div>

			<div v-if="eventIsLongerThan30Minutes"
				 class="calendar-week__event-blend-out"
				 :style="{ backgroundImage: 'linear-gradient(to bottom, transparent, ' + eventBackgroundColor + ')' }" />

			<div v-if="showResizeElements" class="calendar-week__event-resize calendar-week__event-resize-down"
				 @mousedown="resizeEvent('down')" />
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {eventInterface} from "../../typings/interfaces/event.interface";
import EventPosition from "../../helpers/EventPosition";
import {faClock, faComment, faUser, faMapMarkerAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import Time from "../../helpers/Time";
import {configInterface} from "../../typings/config.interface";
import {EVENT_COLORS} from "../../constants";
const eventPositionHelper = new EventPosition()


export default defineComponent({
	name: 'DayEvent',

	components: {
		FontAwesomeIcon,
	},

	props: {
		eventProp: {
			type: Object as PropType<eventInterface>,
			required: true,
		},
		time: {
			type: Object as PropType<Time>,
			required: true,
		},
		config: {
			type: Object as PropType<configInterface>,
			required: true,
		},
	},

	emits: ['event-was-clicked', 'event-was-resized'],

	data() {
		return {
			event: this.eventProp,
			icons: {
				clock: faClock,
				user: faUser,
				description: faComment,
				location: faMapMarkerAlt
			},
			showResizeElements: false,

			// Resizing events
			resizingStartingPoint: undefined,
			resizingStartingPointEndOfTime: this.eventProp.time.end,
			resizingStartingPointStartOfTime: this.eventProp.time.start,
			resizingDirection: '',
			changeInQuarterHoursEventStart: 0,
			changeInQuarterHoursEventEnd: 0,
			isEditable: this.eventProp.isEditable || false,
			colors: EVENT_COLORS as { [key: string]: string },
			eventColor: '#fff',
			eventBackgroundColor: '',
		}
	},

	computed: {
		getEventTime() {
			return this.time.getLocalizedTime(this.event.time.start) + ' - ' + this.time.getLocalizedTime(this.event.time.end)
		},

		timePointsInDay() {
			return this.time.DAY_END
		},

		timePointsInOneMinute() {
			return 100 / 60
		},

		getLeftRule() {
			if ( ! this.event.totalConcurrentEvents || ! this.event.nOfPreviousConcurrentEvents) return 0

			return (this.event.nOfPreviousConcurrentEvents / this.event.totalConcurrentEvents) * 100
		},

		getWidthRule() {
			return 100 - this.getLeftRule
		},

		getBorderRule() {
			if ( ! this.event.nOfPreviousConcurrentEvents) return 'none'

			return '1px solid #fff'
		},

		eventIsLongerThan30Minutes() {
			const { hour: startHour, minutes: startMinutes } = this.time.getAllVariablesFromDateTimeString(this.event.time.start)
			const { hour: endHour, minutes: endMinutes } = this.time.getAllVariablesFromDateTimeString(this.event.time.end)
			const startDateMS = new Date(0, 0, 0, startHour, startMinutes).getTime()
			const endDateMS = new Date(0, 0, 0, endHour, endMinutes).getTime()

			return (endDateMS - startDateMS) >= 1800000
		}
	},

	methods: {
		getPositionInDay(dateTimeString: string) {
			return eventPositionHelper.getPercentageOfDayFromDateTimeString(
				dateTimeString,
				this.time.DAY_START,
				this.time.DAY_END,
			).toString() + '%'
		},

		getLengthOfEvent(start: string, end: string) {
			const startOfEvent = eventPositionHelper.getPercentageOfDayFromDateTimeString(start, this.time.DAY_START, this.time.DAY_END)
			const endOfEvent = eventPositionHelper.getPercentageOfDayFromDateTimeString(end, this.time.DAY_START, this.time.DAY_END)
			const length = endOfEvent - startOfEvent

			return length + '%'
		},

		handleClickOnEvent(event: any) {
			const eventElement = this.getEventElementFromChildElement(event)

			if ( ! eventElement) return

			this.$emit('event-was-clicked', { clickedEvent: this.event, eventElement })
		},

		/**
		 * When a child element of the event is clicked, return the parent event element
		 * */
		getEventElementFromChildElement(event: any) {
			const eventTarget = event.target
			if ( ! eventTarget || typeof eventTarget.className.includes !== 'function') return null

			if (eventTarget.className.includes('.calendar-week__event')) return event.target

			return eventTarget.closest('.calendar-week__event')
		},

		/**
		 * Handle mousemove-events, while the event is being resized
		 * */
		onMouseMove(event: any) {
			const eventsContainer = document.querySelector('.calendar-week__events')

			if ( ! eventsContainer) return
			if (typeof this.resizingStartingPoint === 'undefined') this.resizingStartingPoint = event.clientY

			const cursorPositionY = event.clientY

			if ( ! this.resizingStartingPoint) return

			const nOfPixelsDistance = cursorPositionY - this.resizingStartingPoint
			const eventsContainerHeight = eventsContainer.clientHeight
			const percentageOfDayChanged = (nOfPixelsDistance / eventsContainerHeight) * 100
			const changeInTimePoints = (this.timePointsInDay / 100) * percentageOfDayChanged
			const changeInMinutes = this.getMinutesFromTimePoints(changeInTimePoints)

			// Count how many quarters have changed, since the event will only be updated
			// for every quarter that is added or subtracted
			if (this.resizingDirection === 'down') {
				this.changeInQuarterHoursEventEnd = Math.floor(changeInMinutes / 15)
			} else {
				this.changeInQuarterHoursEventStart = Math.floor(changeInMinutes / 15)
			}
		},

		/**
		 * Handle mouseup-events, for when an event stops being resized
		 * */
		onMouseUp() {
			this.stopResizing()
		},

		resizeEvent(direction: 'down' | 'up') {
			this.resizingDirection = direction;
			document.addEventListener('mousemove', this.onMouseMove)
			document.addEventListener('mouseup', this.onMouseUp)
		},

		stopResizing() {
			document.removeEventListener('mousemove', this.onMouseMove)
			document.removeEventListener('mouseup', this.onMouseUp)
			this.resetResizingValues()
			this.$emit('event-was-resized', this.event)
		},

		/**
		 * Reset values used for resizing an event, to prepare for upcoming resizing events
		 * */
		resetResizingValues() {
			this.resizingStartingPoint = undefined
			this.resizingStartingPointStartOfTime = this.eventProp.time.start
			this.resizingStartingPointEndOfTime = this.eventProp.time.end
			this.changeInQuarterHoursEventEnd = 0
		},

		/**
		 * Calculate the change of an event in minutes, based on the number of time points that changed
		 * */
		getMinutesFromTimePoints(timePoints: number) {
			return timePoints / this.timePointsInOneMinute
		},

		setColors() {
			// First, if the event has a customColorScheme, and the name of that
			if (
				this.event?.colorScheme
				&& this.config.style?.colorSchemes
				&& this.config.style.colorSchemes[this.event.colorScheme]
			) {
				this.eventColor = this.config.style.colorSchemes[this.event.colorScheme].color
				return this.eventBackgroundColor = this.config.style.colorSchemes[this.event.colorScheme].backgroundColor
			}

			if (this.event?.color) {
				this.eventColor = '#fff'
				return this.eventBackgroundColor = this.colors[this.event.color]
			}

			return this.eventBackgroundColor = this.colors.blue
		},
	},
	
	watch: {
		changeInQuarterHoursEventStart(newValue) {
			const { hour: dayStartHour, minutes: dayStartMinutes } = this.time.getHourAndMinutesFromTimePoints(this.time.DAY_START)
			const { year, month, date } = this.time.getAllVariablesFromDateTimeString(this.event.time.start)
			const startOfDayDateTimeString = this.time.getDateTimeStringFromDate(new Date(year, month, date, dayStartHour, dayStartMinutes))
			const { hour: oldHour, minutes: oldMinutes } = this.time.getAllVariablesFromDateTimeString(this.resizingStartingPointStartOfTime)

			const oldStartOfTimeDate = new Date(year, month, date, oldHour, oldMinutes)
			const newStartOfTimeDate = new Date(
				oldStartOfTimeDate.getTime() + ((newValue * 15) * 60000)
			)

			const newStartOfTimeDateTimeString = this.time.getDateTimeStringFromDate(newStartOfTimeDate)

			// Only set the new start time, if it's earlier than the end time of the event
			// and later than start of day
			if (
				newStartOfTimeDateTimeString < this.event.time.end
				&& newStartOfTimeDateTimeString >= startOfDayDateTimeString
			) this.event.time.start = newStartOfTimeDateTimeString
		},

		changeInQuarterHoursEventEnd(newValue) {
			const { hour: dayEndHour, minutes: dayEndMinutes } = this.time.getHourAndMinutesFromTimePoints(this.time.DAY_END)
			const { year, month, date } = this.time.getAllVariablesFromDateTimeString(this.event.time.start)
			const endOfDayDateTimeString = this.time.getDateTimeStringFromDate(new Date(year, month, date, dayEndHour, dayEndMinutes))
			const { hour: oldHour, minutes: oldMinutes } = this.time.getAllVariablesFromDateTimeString(this.resizingStartingPointEndOfTime)

			const oldEndOfTimeDate = new Date(year, month, date, oldHour, oldMinutes)
			const newEndOfTimeDate = new Date(
				oldEndOfTimeDate.getTime() + ((newValue * 15) * 60000)
			)

			const newEndOfTimeDateTimeString = this.time.getDateTimeStringFromDate(newEndOfTimeDate)

			// Only set the new end time, if it's later than the start time of the event
			// and earlier than end of day
			if (
				newEndOfTimeDateTimeString > this.event.time.start
				&& newEndOfTimeDateTimeString <= endOfDayDateTimeString
			) this.event.time.end = newEndOfTimeDateTimeString
		},
	},

	mounted() {
		this.setColors()
	}
})
</script>

<style scoped lang="scss">

.calendar-week__event {
	position: absolute;
	width: 100%;
	border-radius: 4px;
	cursor: pointer;
	box-sizing: content-box;

	.calendar-week__event-row {
		display: flex;
		align-items: flex-start;
		margin-bottom: 0.25em;
	}

	.calendar-week__event-info-wrapper {
		position: relative;
		padding: var(--qalendar-spacing-half);
		font-size: var(--qalendar-font-xs);
		height: 100%;
		box-sizing: border-box;
		overflow: hidden;
		user-select: none;
	}

	.calendar-week__event-blend-out {
		position: absolute;
		bottom: 0;
		height: 20px;
		width: 100%;
		transform: translateX(calc(var(--qalendar-spacing-half) * -1));
	}

	.calendar-week__event-icon {
		margin: 2px 4px 0 0;
		font-size: var(--qalendar-font-xs);
	}

	.calendar-week__event-resize {
		position: absolute;
		width: 100%;
		cursor: ns-resize;
		height: 5px;
	}

	.calendar-week__event-resize-up {
		top: 0;
	}

	.calendar-week__event-resize-down {
		bottom: 0;
	}
}

</style>
