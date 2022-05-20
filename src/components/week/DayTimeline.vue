<template>
	<div class="day-timeline">
		<div class="day-timeline__hour"
			 v-for="hour in timelineHours"
			 :key="hour">
			<span class="day-timeline__hour-text">
				{{ getLocaleTimeString(hour) }}
			</span>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {dayStartOrEnd} from "../../typings/config.interface";
import {dayBoundaries} from "../../typings/types";
import Time from "../../helpers/Time";

export default defineComponent({
	name: 'DayTimeline',

	props: {
		dayBoundaries: {
			type: Object as PropType<dayBoundaries>,
			default: () => ({
				start: 800,
				end: 1800,
			})
		},
		time: {
			type: Object as PropType<Time>,
			required: true,
		},
	},

	data() {
		return {
			possibleTimelineHours: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300] as dayStartOrEnd[],
			timelineHours: [] as dayStartOrEnd[],
		}
	},

	methods: {
		setDayTimelineSpan() {
			const possibleHours = this.possibleTimelineHours
			const self = this

			this.timelineHours = possibleHours.filter(hour => {
				return hour >= self.dayBoundaries.start && hour < self.dayBoundaries.end
			})
		},

		getLocaleTimeString(time: dayStartOrEnd): string {
			const { hour } = this.time.getHourAndMinutesFromTimePoints(time)

			return this.time.getLocalizedHour(new Date(2100, 1, 1, hour))
		}
	},

	mounted() {
		this.setDayTimelineSpan()
	}
})
</script>

<style scoped>

.day-timeline {
	position: absolute;
	top: 0;
	left: 0;
	width: calc(100% + 10px);
	transform: translateX(-10px);
	height: 100%;
	display: flex;
	flex-flow: column;
	justify-content: space-evenly;

}

.day-timeline__hour {
	padding-left: 4px;
	display: flex;
	flex-flow: column;
	justify-content: flex-start;
	/*flex: 1 1 0;*/
	height: 100%;
	font-size: 10px;
	color: var(--qalendar-gray-quite-dark);
}

.day-timeline__hour:first-child {
	border-top: var(--qalendar-border-gray-thin);
}

.day-timeline__hour:not(:last-child) {
	border-bottom: var(--qalendar-border-gray-thin);
}

.day-timeline__hour-text {
	transform: translate(-40px, -6px); /** Sets the hour to be above the line for full hour */
}

</style>
