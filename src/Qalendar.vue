<template>
  <div class="calendar-root-wrapper">
    <div
      class="calendar-root"
      :class="{
        'mode-is-day': mode === 'day',
        'mode-is-week': mode === 'week',
        'mode-is-month': mode === 'month',
        'qalendar-is-small': isSmall,
      }"
    >
      <Transition name="loading">
        <div v-if="isLoading" class="top-bar-loader" />
      </Transition>

      <AppHeader
        :key="wasInitialized + mode"
        :config="config"
        :mode="mode"
        :time="time"
        :period="period"
        :is-small="isSmall"
        @change-mode="handleChangeMode"
        @updated-period="handleUpdatedPeriod"
      />

      <Week
        v-if="['week', 'day'].includes(mode)"
        :key="period.start.getTime() + period.end.getTime() + eventRenderingKey"
        :events-prop="eventsDataProperty"
        :period="period"
        :config="config"
        :mode-prop="mode"
        :time="time"
        @event-was-clicked="$emit('event-was-clicked', $event)"
        @event-was-resized="handleEventWasUpdated($event, 'resized')"
        @event-was-dragged="handleEventWasUpdated($event, 'dragged')"
        @edit-event="$emit('edit-event', $event)"
        @delete-event="$emit('delete-event', $event)"
        @interval-was-clicked="$emit('interval-was-clicked', $event)"
        @day-was-clicked="$emit('day-was-clicked', $event)"
      >
        <template #event="p">
          <slot :event-data="p.eventData" name="event"></slot>
        </template>

        <template #eventDialog="p">
          <slot
            name="eventDialog"
            :event-dialog-data="p.eventDialogData"
            :close-event-dialog="p.closeEventDialog"
          ></slot>
        </template>

        <template #customCurrentTime>
          <slot name="customCurrentTime"></slot>
        </template>
      </Week>

      <Month
        v-if="mode === 'month'"
        :key="period.start.getTime() + period.end.getTime() + eventRenderingKey"
        :events-prop="eventsDataProperty"
        :time="time"
        :config="config"
        :period="period"
        @event-was-clicked="$emit('event-was-clicked', $event)"
        @day-was-clicked="$emit('day-was-clicked', $event)"
        @event-was-dragged="handleEventWasUpdated($event, 'dragged')"
        @updated-period="handleUpdatedPeriod($event, true)"
        @edit-event="$emit('edit-event', $event)"
        @delete-event="$emit('delete-event', $event)"
      >
        <template #eventDialog="p">
          <slot
            name="eventDialog"
            :event-dialog-data="p.eventDialogData"
            :close-event-dialog="p.closeEventDialog"
          ></slot>
        </template>
      </Month>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { eventInterface } from './typings/interfaces/event.interface';
import { configInterface } from './typings/config.interface';
import Time from './helpers/Time';
import AppHeader from './components/header/Header.vue';
import Week from './components/week/Week.vue';
import { modeType } from './typings/types';
import Month from './components/month/Month.vue';
import Errors from './helpers/Errors';
import {DATE_TIME_STRING_FULL_DAY_PATTERN} from './constants';

