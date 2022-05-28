<template>
	<div class="calendar-header">
		<div class="calendar-header__period-name" v-if="periodName">
			{{ periodName }}
		</div>

		<div class="calendar-header__period">
			<div class="calendar-header__chevron-arrows">
				<font-awesome-icon class="calendar-header__chevron-arrow calendar-header__chevron-arrow-left"
								   :icon="icons.chevronLeft"
								   @click="goToPeriod('previous')" />

				<font-awesome-icon class="calendar-header__chevron-arrow calendar-header__chevron-arrow-right"
								   :icon="icons.chevronRight"
								   @click="goToPeriod('next')" />
			</div>

			<DatePicker ref="periodSelect"
						  :mode="mode"
						  :time="time"
						  :period="period"
						  @updated="handlePeriodChange" />

			<div class="calendar-header__mode-picker">
				<div class="calendar-header__mode-value" @click="showModePicker = true">
					{{ modeName }}
				</div>

				<div class="calendar-header__mode-options"
					 v-if="showModePicker"
					 @mouseleave="showModePicker = false">
					<div class="calendar-header__mode-option is-month-mode" @click="$emit('change-mode', 'month')">
						{{ getLanguage(modesLanguageKeys.month, time.CALENDAR_LOCALE) }}
					</div>

					<div class="calendar-header__mode-option is-week-mode" @click="$emit('change-mode', 'week')">
						{{ getLanguage(modesLanguageKeys.week, time.CALENDAR_LOCALE) }}
					</div>

					<div class="calendar-header__mode-option is-day-mode" @click="$emit('change-mode', 'day')">
						{{ getLanguage(modesLanguageKeys.day, time.CALENDAR_LOCALE) }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import DatePicker from "./DatePicker.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {configInterface} from "../../typings/config.interface";
import Time from "../../helpers/Time";
import {periodInterface} from "../../typings/interfaces/period.interface";
import getLanguage from "../../language";
import modes from "../../language/modes";

export default defineComponent ({
	name: 'Header',

	components: {
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
		time: {
			type: Object as PropType<Time>,
			default: () => ({}),
		},
		period: {
			type: Object as PropType<periodInterface>,
			required: true
		},
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
			currentPeriod: this.period,
			showModePicker: false,
			modesLanguageKeys: modes,
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
				+ ' '  + this.currentPeriod.selectedDate.getFullYear()
		},

		modeName() {
			// @ts-ignore
			return getLanguage(modes[this.mode], this.time?.CALENDAR_LOCALE)
		},
	},

	methods: {
		handlePeriodChange(value: { start: Date, end: Date; selectedDate: Date }) {
			this.currentPeriod = value

			this.$emit('updated-period', value)
		},

		goToPeriod(direction: 'previous' | 'next') {
			(<any>this.$refs).periodSelect.goToPeriod(direction)
		},

		getLanguage(keys: any, locale: string) {
			return getLanguage(keys, locale)
		}
	},
});
</script>

<style scoped lang="scss">
@use '../../styles/mixins.scss' as mixins;

.calendar-header {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	padding: var(--qalendar-spacing-half);
	border-radius: var(--qalendar-border-radius);

	@include mixins.screen-size-m {
		justify-content: space-between;
		grid-gap: var(--qalendar-spacing);
	}

	&__period {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--qalendar-spacing);
	}

	&__period-name {
		font-size: 24px;
		margin-bottom: 4px;
		text-align: center;

		@include mixins.screen-size-m {
			margin-bottom: 0;
			text-align: left;
		}
	}

	&__multiselects {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--qalendar-spacing);
	}

	&__chevron-arrows {
		display: flex;
		align-items: center;
		gap: var(--qalendar-spacing);

		.calendar-header__chevron-arrow {
			cursor: pointer;
			transition: color 0.2s ease;

			@include mixins.hover {
				color: var(--qalendar-gray-quite-dark);
			}
		}
	}

	&__mode-picker {
		/** TODO: refactor into mixin, used for mode-picker and DatePicker.vue */
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: fit-content;
		height: 36px;
		border-radius: 4px;
		font-size: 16px;
		cursor: pointer;
		border: var(--qalendar-border-gray-thin);

		.calendar-header__mode-value {
			padding: 0 var(--qalendar-spacing);
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
		}

		.qalendar-is-small & {
			display: none;
		}

		.calendar-header__mode-options {
			position: absolute;
			z-index: 51;
			top: 100%;
			left: 50%;
			transform: translateX(-50%);
			border: var(--qalendar-border-gray-thin);
			background-color: #fff;

			.calendar-header__mode-option {
				padding: var(--qalendar-spacing-half) var(--qalendar-spacing);

				@include mixins.hover {
					background-color: var(--qalendar-light-gray);
				}
			}
		}
	}
}
</style>