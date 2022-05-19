<template>
	<div class="day-boundaries"
		 @click="showDayBoundariesMenu = true"
		 @mouseleave="showDayBoundariesMenu = false">
		<font-awesome-icon :icon="icons.clock"></font-awesome-icon>
		<span>{{ getLocaleTimeString(start) }}</span>
		-
		<span>{{ getLocaleTimeString(end) }}</span>

		<div class="day-boundaries__menu" v-if="showDayBoundariesMenu">
			<div class="day-boundaries__menu-list">
				<div v-for="hour in fullHours"
					 :key="hour"
					 class="day-boundaries__menu-list-item"
					 :class="{ 'is-disabled': startHourDisabled(hour) }"
					 @click="setBoundary('start', hour)">
					{{ getLocaleTimeString(hour) }}
				</div>
			</div>

			<div class="day-boundaries__menu-list">
				<div v-for="hour in fullHours"
					 :key="hour"
					 class="day-boundaries__menu-list-item"
					 :class="{ 'is-disabled': endHourDisabled(hour) }"
					 @click="setBoundary('end', hour)">
					{{ getLocaleTimeString(hour) }}
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faClock} from "@fortawesome/free-solid-svg-icons";
import {dayStartOrEnd} from "../../typings/config.interface";
import { dayBoundaries } from "../../typings/types";
import Time from "../../helpers/Time";

export default defineComponent({
	name: 'DayBoundaries',

	components: { FontAwesomeIcon },

	emits: ['set-day-start', 'set-day-end'],

	props: {
		boundaries: {
			type: Object as PropType<dayBoundaries>,
			required: true,
		},
		time: {
			type: Object as PropType<Time>,
			required: true,
		},
	},

	data() {
		return {
			start: this.boundaries?.start || 0 as dayStartOrEnd,
			end: this.boundaries?.end || 2400 as dayStartOrEnd,
			fullHours: this.time.ALL_HOURS,
			icons: {
				clock: faClock,
			},
			showDayBoundariesMenu: false,
		}
	},

	methods: {
		getLocaleTimeString(time: dayStartOrEnd): string {
			return this.time.getHourLocaleStringFromHourDigits(time)
		},

		setBoundary(boundary: 'start' | 'end', hour: dayStartOrEnd) {
			if (boundary === 'start' && hour >= this.end) return
			if (boundary === 'end' && hour <= this.start) return

			this[boundary] = hour
			//@ts-ignore
			this.$emit('set-day-' + boundary, hour)
		},

		startHourDisabled(hour: dayStartOrEnd) {
			return hour >= this.end;
		},

		endHourDisabled(hour: dayStartOrEnd) {
			return hour <= this.start;
		}
	}
})
</script>

<style scoped lang="scss">

.day-boundaries {
	position: relative;
	height: 36px;
	border: 1px solid #d1d5db;
	border-radius: 4px;
	padding: 0 var(--qalendar-spacing);
	font-size: 16px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: var(--qalendar-spacing-half);

	&__menu {
		background-color: #fff;
		position: absolute;
		z-index: 100;
		top: calc(100% + 1px);
		width: 100%;
		height: 250px;
		padding: var(--qalendar-spacing-half);
		text-align: center;
		display: flex;
		justify-content: space-between;
		border: var(--qalendar-border-gray-thin);
		border-radius: 4px;
	}

	&__menu-list {
		padding: 0 var(--qalendar-spacing-half);
		overflow: scroll;
		overflow: -moz-scrollbars-vertical;
		overflow-y: scroll;
		flex: 1;
	}

	&__menu-list:first-child {
		border-right: var(--qalendar-border-gray-thin);
	}

	&__menu-list-item {
		padding: var(--qalendar-spacing-half);
		border-radius: var(--qalendar-border-radius);
	}

	&__menu-list-item:hover {
		background-color: var(--qalendar-light-gray);
	}

	&__menu-list-item.is-disabled {
		color: var(--qalendar-gray-quite-dark);
		cursor: not-allowed;
	}
}
</style>
