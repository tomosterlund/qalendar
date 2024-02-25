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
      :data-lang="config?.locale?.substring(0, 2) || 'en'"
    >
      <Transition name="loading">
        <div
          v-if="isLoading"
          class="top-bar-loader"
        />
      </Transition>

      <AppHeader
        ref="appHeader"
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
        @datetime-was-clicked="$emit('datetime-was-clicked', $event)"
      >
        <template #weekDayEvent="p">
          <slot
            :event-data="p.eventData"
            name="weekDayEvent"
          />
        </template>

        <template #eventDialog="p">
          <slot
            name="eventDialog"
            :event-dialog-data="p.eventDialogData"
            :close-event-dialog="p.closeEventDialog"
          />
        </template>

        <template #customCurrentTime>
          <slot name="customCurrentTime" />
        </template>
      </Week>

      <Month
        v-if="mode === 'month'"
        :key="period.start.getTime() + period.end.getTime() + eventRenderingKey"
        :events-prop="eventsDataProperty"
        :time="time"
        :config="enhancedConfig"
        :period="period"
        @event-was-clicked="$emit('event-was-clicked', $event)"
        @date-was-clicked="handleDateWasClicked"
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
          />
        </template>

        <template #monthEvent="p">
          <slot
            :event-data="p.eventData"
            name="monthEvent"
          />
        </template>

        <template #agendaEvent="p">
          <slot
            :event-data="p.eventData"
            name="agendaEvent"
          />
        </template>

        <template #dayCell="{dayData}">
          <slot
            :day-data="dayData"
            name="dayCell"
          />
        </template>
      </Month>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, type PropType} from 'vue';
import {type eventInterface} from './typings/interfaces/event.interface';
import {type configInterface} from './typings/config.interface';
import Time from './helpers/Time';
import AppHeader from './components/header/Header.vue';
import Week from './components/week/Week.vue';
import {type modeType} from './typings/types';
import Month from './components/month/Month.vue';
import Errors from './helpers/Errors';

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
    'day-was-clicked', // TODO: remove with v4. day-was-clicked is deprecated
    'date-was-clicked',
    'datetime-was-clicked',
  ],

  data() {
    return {
      wasInitialized: 0,
      period: {
        start: new Date(),
        end: new Date(),
        selectedDate: this.selectedDate,
      },
      mode: this.config?.defaultMode || ('week' as modeType),
      time: new Time(this.config?.week?.startsOn, this.config?.locale || null, {
        start: this.setTimePointsFromDayBoundary(
          this.config?.dayBoundaries?.start || 0
        ),
        end: this.setTimePointsFromDayBoundary(
          this.config?.dayBoundaries?.end || 24
        ),
      }) as Time | any,
      fontFamily:
        this.config?.style?.fontFamily || "'Verdana', 'Open Sans', serif",
      eventRenderingKey: 0, // Works only as a dummy value, for re-rendering Month- and Week components, when events-watcher triggers
      eventsDataProperty: this.events,
      isSmall: false,
      ErrorsHelper: Errors,
    };
  },
  computed:{
    enhancedConfig(): configInterface {
      return { ...this.config, isSmall: this.isSmall }
    }
  },

  watch: {
    events: {
      deep: true,
      handler(newVal, oldVal) {
        // The check on strict equality as primitive values is needed,
        // since we do not want to trigger a rerender on event-was-resized
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.eventsDataProperty = newVal;
          this.eventRenderingKey = this.eventRenderingKey + 1;
        }

        if (this.config.isSilent) return;

        this.events.forEach((e) => this.ErrorsHelper.checkEventProperties(e));
      },
      immediate: true,
    },

    config: {
      deep: true,
      handler(value: configInterface) {
        this.ErrorsHelper.checkConfig(value);
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

      if (leaveMonthMode) this.mode = 'day';
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
      return Time.getTimePointsFromHour(boundary);
    },

    handleDateWasClicked(payload: string) {
      this.$emit('day-was-clicked', payload); // TODO: remove with v4. day-was-clicked is deprecated
      this.$emit('date-was-clicked', payload);
    },

    goToPeriod(direction: 'previous' | 'next') {
      (this.$refs.appHeader as typeof AppHeader).goToPeriod(direction);
    },
  },
});
</script>

<style lang="scss">
@import './styles/variables.scss';
@import './styles/mixins.scss';
@import '../node_modules/perfect-scrollbar/css/perfect-scrollbar.css';

.calendar-root-wrapper {
  width: 100%;
  max-width: 100vw;
  height: 100%;
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

    @include dark-mode {
      background: #121212;
      color: #fff;
      border-color: transparent;
    }

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

      @include dark-mode {
        background: rgb(229, 224, 245);
      }
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
