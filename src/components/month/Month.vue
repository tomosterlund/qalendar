<template>
  <div class="calendar-month">
    <div class="calendar-month__week-dayNames">
      <WeekDay
        v-for="(day, dayIndex) in month[0]"
        :key="dayIndex"
        class="calendar-month__week-dayName"
        :config="config"
        :day="day"
        :time="time"
      />
    </div>
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
          :selected="selectedDay?.dateTimeString===day.dateTimeString"
          @event-was-clicked="handleClickOnEvent"
          @event-was-dragged="handleEventWasDragged"
          @day-was-clicked="onDayWasClicked"
          @updated-period="$emit('updated-period', $event)"
        >
          <template #monthEvent="{eventData}">
            <slot
              :event-data="eventData"
              name="monthEvent"
            />
          </template>
        </Day>
      </div>
    </div>

    <div
      v-if="!(config.month?.showEventsOnMobileView===false)"
      class="calendar-month__day_events"
    >
      <MonthDayEvents
        v-if="selectedDay"
        :config="config"
        :time="time"
        :day="selectedDay"
        @event-was-clicked="handleClickOnEvent"
      />
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
import {defineComponent, PropType} from 'vue';
import Day from './Day.vue';
import Time from '../../helpers/Time';
import {periodInterface} from '../../typings/interfaces/period.interface';
import {configInterface} from '../../typings/config.interface';
import {EVENT_TYPE, eventInterface} from '../../typings/interfaces/event.interface';
import EDate from '../../helpers/EDate';
import {dayInterface} from '../../typings/interfaces/day.interface';
import EventFlyout from '../partials/EventFlyout.vue';
import EventPosition from '../../helpers/EventPosition';
import PerfectScrollbar from 'perfect-scrollbar';
import WeekDay from './WeekDay.vue';
import MonthDayEvents from './MonthDayEvents.vue'
import Helpers from "../../helpers/Helpers";

const EventPositionHelper = new EventPosition();

export default defineComponent({
  name: 'Month',

  components: {
    Day,
    EventFlyout,
    WeekDay,
    MonthDayEvents
},

  props: {
    config: {
      type: Object as PropType<configInterface>,
      required: true,
    },
    isSmall:{
      type: Boolean,
      required:true
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
      selectedDay: null as dayInterface|null,
    };
  },

  mounted() {
    this.initMonth();
    this.initScrollbar();
  },

  methods: {
    onDayWasClicked(day: dayInterface){
      this.selectedDay =day
      this.$emit('day-was-clicked', day)
    },
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
            return this.time.dateStringsHaveEqualDates(event.time.start, dateTimeString)
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
        if (Helpers.getEventType(calendarEvent, this.time) === EVENT_TYPE.SINGLE_DAY_TIMED)
          timedEvents.push(calendarEvent);
        else {
          fullDayEvents.push(calendarEvent);
        }
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
  display: flex;
  flex-flow: column;
  flex: 1;
  width: 100%;
  overflow-y: auto;

  .qalendar-is-small & {
    overflow-y:hidden;
  }

  .calendar-month__week-dayNames{

    display: flex;
    justify-content: space-between;
    .calendar-month__week-dayName{
      flex-grow: 1;
      text-align: center;
    }
  }
  .calendar-month__weeks {
    height: 100%;
    flex-grow: 1;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
  }

  .calendar-month__week {
    display: flex;
    flex: 1;

    .qalendar-is-small & {
      display: flex;
    }
  }
  .calendar-month__day_events{
    display: none;

    .qalendar-is-small & {
      display: block;
    }
  }
}
</style>
