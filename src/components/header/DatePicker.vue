<template>
  <div
    class="date-picker"
    :class="isStandAloneComponent ? 'date-picker-root' : 'is-in-qalendar'"
    @mouseleave="hideDatePicker"
  >
    <div
      v-if="!isStandAloneComponent"
      class="date-picker__value-display"
      @click="togglePeriodSelector"
    >
      <font-awesome-icon :icon="icons.calendarIcon" />
      <span class="date-picker__value-display-text">{{ periodText }}</span>
    </div>

    <div
      v-if="showDatePicker"
      class="date-picker__week-picker"
      :class="{ 'is-in-qalendar': !isStandAloneComponent }"
      @mouseleave="hideDatePicker"
    >
      <div class="date-picker__week-picker-navigation">
        <font-awesome-icon
          class="is-icon is-chevron-left"
          :icon="icons.chevronLeft"
          @click="toggleDatePickerPeriod('previous')"
        />
        <span
          class="date-picker__toggle-mode"
          @click="toggleDatePickerMode"
        >
          <template v-if="datePickerMode === 'month'">
            {{
              datePickerCurrentDate.toLocaleString(getLocale(), {
                month: 'long',
                year: 'numeric',
              })
            }}
          </template>

          <template v-else-if="datePickerMode === 'year'">
            {{
              new Date(datePickerCurrentDate).toLocaleString(getLocale(), {
                year: 'numeric',
              })
            }}
          </template>
        </span>
        <font-awesome-icon
          class="is-icon is-chevron-right"
          :icon="icons.chevronRight"
          @click="toggleDatePickerPeriod('next')"
        />
      </div>

      <div
        v-if="datePickerMode === 'month'"
        class="date-picker__day-names week"
      >
        <span
          v-for="day in weekDays"
          :key="day.getDate()"
        >
          {{ time.getLocalizedNameOfWeekday(day, 'short') }}
        </span>
      </div>

      <div
        v-for="(week, weekIndex) in weekPickerDates"
        v-show="datePickerMode === 'month'"
        :key="weekIndex"
        class="week"
        :class="
          time.dateIsInWeek(selectedDate, week) && !isStandAloneComponent
            ? 'is-active'
            : ''
        "
      >
        <span
          v-for="(day, dayIndex) in week"
          :key="weekIndex + dayIndex"
          :class="{
            'is-weekend': [5, 6].includes(dayIndex),
            'is-not-in-month':
              day.getMonth() !== datePickerCurrentDate.getMonth(),
            'has-day': day,
            'is-today': time.dateIsToday(day),
            'is-disabled': checkIfDateIsDisabled(day),
          }"
          @click="!checkIfDateIsDisabled(day) ? setWeek(day) : null"
        >
          {{ day ? day.getDate() : '' }}
        </span>
      </div>

      <div
        v-show="datePickerMode === 'year'"
        class="months"
      >
        <span
          v-for="(date, monthIndex) in monthPickerDates"
          :key="monthIndex"
          class="has-month"
          @click="setMonth(date)"
        >
          {{ new Date(date).toLocaleString(getLocale(), { month: 'long' }) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCalendarDay,
  faChevronCircleLeft,
  faChevronCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import Time, {
  type calendarMonthType,
  type calendarWeekType,
  type calendarYearMonths,
  WEEK_START_DAY,
} from '../../helpers/Time';
import { type periodInterface } from '../../typings/interfaces/period.interface';
import { type modeType } from '../../typings/types';

interface disableDates {
  before: Date;
  after: Date;
}

export default defineComponent({
  name: 'DatePicker',

  components: { FontAwesomeIcon },

  props: {
    mode: {
      type: String as PropType<modeType>,
      default: 'week',
    },
    timeProp: {
      type: Object as PropType<Time>,
      default: null,
    },
    periodProp: {
      type: Object as PropType<periodInterface>,
      default: null,
    },
    firstDayOfWeek: {
      type: String as PropType<WEEK_START_DAY>,
      default: '',
    },
    defaultDate: {
      type: Date,
      default: new Date(),
    },

    /** For usage of the component as a stand-alone component, outside Qalendar */
    locale: {
      type: String,
      default: '',
    },
    disableDates: {
      type: Object as PropType<disableDates>,
      default: null,
    },
    /** End of props for stand-alone component  */
  },

  emits: ['updated'],

  data() {
    return {
      periodText: '',
      weekPickerDates: [] as calendarMonthType,
      monthPickerDates: [] as calendarYearMonths,
      icons: {
        calendarIcon: faCalendarDay,
        chevronLeft: faChevronCircleLeft,
        chevronRight: faChevronCircleRight,
      },
      showDatePicker: !!(this.locale && this.firstDayOfWeek) as boolean, // Set to automatic show, when used as a standalone component
      /**
       * Though selectedDate might look identical to datePickerCurrentDate, it is not
       * There is a need for separate state for:
       * 1. (datePickerCurrentDate) the current date governing what to show in the week picker.
       * This changes as the user browses between weeks, months and years
       *
       * 2. (selectedDate) the selected date of the entire calendar.
       * This should not change as the user browses in the date picker, only when the user
       * PICKS a date in the date picker
       * */
      datePickerCurrentDate: this.periodProp?.selectedDate || this.defaultDate || new Date(),
      selectedDate: this.periodProp?.selectedDate || new Date(),
      datePickerMode: 'month' as 'month' | 'year',
      weekDays: [] as calendarWeekType, // Used only for printing week day names,
      time: this.timeProp
        ? this.timeProp
        : new Time(this.firstDayOfWeek, this.locale),
      period: this.periodProp || {
        start: new Date(),
        end: new Date(),
        selectedDate: this.defaultDate ? this.defaultDate : new Date(),
      },
    };
  },

  computed: {
    /**
     * If both following props are set, this means the component is being used as a stand alone component
     * and not inside Qalendar
     * */
    isStandAloneComponent() {
      return this.locale && this.firstDayOfWeek;
    },
  },

  mounted() {
    this.hydrateDatePicker();
  },

  methods: {
    setMonthDaysInWeekPicker(
      month: number = new Date().getMonth(),
      year: number = new Date().getFullYear()
    ) {
      this.weekPickerDates = [];
      this.weekPickerDates = this.time.getCalendarMonthSplitInWeeks(
        year,
        month
      );
    },

    togglePeriodSelector() {
      this.weekPickerDates = this.time.getCalendarMonthSplitInWeeks(
        this.datePickerCurrentDate.getFullYear(),
        this.datePickerCurrentDate.getMonth()
      );
      this.showDatePicker = !this.showDatePicker;
    },

    setWeek(date: Date, isOnMountHook = false) {
      if (!isOnMountHook) this.datePickerCurrentDate = date;

      const currentWeek = this.time.getCalendarWeekDateObjects(date);
      this.weekDays = currentWeek;
      const start = currentWeek[0];
      const end = currentWeek[6];

      switch (this.mode) {
        case 'week':
          this.periodText = `${this.time.getLocalizedDateString(
            start
          )} - ${this.time.getLocalizedDateString(end)}`;
          break;
        case 'month':
          this.periodText = this.time.getLocalizedNameOfMonth(date);
          break;
        default:
          this.periodText = this.time.getLocalizedDateString(date);
      }

      if (isOnMountHook) return;

      this.emitChange(start, end);
    },

    setMonth(date: Date) {
      this.datePickerCurrentDate = date;
      this.setMonthDaysInWeekPicker(date.getMonth(), date.getFullYear());
      this.datePickerMode = 'month';
      this.showDatePicker = true;
    },

    emitChange(start: Date, end: Date) {
      this.selectedDate = this.datePickerCurrentDate;

      if (this.mode === 'month') {
        const month = this.time.getCalendarMonthSplitInWeeks(
          this.selectedDate.getFullYear(),
          this.selectedDate.getMonth()
        );
        start = month[0][0];
        const lastWeek = month[month.length - 1];
        end = lastWeek[lastWeek.length - 1];
      } else if (this.mode === 'day') {
        start = this.selectedDate;
        end = this.selectedDate;
      }

      // Emit event, for usage within Qalendar
      if (!this.isStandAloneComponent) {
        this.$emit('updated', {
          start: new Date(
            start.getFullYear(),
            start.getMonth(),
            start.getDate(),
            0,
            0,
            0
          ),
          end: this.time.setDateToEndOfDay(end),
          selectedDate: this.datePickerCurrentDate,
        });
      } else {
        // Emit event for usage as a stand-alone component
        this.$emit('updated', {
          year: this.datePickerCurrentDate.getFullYear(),
          month: this.datePickerCurrentDate.getMonth(),
          date: this.datePickerCurrentDate.getDate(),
        });
      }
    },

    toggleDatePickerPeriod(direction: 'previous' | 'next') {
      const currentDate = new Date(this.datePickerCurrentDate);

      if (this.datePickerMode === 'month') {
        const dateToSet = new Date(
          currentDate.getFullYear(),
          direction === 'previous'
            ? currentDate.getMonth() - 1
            : currentDate.getMonth() + 1,
          1
        );
        this.setMonthDaysInWeekPicker(
          dateToSet.getMonth(),
          dateToSet.getFullYear()
        );
        this.datePickerCurrentDate = dateToSet;
      } else {
        this.monthPickerDates = this.time.getCalendarYearMonths(
          direction === 'previous'
            ? currentDate.getFullYear() - 1
            : currentDate.getFullYear() + 1
        );
        this.datePickerCurrentDate = new Date(this.monthPickerDates[0]);
      }
    },

    toggleDatePickerMode() {
      // toggle to year
      if (this.datePickerMode === 'month') {
        this.monthPickerDates = this.time.getCalendarYearMonths(
          this.datePickerCurrentDate.getFullYear()
        );

        return (this.datePickerMode = 'year');
      }

      // toggle to month
      this.weekPickerDates = this.time.getCalendarMonthSplitInWeeks(
        this.datePickerCurrentDate.getFullYear(),
        this.datePickerCurrentDate.getMonth()
      );

      this.datePickerMode = 'month';
    },

    getLocale() {
      return this.time.CALENDAR_LOCALE;
    },

    goToPeriod(direction: 'next' | 'previous') {
      let newDate;
      let newDatePayload;

      if (this.mode === 'week') {
        const week = this.time.getCalendarWeekDateObjects(
          this.datePickerCurrentDate
        );
        newDate = new Date(week[0]);
        newDatePayload = direction === 'next' ? newDate.getDate() + 7 : newDate.getDate() - 7;
        newDate.setDate(newDatePayload);
      } else if (this.mode === 'month') {
        newDate = new Date(this.datePickerCurrentDate);
        newDate.setMonth(
          direction === 'next'
            ? newDate.getMonth() + 1
            : newDate.getMonth() - 1
        );
        newDate.setDate(1);
      } else {
        // day
        newDate = new Date(this.datePickerCurrentDate);
        newDatePayload = direction === 'next' ? newDate.getDate() + 1 : newDate.getDate() - 1;
        newDate.setDate(newDatePayload);
      }

      this.setWeek(newDate);
    },

    hideDatePicker() {
      // When DatePicker acts as stand-alone component, it should never close automatically. This way the user has full power over its closing
      if (!this.isStandAloneComponent)
        setTimeout(() => (this.showDatePicker = false), 100);
    },

    hydrateDatePicker() {
      const date = this.datePickerCurrentDate;
      this.setMonthDaysInWeekPicker(date.getMonth(), date.getFullYear());
      this.setWeek(date, true);
    },

    checkIfDateIsDisabled(date: Date) {
      if (!this.disableDates) return false;
      if (date.getTime() < this.disableDates.before.getTime()) return true;

      return date.getTime() > this.disableDates.after.getTime();
    },
  },
});
</script>

<style scoped lang="scss">
@use '../../styles/mixins.scss' as mixins;
@use '../../styles/variables.scss';

.date-picker {
  position: relative;
  width: fit-content;
  min-width: 16rem;

  .mode-is-month & {
    min-width: 8rem;
  }

  .mode-is-day & {
    min-width: 10rem;
  }

  .qalendar-is-small & {
    min-width: initial;
  }

  &:not(.is-in-qalendar) {
    min-width: initial;

    .qalendar-is-small & {
      margin: 0 auto;
    }
  }

  &__value-display {
    height: 36px;
    border-radius: 4px;
    padding: 0 var(--qalendar-spacing);
    font-size: var(--qalendar-font-m);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--qalendar-spacing-half);
    user-select: none;
    border: var(--qalendar-border-gray-thin);

    @include mixins.dark-mode {
      color: var(--qalendar-dark-mode-text-hint);
      background-color: var(--qalendar-dark-mode-lightly-elevated-surface);
      border-color: transparent;
    }

    .qalendar-is-small & {
      border: 0;
    }

    .date-picker__value-display-text {
      display: initial;

      .qalendar-is-small & {
        display: none;
      }
    }

    svg {
      font-size: initial;

      .qalendar-is-small & {
        font-size: var(--qalendar-font-l);
      }
    }
  }

  &__week-picker {
    padding: var(--qalendar-spacing-half);
    z-index: 51;
    background-color: #fff;
    border: var(--qalendar-border-gray-thin);
    border-radius: 4px;
    min-width: 250px;
    box-shadow: 0 2px 4px rgb(240 236 236 / 76%);

    @include mixins.dark-mode {
      background-color: var(--qalendar-dark-mode-elevated-surface);
      border-color: transparent;
      box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
    }

    &.is-in-qalendar {
      top: calc(100% - 1px);
      position: absolute;
      right: 0;

      .mode-is-month,
      .mode-is-week & {
        // week-picker can only be centered, if it is not the most far-right element in header
        // which is the case in month- and week mode, but not in day mode
        left: 50%;
        transform: translateX(-50%);

        .qalendar-is-small & {
          left: initial;
          transform: initial;
        }
      }
    }
  }

  &__week-picker-navigation {
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--qalendar-spacing-half);
    margin-bottom: 0.25em;
    user-select: none;

    .is-icon {
      transition: var(--qalendar-text-transition);
      color: #131313;

      @include mixins.dark-mode {
        color: var(--qalendar-dark-mode-text-hint);
      }

      @include mixins.hover {
        color: var(--qalendar-blue);
        cursor: pointer;
      }
    }
  }

  &__toggle-mode {
    transition: var(--qalendar-text-transition);

    @include mixins.hover {
      color: var(--qalendar-blue);
      cursor: pointer;
    }
  }

  .months {
    display: flex;
    flex-wrap: wrap;
    gap: var(--qalendar-spacing-half);
    max-width: 20rem;

    span {
      padding: 4px;
      border: var(--qalendar-border-gray-thin);
      border-radius: 2px;
      flex: 1 0 33%;
      text-align: center;
      cursor: pointer;
      font-size: var(--qalendar-font-xs);
      transition: all 0.2s ease;

      @include mixins.hover {
        background-color: var(--qalendar-theme-color);
        color: #fff;
        border: var(--qalendar-border-blue-thin);
      }
    }
  }

  .week {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin: 4px 0;

    &.is-active {
      border: 1px dashed var(--qalendar-theme-color);
      border-radius: 4px;
    }

    span {
      display: flex;
      min-height: 32px;
      min-width: 32px;
      justify-content: center;
      align-items: center;
      flex: 1 1 100%;
      cursor: pointer;
      border-radius: 50%;
      font-size: var(--qalendar-font-xs);

      &.is-weekend {
        color: gray;
      }

      &.has-day {
        @include mixins.hover {
          background-color: var(--qalendar-option-hover);
        }
      }

      &.is-today {
        background-color: var(--qalendar-blue);
        color: #fff;
      }

      &.is-not-in-month {
        color: darkgray;
      }

      &.is-disabled {
        color: darkgray;
        cursor: not-allowed;
      }

      [data-lang='ar'] & {
        font-size: 0.65rem;
      }
    }
  }

  &__day-names {
    text-transform: uppercase;
    font-weight: 700;
    font-size: var(--qalendar-font-s);
  }
}
</style>