export default defineComponent({
  name: 'Qalendar',

  components: {
    Month,
    AppHeader,
    Week,
  },

  props: {
    config: {
      type: Object as PropType<configInterface>,
      default: () => ({}),
    },
    events: {
      type: Array as PropType<eventInterface[]>,
      default: () => [],
    },
    selectedDate: {
      type: Date,
      default: new Date(),
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    'event-was-clicked',
    'event-was-resized',
    'event-was-dragged',
    'updated-period',
    'updated-mode',
    'edit-event',
    'delete-event',
    'interval-was-clicked',
    'day-was-clicked',
  ],

  data() {
    return {
      wasInitialized: 0,
      period: {
        start: new Date(),
        end: new Date(),
        selectedDate: this.selectedDate ? this.selectedDate : new Date(),
      },
      mode: this.config?.defaultMode || ('week' as modeType),
      time: new Time(
        this.config?.week?.startsOn,
        this.config?.locale || null,
        {
          start: this.setTimePointsFromDayBoundary(this.config?.dayBoundaries?.start || 0),
          end: this.setTimePointsFromDayBoundary(this.config?.dayBoundaries?.end || 24),
        },
      ) as Time | any,
      fontFamily:
        this.config?.style?.fontFamily || "'Verdana', 'Open Sans', serif",
      eventRenderingKey: 0, // Works only as a dummy value, for re-rendering Month- and Week components, when events-watcher triggers
      eventsDataProperty: this.events || [],
      isSmall: false,
    };
  },

  watch: {
    events: {
      deep: true,
      handler(newVal, oldVal) {
        // The check on strict equality as primitive values is needed,
        // since we do not want to trigger a rerender on event-was-resized
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.eventsDataProperty = this.processEvents(newVal);
          this.eventRenderingKey = this.eventRenderingKey + 1;
        }

        // Disable console warnings, if config.isSilent === true
        if (this.config.isSilent) return;

        this.events.forEach((e) => Errors.checkEventProperties(e));
      },
      immediate: true,
    },

    config: {
      deep: true,
      handler(value: configInterface) {
        Errors.checkConfig(value);
      },
      immediate: true,
    },
  },

  mounted() {
    this.setConfigOnMount();
    this.onCalendarResize(); // Trigger once on mount, in order to set the correct mode, if viewing on a small screen
    this.setPeriodOnMount();
    window.addEventListener('resize', this.onCalendarResize);
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.onCalendarResize);
  },

  methods: {
    /**
     * Iterate over all events, creating several single day events out of every multi-day event
     * */
    processEvents(events: eventInterface[]) {
      return events.reduce((processedEvents: eventInterface[], event) => {
        const allEvents = processedEvents

        if (event.time.start.substring(0, 10) === event.time.end.substring(0, 10)
          || DATE_TIME_STRING_FULL_DAY_PATTERN.test(event.time.start)
        ) {
          allEvents.push(event);
        }

        // 1. If the start- and end dates are not equal, create a multiple day event
        else {
          const {
            year: firstDayYear,
            month: firstDayMonth,
            date: firstDayDate,
          } = this.time.getAllVariablesFromDateTimeString(event.time.start)

          allEvents.push({
            ...event,
            time: {
              start: event.time.start,
              end: this.time.getDateTimeStringFromDate(
                new Date(firstDayYear, firstDayMonth, firstDayDate, 23, 59, 59, 999),
              )
            },
            originalEvent: event,
          })

          let startDateTimeString = event.time.start.substring(0, 10)
          startDateTimeString = this.time.addDaysToDateTimeString(1, startDateTimeString)

          // 2. While the start date is less than the end date, create a full day event for each day
          // up until, but not including, the last day
          while (startDateTimeString < event.time.end.substring(0, 10)) {
            const { date, month, year }
              = this.time.getAllVariablesFromDateTimeString(startDateTimeString)

            const dayStart = this.time.getDateStringFromDate(
              new Date(year, month, date, 0, 0, 0)
            )

            const dayEnd = this.time.getDateStringFromDate(
              new Date(year, month, date, 23, 59, 59, 999)
            )

            allEvents.push({
              ...event,
              time: {
                start: dayStart,
                end: dayEnd,
              },
              originalEvent: event,
            })

            startDateTimeString = this.time.addDaysToDateTimeString(1, startDateTimeString)
          }

          // 3. Add the last day of the multiple day event
          const {
            year: lastDayYear,
            month: lastDayMonth,
            date: lastDayDate,
            hour: lastDayHour,
            minutes: lastDayMinute,
          } = this.time.getAllVariablesFromDateTimeString(event.time.end)

          allEvents.push({
            ...event,
            time: {
              start: this.time.getDateTimeStringFromDate(
                new Date(lastDayYear, lastDayMonth, lastDayDate, 0, 0, 0)
              ),
              end: this.time.getDateTimeStringFromDate(
                new Date(lastDayYear, lastDayMonth, lastDayDate, lastDayHour, lastDayMinute)
              ),
            },
            originalEvent: event,
          })
        }

        return allEvents
      }, [])
    },

    setConfigOnMount() {
      this.wasInitialized = 1;
    },

    /**
     * setModeWeek is used as flag, when the user clicks "+ see more" for a day, in the month view
     * */
    handleUpdatedPeriod(
      value: { start: Date; end: Date; selectedDate: Date },
      leaveMonthMode = false
    ) {
      this.$emit('updated-period', { start: value.start, end: value.end });
      this.period = value;

      if (leaveMonthMode) this.mode = this.isSmall ? 'day' : 'week';
    },

    /**
     * Update this.period according to the new mode, and then set this.mode to the provided payload
     * */
    handleChangeMode(payload: modeType) {
      if (payload === 'day') {
        this.period.start = this.period.selectedDate;
        this.period.end = this.time.setDateToEndOfDay(this.period.selectedDate);
      }

      if (payload === 'week') {
        const week = this.time.getCalendarWeekDateObjects(
          this.period.selectedDate
        );
        this.period.start = week[0];
        this.period.end = this.time.setDateToEndOfDay(week[6]);
      }

      if (payload === 'month') {
        const month = this.time.getCalendarMonthSplitInWeeks(
          this.period.selectedDate.getFullYear(),
          this.period.selectedDate.getMonth()
        );

        this.period.start = month[0][0];
        const lastWeek = month[month.length - 1];
        this.period.end = this.time.setDateToEndOfDay(
          lastWeek[lastWeek.length - 1]
        );
      }

      this.mode = payload;
      this.$emit('updated-mode', { mode: payload, period: this.period });
    },

    onCalendarResize() {
      // Calculate break point for day mode based on root font-size
      const documentRoot = document.documentElement;
      const calendarRoot = document.querySelector('.calendar-root');
      const documentFontSize = +window
        .getComputedStyle(documentRoot)
        .fontSize.split('p')[0];
      const breakPointFor1RemEquals16px = 700;
      const multiplier = 16 / documentFontSize;
      const smallCalendarBreakpoint = breakPointFor1RemEquals16px / multiplier; // For 16px root font-size, break point is at 43.75rem

      if (!calendarRoot) return;

      this.isSmall = calendarRoot.clientWidth < smallCalendarBreakpoint;

      if (this.isSmall && !['day', 'month'].includes(this.mode)) {
        this.mode = 'day';
      }
    },

    setPeriodOnMount() {
      if (this.mode === 'week') {
        const currentWeek = this.time.getCalendarWeekDateObjects(
          this.period.selectedDate
        );
        this.period.start = currentWeek[0];
        this.period.end = currentWeek[6];
      } else if (this.mode === 'month') {
        const month = this.time.getCalendarMonthSplitInWeeks(
          this.period.selectedDate.getFullYear(),
          this.period.selectedDate.getMonth()
        );
        this.period.start = month[0][0];
        const lastWeek = month[month.length - 1];
        this.period.end = lastWeek[lastWeek.length - 1];
      }
    },

    handleEventWasUpdated(
      calendarEvent: eventInterface,
      eventType: 'dragged' | 'resized'
    ) {
      const newEvents = this.eventsDataProperty.filter(
        (e) => e.id !== calendarEvent.id
      );
      this.eventsDataProperty = [calendarEvent, ...newEvents];
      this.$emit(`event-was-${eventType}`, calendarEvent);
    },

    setTimePointsFromDayBoundary(boundary: number) {
      // Only allow integers between 0 and 24
      if (boundary < 0 || boundary > 24 || boundary % 1 !== 0) throw new Error('Invalid day boundary');

      if (boundary === 0) return boundary;

      return boundary * 100;
    }
  },
});
</script>

