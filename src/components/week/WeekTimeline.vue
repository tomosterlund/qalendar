<template>
	<div class="week-timeline">
		<span v-for="(day, dayIndex) in days"
			  :key="dayIndex"
			  class="week-timeline__day"
			  :class="{
				  'is-today': time.getDateTimeStringFromDate(now, 'start') === day.dateTimeString
			  }">
			<span class="week-timeline__day-name">
				{{ day.dayName.substring(0, 2).toUpperCase() }}
			</span>

			<span class="week-timeline__date">
				{{ getDaysDate(day) }}
			</span>
		</span>
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {dayInterface} from "../../typings/interfaces/day.interface";
import Time from "../../helpers/Time";

export default defineComponent({
	name: 'WeekTimeline',

	props: {
		days: {
			type: Array as PropType<dayInterface[]>,
			default: () => ([]),
		},
		time: {
			type: Object as PropType<Time>,
			required: true,
		},
	},

	data() {
		return {
			now: new Date()
		}
	},

	methods: {
		getDaysDate(day: dayInterface) {
			const { date } = this.time.getAllVariablesFromDateTimeString(day.dateTimeString)

			return date
		}
	}
})
</script>

<style scoped lang="scss">

.week-timeline {
	height: fit-content;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	padding-bottom: var(--qalendar-spacing-half);
	padding-left: var(--qalendar-week-padding-left);
	border-bottom: var(--qalendar-border-gray-thin);

	.mode-is-day & {
		width: 100%;
		padding-left: 0;
	}

	&__day {
		width: 100%;
		display: flex;
		flex-flow: column;
		align-items: center;
		justify-content: space-evenly;
	}

	&__day-name {
		font-size: var(--qalendar-font-2xs);
		font-weight: 400;
		margin-bottom: 4px;
		color: var(--qalendar-gray-quite-dark);
	}

	&__date {
		font-size: 1.2rem;
		margin-bottom: 4px;
		padding: 6px;
		height: 1.4rem;
		width: 1.4rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;

		.is-today & {
			background-color: var(--qalendar-blue);
			color: #fff;
		}
	}
}

</style>
