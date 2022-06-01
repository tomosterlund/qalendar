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
import Time from "../../helpers/Time";
import {WEEK_HEIGHT} from "../../constants";

export default defineComponent({
	name: 'DayTimeline',

	props: {
		time: {
			type: Object as PropType<Time>,
			required: true,
		},
	},

	data() {
		return {
			timelineHours: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300] as dayStartOrEnd[],
			weekHeight: WEEK_HEIGHT + 'px',
		}
	},

	methods: {
		getLocaleTimeString(time: dayStartOrEnd): string {
			const { hour } = this.time.getHourAndMinutesFromTimePoints(time)

			return this.time.getLocalizedHour(new Date(2100, 1, 1, hour))
		}
	},
})
</script>

<style scoped lang="scss">

.day-timeline {
	position: absolute;
	top: 0;
	left: 0;
	width: calc(100% + 10px);
	height: v-bind(weekHeight);
	transform: translateX(-10px);
	display: flex;
	flex-flow: column;
	justify-content: space-evenly;

	&__hour {
		padding-left: 4px;
		display: flex;
		flex-flow: column;
		justify-content: flex-start;
		height: 100%;
		font-size: var(--qalendar-font-3xs);
		color: var(--qalendar-gray-quite-dark);

		&:first-child {

			.day-timeline__hour-text {
				display: none;
			}
		}

		&:not(:last-child) {
			border-bottom: var(--qalendar-border-gray-thin);
		}
	}

	&__hour-text {
		transform: translate(-40px, -6px); /** Sets the hour to be above the line for full hour */
	}

}

</style>