<style lang="scss">
@import './styles/variables.scss';
@import '../node_modules/perfect-scrollbar/css/perfect-scrollbar.css';

.calendar-root-wrapper {
  width: 100%;
  max-width: 100vw;
  height: 100%;
  min-height: 700px;
  display: flex;

  .calendar-root {
    flex: 1;
    border: var(--qalendar-border-gray-thin);
    border-radius: var(--qalendar-border-radius);
    font-family: v-bind(fontFamily);

    position: relative;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-flow: column;

    .top-bar-loader {
      position: absolute;
      top: 1px;
      left: 2px;
      width: calc(100% - 4px);
      height: 3px;
      background: rgba(241, 241, 241, 0.2);
      border-radius: 16px;
      overflow: hidden;
    }

    .top-bar-loader:before {
      content: '';
      height: 4px;
      width: calc(100% - 4px);
      position: absolute;
      top: 1px;
      left: 2px;
      background: rgb(38, 132, 255);
      background: linear-gradient(
        90deg,
        rgba(38, 132, 255, 1) 0%,
        rgba(38, 132, 255, 0.5088410364145659) 48%,
        rgba(38, 132, 255, 1) 100%
      );
      animation: load 1.8s infinite;
      border-radius: 16px;
    }

    @keyframes load {
      0% {
        width: 0;
        left: -100%;
      }
      50% {
        left: 0;
        width: 100%;
      }
      100% {
        width: 0;
        left: 100%;
      }
    }

    .loading-enter-active,
    .loading-leave-active {
      transition: background 0.5s ease;
    }

    .loading-leave-to,
    .loading-enter-from {
      background-color: rgba(255, 255, 255, 0);
    }
  }
}
</style>
