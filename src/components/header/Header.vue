<template>
	<div class="calendar-header">
		<div class="calendar-header__period-name is-flex-grow-1" v-if="periodName">{{ periodName }}</div>

		<div class="calendar-header__multiselects">
			<div class="calendar-header__period is-flex-grow-1">
				<div class="calendar-header__chevron-arrows">
					<font-awesome-icon class="calendar-header__chevron-arrow calendar-header__chevron-arrow-left"
									   :icon="icons.chevronLeft"
									   @click="goToPeriod('previous')" />

					<font-awesome-icon class="calendar-header__chevron-arrow calendar-header__chevron-arrow-right"
									   :icon="icons.chevronRight"
									   @click="goToPeriod('next')" />
				</div>

				<DatePicker ref="periodSelect"
							  class="is-flex-grow-1"
							  :selected-date-default="selectedDateDefault"
							  :mode="mode"
							  :time="time"
							  @updated="handlePeriodChange" />

				<DayBoundaries class="is-flex-grow-1"
							   :boundaries="dayBoundaries"
							   :time="time"
							   @set-day-start="$emit('set-day-start', $event)"
							   @set-day-end="$emit('set-day-end', $event)" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import DatePicker from "./DatePicker.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
// import DayBoundaries from "./DayBoundaries.vue";
import {configInterface} from "../../typings/config.interface";
import {dayBoundaries} from "../../typings/types";
import Time from "../../helpers/Time";
import DayBoundaries from "./DayBoundaries.vue";

export default defineComponent ({
	name: 'Header',

	components: {
		DayBoundaries,
		DatePicker,
		FontAwesomeIcon,
	},

	props: {
		config: {
			type: Object as PropType<configInterface>,
			default: () => ({}),
		},
		mode: {
			type: String as PropType<'day' | 'week' | 'month'>,
			default: 'week',
		},
		selectedDateDefault: {
			type: Date,
			default: new Date()
		},
		dayBoundaries: {
			type: Object as PropType<dayBoundaries>,
			required: true,
		},
		time: {
			type: Object as PropType<Time>|any,
			default: () => ({}),
		}
	},

	data() {
		return {
			modeOptions: [
				{ value: 'week', label: 'Week' },
				{ value: 'month', label: 'Month' },
			],
			icons: {
				chevronLeft: faChevronLeft,
				chevronRight: faChevronRight,
			},
			currentPeriod: {
				start: new Date(),
				end: new Date(),
				selectedDate: new Date(),
			},
		};
	},

	computed: {
		periodName() {
			if (this.mode === 'week') {
				const startMonth = this.time.getLocalizedNameOfMonth(this.currentPeriod?.start, 'short')
				const endMonth = this.time.getLocalizedNameOfMonth(this.currentPeriod?.end, 'short')

				return startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`
			}

			// day
			return this.time.getLocalizedNameOfMonth(this.currentPeriod?.selectedDate, 'short')
		}
	},

	methods: {
		handlePeriodChange(value: { start: Date, end: Date; selectedDate: Date }) {
			this.currentPeriod = value

			this.$emit('updated-period', value)
		},

		goToPeriod(direction: 'previous' | 'next') {
			(<any>this.$refs).periodSelect.goToPeriod(direction)
		},
	},
});
</script>

<style scoped lang="scss">

.calendar-header {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	padding: var(--qalendar-spacing-half);
	border-radius: var(--qalendar-border-radius);
}

.calendar-header__period {
	display: flex;
	align-items: center;
	gap: var(--qalendar-spacing);
}

.calendar-header__period-name {
	font-size: 24px;
	margin-bottom: 4px;
	text-align: center;
}

@media (min-width: 600px) {

	.calendar-header__period-name {
		margin-bottom: 0;
		text-align: left;
	}
}

.calendar-header__multiselects {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: var(--qalendar-spacing);
}

.calendar-header__chevron-arrows {
	display: none;
	align-items: center;
	gap: var(--qalendar-spacing);
}

@media (min-width: 600px) {

	.calendar-header__chevron-arrows {
		display: flex;
	}
}

.calendar-header__chevron-arrow {
	cursor: pointer;
	transition: color 0.2s ease;
}

.calendar-header__chevron-arrow:hover {
	color: var(--qalendar-gray-quite-dark);
}

.is-flex-grow-1 {
	flex-grow: 1;
}


</style>