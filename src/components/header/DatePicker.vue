<template>
	<div class="date-picker">
		<div class="date-picker__value-display" @click="openPeriodSelector">
			<font-awesome-icon :icon="icons.calendarIcon"></font-awesome-icon>
			{{ period }}
		</div>

		<div class="date-picker__week-picker" v-if="showDatePicker">
			<div class="date-picker__week-picker-navigation">
				<font-awesome-icon class="is-icon is-chevron-left"
								   :icon="icons.chevronLeft"
								   @click="toggleDatePickerPeriod('previous')"></font-awesome-icon>
				<span class="date-picker__toggle-mode" @click="toggleDatePickerMode">
					<template v-if="datePickerMode === 'month'">
						{{ datePickerCurrentDate.toLocaleString(getLocale(), { month: 'long', year: 'numeric' }) }}
					</template>

					<template v-else-if="datePickerMode === 'year'">
						{{ new Date(datePickerCurrentDate).toLocaleString(getLocale(), { year: 'numeric' }) }}
					</template>
				</span>
				<font-awesome-icon class="is-icon is-chevron-right"
								   :icon="icons.chevronRight"
								   @click="toggleDatePickerPeriod('next')"></font-awesome-icon>
			</div>

			<div v-if="datePickerMode === 'month'"
				 class="date-picker__day-names week">
				<span v-for="day in weekDays" :key="day.getDate()">
					{{ time.getLocalizedNameOfWeekday(day, 'short') }}
				</span>
			</div>

			<div class="week" v-for="(week, weekIndex) in weekPickerDates"
				 :key="weekIndex"
				 v-show="datePickerMode === 'month'">
				<span v-for="(day, dayIndex) in week"
					  :key="weekIndex + dayIndex"
					  :class="{
						  'is-weekend': [5, 6].includes(dayIndex),
						  'is-not-in-month': day.getMonth() !== datePickerCurrentDate.getMonth(),
						  'has-day': day,
					  }"
					  @click="setWeek(day)">
					{{ day ? new Date(day).getDate() : '' }}
				</span>
			</div>

			<div class="months" v-show="datePickerMode === 'year'">
				<span v-for="(date, monthIndex) in monthPickerDates"
					  :key="monthIndex"
					  class="has-month"
					  @click="setMonth(date)">
					{{ new Date(date).toLocaleString(getLocale(), { month: 'long' }) }}
				</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {faCalendarDay, faChevronCircleLeft, faChevronCircleRight} from "@fortawesome/free-solid-svg-icons";
import Time, {calendarMonthType, calendarWeekType, calendarYearMonths} from "../../helpers/Time";

