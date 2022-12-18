<template>
  <WeekTimeline
    :days="days"
    :time="time"
    :full-day-events="fullDayEvents"
    :config="config"
    :mode="mode"
    @event-was-clicked="handleClickOnEvent"
    @day-was-clicked="$emit('day-was-clicked', $event)"
  />

  <div class="calendar-week__wrapper">
    <EventFlyout
      v-if="!config.eventDialog || !config.eventDialog.isDisabled"
      :calendar-event-prop="selectedEvent"
      :event-element="selectedEventElement"
      :time="time"
      :config="config"
      @hide="selectedEvent = null"
      @edit-event="$emit('edit-event', $event)"
      @delete-event="$emit('delete-event', $event)"
    >
      <template #default="p">
        <slot
          name="eventDialog"
          :event-dialog-data="p.eventDialogData"
          :close-event-dialog="p.closeEventDialog"
        ></slot>
      </template>
    </EventFlyout>

    <section class="calendar-week">
      <div v-if="hasCustomCurrentTimeSlot && showCurrentTime" class="custom-current-time" :style="{ top: `${currentTimePercentage}%` }">
        <slot name="customCurrentTime"></slot>
      </div>

      <div v-else-if="config && config.showCurrentTime && showCurrentTime" class="current-time-line" :style="{ top: `${currentTimePercentage}%` }">
        <div class="current-time-line__circle"></div>
      </div>

      <DayTimeline
        :key="period.start.getTime() + period.end.getTime() + mode"
        :time="time"
        :day-intervals="dayIntervals"
        :week-height="weekHeight"
      />

      <div class="calendar-week__events">
        <Day
          v-for="(day, dayIndex) in days"
          :key="day.dateTimeString + mode + weekVersion"
          :day="day"
          :time="time"
          :config="config"
          :day-info="{ daysTotalN: days.length, thisDayIndex: dayIndex }"
          :mode="mode"
          :day-intervals="dayIntervals"
          @event-was-clicked="handleClickOnEvent"
          @event-was-resized="$emit('event-was-resized', $event)"
          @event-was-dragged="handleEventWasDragged"
          @interval-was-clicked="$emit('interval-was-clicked', $event)"
          @day-was-clicked="$emit('day-was-clicked', $event)"
        >
          <template #event="p">
            <slot :event-data="p.eventData" name="event"></slot>
          </template>
        </Day>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, Comment, Text, Slot, VNode } from 'vue';
import {
  configInterface,
  dayIntervalsType,
} from '../../typings/config.interface';
import DayTimeline from './DayTimeline.vue';
import { periodInterface } from '../../typings/interfaces/period.interface';
import { dayInterface } from '../../typings/interfaces/day.interface';
import WeekTimeline from './WeekTimeline.vue';
import Day from './Day.vue';
import EventFlyout from '../partials/EventFlyout.vue';
import { eventInterface } from '../../typings/interfaces/event.interface';
import Time from '../../helpers/Time';
import {
  DATE_TIME_STRING_FULL_DAY_PATTERN,
  DATE_TIME_STRING_PATTERN,
} from '../../constants';
import EventPosition from '../../helpers/EventPosition';
import { fullDayEventsWeek } from '../../typings/interfaces/full-day-events-week.type';
import { modeType } from '../../typings/types';
const eventPosition = new EventPosition();
import PerfectScrollbar from 'perfect-scrollbar';
import Helpers from '../../helpers/Helpers';

