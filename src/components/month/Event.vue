<template>
	<div class="calendar-month__event"
		 :id="eventIdPrefix + calendarEvent.id" @click="handleClickOnEvent">
		<span class="calendar-month__event-color"></span>

		<span class="calendar-month__event-time">
			{{ eventTimeStart }}
		</span>

		<span class="calendar-month__event-title">
			{{ calendarEvent.title }}
		</span>
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import Time from "../../helpers/Time";
import {eventInterface} from "../../typings/interfaces/event.interface";
import {EVENT_COLORS} from "../../constants";
import {configInterface} from "../../typings/config.interface";

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
		config: {
			type: Object as PropType<configInterface>,
			required: true,
		},
	},

	data() {
		return {
			colors: EVENT_COLORS as { [key: string]: string },
			eventBackgroundColor: '',
			eventIdPrefix: 'calendar-month__event-',
		}
	},

	computed: {
		eventTimeStart() {
			return this.time.getLocalizedTime(this.calendarEvent.time.start)
		},
	},

	methods: {
		setColors() {
			// First, if the event has a customColorScheme, and the name of that
			if (
				this.calendarEvent?.colorScheme
				&& this.config.style?.colorSchemes
				&& this.config.style.colorSchemes[this.calendarEvent.colorScheme]
			) {
				return this.eventBackgroundColor = this.config.style.colorSchemes[this.calendarEvent.colorScheme].backgroundColor
			}

			if (this.calendarEvent?.color) {
				return this.eventBackgroundColor = this.colors[this.calendarEvent.color]
			}

			return this.eventBackgroundColor = this.colors.blue
		},

		handleClickOnEvent() {
			const eventElement = document.getElementById(this.eventIdPrefix + this.calendarEvent.id)

			if ( ! eventElement) return

			this.$emit('event-was-clicked', { clickedEvent: this.calendarEvent, eventElement })
		}
	},

	mounted() {
		this.setColors()
	}
})
</script>

<style lang="scss" scoped>
@use '../../styles/mixins' as mixins;

.calendar-month__event {
	display: flex;
	align-items: center;
	overflow: hidden;
	border-radius: 4px;
	font-size: var(--qalendar-font-2xs);
	width: 100%;
	margin-bottom: 4px;
	padding: 2px 4px;
	cursor: pointer;

	@include mixins.hover {
		background-color: var(--qalendar-light-gray);
	}

	.calendar-month__event-color {
		background-color: v-bind(eventBackgroundColor);
		width: 6px;
		height: 6px;
		border-radius: 50%;
		margin-right: 4px;
	}

	.calendar-month__event-time {
		margin-right: 6px;
	}

	.calendar-month__event-time,
	.calendar-month__event-title,
	.calendar-month__event-color {
		flex-shrink: 0;
	}

	.calendar-month__event-title {
		//font-weight: 600;
	}
}

</style>