export default defineComponent({
	name: 'DatePicker',

	components: { FontAwesomeIcon },

	props: {
		selectedDateDefault: {
			type: Date,
			default: new Date(),
		},
		mode: {
			type: String as PropType<'day' | 'week' | 'month'>,
			default: 'week',
		},
		time: {
			type: Object as PropType<Time>,
			required: true,
		}
	},

	emits: ['updated'],

	data() {
		return {
			period: '',
			weekPickerDates: [] as calendarMonthType,
			monthPickerDates: [] as calendarYearMonths,
			icons: {
				calendarIcon: faCalendarDay,
				chevronLeft: faChevronCircleLeft,
				chevronRight: faChevronCircleRight,
			},
			showDatePicker: false,
			datePickerCurrentDate: this.selectedDateDefault ? this.selectedDateDefault : new Date(),
			datePickerMode: 'month' as 'month' | 'year',
			weekDays: [] as calendarWeekType, // Used only for printing week day names
		}
	},

	methods: {
		setMonthDaysInWeekPicker(
			month: number = new Date().getMonth(),
			year: number = new Date().getFullYear(),
		) {
			this.weekPickerDates = []
			this.weekPickerDates = this.time.getCalendarMonthSplitInWeeks(year, month)
		},

		clickOutsideListener(event: MouseEvent) {
			const weekPicker = document.querySelector('.date-picker__week-picker')
			const valueDisplay = document.querySelector('.date-picker__value-display')

			if ( ! weekPicker) return

			// @ts-ignore
			if (valueDisplay && valueDisplay.isEqualNode(event.target)) {
				return this.showDatePicker = true
			}

			// @ts-ignore
			if ( ! weekPicker.contains(event.target)) {
				this.showDatePicker = false
				window.removeEventListener('click', this.clickOutsideListener)
			}
		},

		setClickOutsideListener() {
			window.addEventListener('click', (event) => this.clickOutsideListener(event))
		},

		openPeriodSelector() {
			this.showDatePicker = true

			setTimeout(() => this.setClickOutsideListener(), 100)
		},

		setWeek(date: Date) {
			this.datePickerCurrentDate = date
			const currentWeek = this.time.getCalendarWeekDateObjects(date)
			this.weekDays = currentWeek
			const start = currentWeek[0]
			const end = currentWeek[6]

			this.period = `${this.time.getLocalizedDateString(start)} - ${this.time.getLocalizedDateString(end)}`
			this.emitChange(start, end)
		},

		setMonth(date: Date) {
			this.datePickerCurrentDate = date
			this.setMonthDaysInWeekPicker(
				date.getMonth(),
				date.getFullYear()
			)
			this.datePickerMode = 'month'
			this.showDatePicker = true
		},

		emitChange(start: Date, end: Date) {
			this.$emit('updated', {
				start,
				end,
				selectedDate: this.datePickerCurrentDate,
			});
		},

		toggleDatePickerPeriod(direction: 'previous' | 'next') {
			const currentDate = new Date(this.datePickerCurrentDate)

			if (this.datePickerMode === 'month') {
				const dateToSet = new Date(
					currentDate.getFullYear(),
					direction === 'previous' ? currentDate.getMonth() - 1 : currentDate.getMonth() + 1,
					1
				)
				this.setMonthDaysInWeekPicker(dateToSet.getMonth(), dateToSet.getFullYear())
				this.datePickerCurrentDate = dateToSet
			} else {
				this.monthPickerDates = this.time.getCalendarYearMonths(
					direction === 'previous' ? currentDate.getFullYear() - 1 : currentDate.getFullYear() + 1
				)
				this.datePickerCurrentDate = new Date(this.monthPickerDates[0])
			}
		},

		toggleDatePickerMode() {
			if (this.datePickerMode === 'month') {
				this.monthPickerDates = this.time.getCalendarYearMonths(this.datePickerCurrentDate.getFullYear())

				return this.datePickerMode = 'year'
			}

			if (this.datePickerMode === 'year') {
				this.weekPickerDates = this.time.getCalendarMonthSplitInWeeks(
					this.datePickerCurrentDate.getFullYear(),
					this.datePickerCurrentDate.getMonth()
				)

				return this.datePickerMode = 'month'
			}
		},

		getLocale() {
			return this.time.CALENDAR_LOCALE
		},

		goToPeriod(direction: 'next' | 'previous') {
			let newDate
			let newDatePayload

			if (this.mode === 'week') {
				const week = this.time.getCalendarWeekDateObjects(this.datePickerCurrentDate)
				newDate = new Date(week[0])
				newDatePayload = direction === 'next'
					? newDate.getDate() + 7
					: newDate.getDate() - 7
			} else { // day
				newDate = new Date(this.datePickerCurrentDate)
				newDatePayload = direction === 'next'
					? newDate.getDate() + 1
					: newDate.getDate() - 1
			}

			newDate.setDate(newDatePayload)
			this.setWeek(newDate)
		}
	},

	mounted() {
		if ( ! this.selectedDateDefault) {
			this.setWeek(new Date())
			this.setMonthDaysInWeekPicker()
		} else if (this.selectedDateDefault) {
			const defaultDate = new Date(this.selectedDateDefault)
			this.setMonthDaysInWeekPicker(defaultDate.getMonth(), defaultDate.getFullYear())
			this.setWeek(this.selectedDateDefault)
		}
	},
})
</script>

<style scoped lang="scss">

.date-picker {
	position: relative;
	width: fit-content;

	&__value-display {
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
	}

	&__week-picker {
		position: absolute;
		padding: var(--qalendar-spacing-half);
		z-index: 51;
		background-color: #fff;
		border: var(--qalendar-border-gray-thin);
		border-radius: 4px;
		top: calc(100% - 1px);
		left: 50%;
		transform: translateX(-50%);
		width: 250px;
		box-shadow: 0 2px 4px rgba(240, 236, 236, 0.76);
	}

	&__week-picker-navigation {
		font-weight: 900;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		gap: var(--qalendar-spacing-half);
		margin-bottom: var(--qalendar-spacing-half);
		user-select: none;

		.is-icon {
			transition: var(--qalendar-text-transition);
			color: #131313;

			@media (hover: hover) {

				&:hover {
					color: var(--qalendar-blue);
					cursor: pointer;
				}
			}
		}
	}

	&__toggle-mode {
		transition: var(--qalendar-text-transition);

		@media (hover: hover) {

			&:hover {
				color: var(--qalendar-blue);
				cursor: pointer;
			}
		}
	}

	.week {
		width: 100%;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		margin: 4px 0;

		span {
			display: flex;
			height: 32px;
			width: 32px;
			justify-content: center;
			align-items: center;
			flex: 1 1 100%;
			cursor: pointer;
			border-radius: 50%;
			font-size: 12px;

			&.is-weekend {
				color: gray;
			}

			&.has-day {

				@media (hover: hover) {

					&:hover {
						background-color: var(--qalendar-light-gray);
					}
				}
			}

			&.is-not-in-month {
				color: darkgray;
			}
		}
	}

	&__day-names {
		text-transform: uppercase;
		font-weight: 700;
		font-size: 14px;
	}


	.months {
		display: flex;
		flex-wrap: wrap;
		gap: var(--qalendar-spacing-half);

		span {
			padding: 4px;
			border: var(--qalendar-border-gray-thin);
			border-radius: 4px;
			flex: 1 0 33%;
			text-align: center;
			cursor: pointer;
			font-size: 12px;
			transition: all 0.2s ease;

			@media (hover: hover) {

				&:hover {
					background-color: var(--qalendar-theme-color);
					color: #fff;
					border: var(--qalendar-border-blue-thin);
				}
			}
		}
	}
}

</style>