export default defineComponent({
  name: 'Week',

  components: {
    Day,
    WeekTimeline,
    DayTimeline,
    EventFlyout,
  },

  props: {
    config: {
      type: Object as PropType<configInterface>,
      required: true,
    },
    eventsProp: {
      type: Array as PropType<eventInterface[]>,
      default: () => [],
    },
    period: {
      type: Object as PropType<periodInterface>,
      required: true,
    },
    modeProp: {
      type: String as PropType<modeType>,
      default: 'week',
    },
    time: {
      type: Object as PropType<Time | any>,
      required: true,
    },
  },

  emits: [
    'event-was-clicked',
    'event-was-resized',
    'event-was-dragged',
    'edit-event',
    'delete-event',
    'interval-was-clicked',
    'day-was-clicked',
  ],

  data() {
    return {
      days: [] as dayInterface[],
      mode: this.modeProp as modeType,
      selectedEvent: null as eventInterface | null,
      selectedEventElement: null as any | null,
      events: this.eventsProp,
      fullDayEvents: [] as fullDayEventsWeek,
      weekVersion: 0, // is simply a dummy value, for re-rendering child components on event-was-dragged
      dayIntervals: {
        length: 60,
        height: 66,
      } as dayIntervalsType | any,
      weekHeight: '1584px', // Correlates to the initial values of dayIntervals.length and dayIntervals.height
      scrollbar: null as any,
      currentTimePercentage: 0,
      // When dayBoundaries are set, and the current time is outside the dayBoundaries, this property is set to false,
      // in order to hide the current time line
      showCurrentTime: !!this.config?.showCurrentTime,
    };
  },

  computed: {
    hasCustomCurrentTimeSlot() {
      return Helpers.hasSlotContent(this.$slots.customCurrentTime)
    },

    nDays() {
      return this.config?.week?.nDays || 7;
    }
  },

  watch: {
    period: {
      deep: true,
      handler() {
        this.setInitialEvents(this.mode);
      },
    },
    modeProp: {
      deep: true,
      handler(value) {
        this.mode = value;
        this.setInitialEvents(value);
      },
    },
  },

  mounted() {
    this.setDayIntervals();
    this.filterOutFullDayEvents();
    this.setInitialEvents(this.modeProp);
    this.scrollOnMount();
    this.initScrollbar();
    if (this.config?.showCurrentTime || this.hasCustomCurrentTimeSlot) this.setCurrentTime();
  },

  methods: {
    initScrollbar(elapsedMs = 0) {
      const el = document.querySelector('.calendar-week__wrapper');
      if (elapsedMs > 3000) return;
      if (!el) this.initScrollbar(elapsedMs + 50);
      else {
        this.scrollbar = new PerfectScrollbar(el);
        this.scrollbar.update();
      }
    },

    filterOutFullDayEvents() {
      const fullDayEvents = [];
      const allOtherEvents = [];

      for (const scheduleEvent of this.events) {
        if (scheduleEvent.time.start.match(DATE_TIME_STRING_PATTERN)) {
          allOtherEvents.push(scheduleEvent);
        } else if (
          scheduleEvent.time.start.match(DATE_TIME_STRING_FULL_DAY_PATTERN)
        ) {
          fullDayEvents.push(scheduleEvent);
        }
      }

      const weekEndDate =
        this.nDays === 5
          ? new Date(
              this.period.end.getFullYear(),
              this.period.end.getMonth(),
              this.period.end.getDate() - 2
            )
          : this.period.end;

      this.fullDayEvents = fullDayEvents.length
        ? eventPosition.positionFullDayEventsInWeek(
            this.period.start,
            weekEndDate,
            fullDayEvents
          )
        : [];
      this.events = allOtherEvents;
    },

    setDays() {
      const days = this.time
        .getCalendarWeekDateObjects(this.period.start)
        .map((day: Date) => {
          const dayName = this.time.getLocalizedNameOfWeekday(day, 'long');
          const dateTimeString = this.time.getDateTimeStringFromDate(
            day,
            'start'
          );
          const events = this.events.filter((event: eventInterface) => {
            const eventIsInDay = event.time.start.substring(0, 11) === dateTimeString.substring(0, 11);
            let eventIsInDayBoundaries = true;

            if (this.time.HOURS_PER_DAY !== 24) {
              const { hour: dayStartHour } = this.time.getHourAndMinutesFromTimePoints(this.time.DAY_START)
              const { hour: dayEndHour } = this.time.getHourAndMinutesFromTimePoints(this.time.DAY_END)
              const { hour: eventStartHour } = this.time.getAllVariablesFromDateTimeString(event.time.start)
              eventIsInDayBoundaries = eventStartHour >= dayStartHour && eventStartHour < dayEndHour;
            }

            return eventIsInDay && eventIsInDayBoundaries;
          });

          return { dayName, dateTimeString, events };
        });

      if (this.nDays === 5 && this.time.FIRST_DAY_OF_WEEK === 'monday') {
        // Delete Saturday & Sunday
        days.splice(5, 2);
        this.fullDayEvents.splice(5, 2);
      } else if (this.nDays === 5 && this.time.FIRST_DAY_OF_WEEK === 'sunday') {
        // First delete Saturday, then Sunday
        days.splice(6, 1);
        this.fullDayEvents.splice(6, 1);
        days.splice(0, 1);
        this.fullDayEvents.splice(0, 1);
      }

      this.days = days;
    },

    mergeFullDayEventsIntoDays() {
      for (const [dayIndex] of this.days.entries()) {
        this.days[dayIndex].fullDayEvents = this.fullDayEvents[dayIndex];
      }
    },

    setDay() {
      const dayDateTimeString = this.time.getDateTimeStringFromDate(
        this.period.selectedDate
      );
      // 1. Set the timed events
      this.days = [
        {
          dayName: new Date(this.period.selectedDate).toLocaleDateString(
            this.time.CALENDAR_LOCALE,
            { weekday: 'long' }
          ),
          dateTimeString: this.time.getDateTimeStringFromDate(
            this.period.selectedDate,
            'start'
          ),
          events: this.events.filter((event: eventInterface) => {
            return (
              event.time.start.substring(0, 11) ===
              dayDateTimeString.substring(0, 11)
            );
          }) as eventInterface[],
        },
      ];

      if (!this.fullDayEvents.length) return;

      // 2. Set full day events
      for (const day of this.fullDayEvents) {
        const dayDateString = this.time.getDateTimeStringFromDate(day.date);
        if (
          dayDateString.substring(0, 11) === dayDateTimeString.substring(0, 11)
        ) {
          this.fullDayEvents = [day];

          return;
        }
      }
    },

    setInitialEvents(mode: modeType) {
      if (mode === 'day') this.setDay();
      if (mode === 'week') this.setDays();

      this.mergeFullDayEventsIntoDays();
    },

    handleClickOnEvent(event: {
      eventElement: HTMLDivElement;
      clickedEvent: eventInterface;
    }) {
      this.$emit('event-was-clicked', event);

      this.selectedEventElement = event.eventElement;
      this.selectedEvent = event.clickedEvent;
    },

    handleEventWasDragged(event: eventInterface) {
      const cleanedUpEvent = event;
      // Reset all properties of the event, that need be calculated anew
      delete cleanedUpEvent.totalConcurrentEvents;
      delete cleanedUpEvent.nOfPreviousConcurrentEvents;

      const filteredEvents = this.events.filter((e) => e.id !== event.id);
      this.events = [
        cleanedUpEvent,
        ...filteredEvents.map((e) => {
          // Reset all properties of each event, that need be calculated anew
          delete e.nOfPreviousConcurrentEvents;
          delete e.totalConcurrentEvents;

          return e;
        }),
      ];
      this.setInitialEvents(this.mode);
      this.weekVersion = this.weekVersion + 1;

      this.$emit('event-was-dragged', event);
    },

    scrollOnMount() {
      // The scrollToHour option is not compatible with setting custom day boundaries
      if (this.time.HOURS_PER_DAY !== 24) return;

      const weekWrapper = document.querySelector('.calendar-week__wrapper');

      if (!weekWrapper) return;

      this.$nextTick(() => {
        const weekHeight = +this.weekHeight.split('p')[0];
        const oneHourInPixel = weekHeight / this.time.HOURS_PER_DAY;
        const hourToScrollTo = typeof this.config.week?.scrollToHour === 'number' ? this.config.week.scrollToHour : 8;
        const desiredNumberOfPixelsToScroll = oneHourInPixel * hourToScrollTo;
        weekWrapper.scroll(0, desiredNumberOfPixelsToScroll - 10); // -10 to display the hour in DayTimeline
      })
    },

    setDayIntervals() {
      if (this.config.dayIntervals) {
        for (const [key, value] of Object.entries(this.config.dayIntervals)) {
          this.dayIntervals[key] = value;
        }
      }

      this.setWeekHeightBasedOnIntervals();
    },

    setWeekHeightBasedOnIntervals() {
      // 1. Catch faulty configurations
      if (![15, 30, 60].includes(this.dayIntervals.length)) {
        this.dayIntervals.length = 60;
        this.dayIntervals.height = 66;
        console.warn(
          'The dayIntervals configuration is faulty. It has been reset to default values.'
        );
      }

      // 2. Set a multiplier, for getting length of an hour based on the interval length
      let intervalMultiplier = 1;
      if (this.dayIntervals.length === 15) intervalMultiplier = 4;
      if (this.dayIntervals.length === 30) intervalMultiplier = 2;

      // 3. Set height of the week based on the number and length of intervals
      this.weekHeight =
        this.dayIntervals.height * intervalMultiplier * this.time.HOURS_PER_DAY + 'px';
    },

    setCurrentTime() {
      const setTime = () => {
        const nowString = this.time.getDateTimeStringFromDate(new Date())
        const currentTimePercentage = this.time.getPercentageOfDayFromDateTimeString(nowString, this.time.DAY_START, this.time.DAY_END)

        if (currentTimePercentage < 0 || currentTimePercentage > 100) return this.showCurrentTime = false;

        this.showCurrentTime = true;
        this.currentTimePercentage = currentTimePercentage

      }
      setTime()
      setInterval(() => setTime(), 60000);
    },
  },
});
</script>

<style scoped lang="scss">
.calendar-week__wrapper {
  position: relative;
  padding-left: var(--qalendar-week-padding-left);
  overflow-y: auto;
}

.calendar-week {
  position: relative;
  width: 100%;
  flex: 1 1 auto;

  &__events {
    display: flex;
    width: 100%;
    height: v-bind(weekHeight);
    overflow: hidden;
  }

  .current-time-line {
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    z-index: 1;
    background-color: red;

    &__circle {
      position: relative;

      &::before {
        content: '';
        position: absolute;
        transform: translate(-45%, -45%);
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: red;
      }
    }
  }

  .custom-current-time {
    position: absolute;
    left: 0;
    width: 100%;
    z-index: 1;
  }
}
</style>
