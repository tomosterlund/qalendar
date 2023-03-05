<template>
  <div class="calendar-month">
    <div class="calendar-month__weeks">
      <div
        v-for="(week, weekIndex) in month"
        :key="weekIndex"
        class="calendar-month__week"
      >
        <Day
          v-for="(day, dayIndex) in week"
          :key="dayIndex"
          :is-first-week="weekIndex === 0"
          :config="config"
          :day="day"
          :time="time"
          @event-was-clicked="handleClickOnEvent"
          @event-was-dragged="handleEventWasDragged"
          @day-was-clicked="$emit('day-was-clicked', $event)"
          @updated-period="$emit('updated-period', $event)"
        >
          <template #monthEvent="p">
            <slot
              :event-data="p.eventData"
              name="monthEvent"
            />
          </template>
          <template #dayCell="{dayData}">
            <slot
              :day-data="dayData"
              name="dayCell"
            />
          </template>
        </Day>
      </div>
    </div>

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
        />
      </template>
    </EventFlyout>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Day from './Day.vue';
import Time from '../../helpers/Time';
import { periodInterface } from '../../typings/interfaces/period.interface';
import { configInterface } from '../../typings/config.interface';
import { eventInterface } from '../../typings/interfaces/event.interface';
import EDate from '../../helpers/EDate';
import { dayInterface } from '../../typings/interfaces/day.interface';
import EventFlyout from '../partials/EventFlyout.vue';
import {
  DATE_TIME_STRING_FULL_DAY_PATTERN,
  DATE_TIME_STRING_PATTERN,
} from '../../constants';
import EventPosition from '../../helpers/EventPosition';
const EventPositionHelper = new EventPosition();
import PerfectScrollbar from 'perfect-scrollbar';

export default defineComponent({
  name: 'Month',

  components: {
    Day,
    EventFlyout,
  },

  props: {
    config: {
      type: Object as PropType<configInterface>,
      required: true,
    },
    time: {
      type: Object as PropType<Time>,
      required: true,
    },
    period: {
      type: Object as PropType<periodInterface>,
      required: true,
    },
    eventsProp: {
      type: Array as PropType<eventInterface[]>,
      default: () => [],
    },
  },

  emits: [
    'edit-event',
    'delete-event',
    'updated-period',
    'event-was-clicked',
    'event-was-dragged',
    'day-was-clicked',
  ],

  data() {
    return {
      month: [] as dayInterface[][],
      selectedEvent: null as eventInterface | null,
      selectedEventElement: null as any | null,
      events: this.eventsProp,
      fullDayEvents: [] as eventInterface[],
      scrollbar: null as any,
    };
  },

  mounted() {
    this.initMonth();
    this.initScrollbar();
    console.log(this.$slots);
  },

  methods: {
    initScrollbar(elapsedMs = 0) {
      const el = document.querySelector('.calendar-month');
      if (elapsedMs > 3000) return;
      if (!el) this.initScrollbar(elapsedMs + 50);
      else {
        this.scrollbar = new PerfectScrollbar(el);
        this.scrollbar.update();
      }
    },

    initMonth() {
      this.month = [];

      this.sortOutFullDayEvents();
      this.setMonth();
    },



    setMonth() {
      const { month, fullYear } = new EDate(this.period.selectedDate);
      const calendarMonth = this.time.getCalendarMonthSplitInWeeks(
        fullYear,
        month
      );

      const monthWithEvents = calendarMonth.map((week) => {
        return week.map((day) => {
          const dateTimeString = this.time.getDateTimeStringFromDate(day);
          const events = this.events.filter((event) => {
            return (
              event.time.start.substring(0, 11) ===
              dateTimeString.substring(0, 11)
            );
          });

          return {
            isTrailingOrLeadingDate: this.time.isTrailingOrLeadingDate(day, month),
            dayName: this.time.getLocalizedNameOfWeekday(day),
            dateTimeString: this.time.getDateTimeStringFromDate(day),
            events: events,
          };
        });
      });

      this.month = EventPositionHelper.positionFullDayEventsInMonth(
        monthWithEvents,
        this.fullDayEvents
      );
    },

    sortOutFullDayEvents() {
      const timedEvents = [];
      const fullDayEvents = [];

      for (const calendarEvent of this.events) {
        if (DATE_TIME_STRING_PATTERN.test(calendarEvent.time.start))
          timedEvents.push(calendarEvent);
        else if (
          DATE_TIME_STRING_FULL_DAY_PATTERN.test(calendarEvent.time.start)
        )
          fullDayEvents.push(calendarEvent);
      }

      this.events = timedEvents;
      this.fullDayEvents = fullDayEvents;
    },

    handleClickOnEvent(event: {
      eventElement: HTMLDivElement;
      clickedEvent: eventInterface;
    }) {
      this.$emit('event-was-clicked', event);

      this.selectedEventElement = event.eventElement;
      this.selectedEvent = event.clickedEvent;
    },

    handleEventWasDragged(calendarEvent: eventInterface) {
      this.$emit('event-was-dragged', calendarEvent);
      const newEvents = [...this.events, ...this.fullDayEvents].filter(
        (e) => e.id !== calendarEvent.id
      );
      newEvents.push(calendarEvent);
      this.events = [];
      this.fullDayEvents = [];
      this.events = newEvents;
      this.initMonth();
    },
  },
});
</script>

<style lang="scss" scoped>
.calendar-month {
  position: relative;
  flex: 1;
  width: 100%;
  overflow-y: auto;

  .calendar-month__weeks {
    height: 100%;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
  }

  .calendar-month__week {
    display: flex;
    flex: 1;

    .qalendar-is-small & {
      display: block;
    }
  }
}
</style>
