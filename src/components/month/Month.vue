<template>
  <div class="calendar-month">
    <div
      class="calendar-month__week-day-names"
    >
      <WeekDay
        v-for="(day, dayIndex) in month[0]"
        :key="dayIndex"
        class="calendar-month__week-day-name"
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
          :config="config"
          :day="day"
          :time="time"
          :is-selected="selectedDay?.dateTimeString === day.dateTimeString"
          @event-was-clicked="handleClickOnEvent"
          @event-was-dragged="handleEventWasDragged"
          @date-was-clicked="$emit('date-was-clicked', $event)"
          @day-was-selected="selectedDay = $event"
          @updated-period="$emit('updated-period', $event)"
        >
          <template #monthEvent="{ eventData }">
            <slot
              :event-data="eventData"
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

    <div
      v-if="!(config.month?.showEventsOnMobileView === false)"
      class="calendar-month__day_events"
    >
      <AgendaEvents
        v-if="selectedDay"
        :config="config"
        :time="time"
        :day="selectedDay"
        @event-was-clicked="handleClickOnEvent"
      >
        <template #agendaEvent="{ eventData }">
            <slot
              :event-data="eventData"
              name="agendaEvent"
            />
          </template>
      </AgendaEvents>
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
import {defineComponent, type PropType} from 'vue';
import Day from './Day.vue';
import Time from '../../helpers/Time';
import {type periodInterface} from '../../typings/interfaces/period.interface';
import {type configInterface} from '../../typings/config.interface';
import {EVENT_TYPE, type eventInterface} from '../../typings/interfaces/event.interface';
import EDate from '../../helpers/EDate';
import {type dayInterface} from '../../typings/interfaces/day.interface';
import EventFlyout from '../partials/EventFlyout.vue';
import EventPosition from '../../helpers/EventPosition';
import PerfectScrollbar from 'perfect-scrollbar';
import WeekDay from './WeekDay.vue';
import Helpers from "../../helpers/Helpers";
import AgendaEvents from "./AgendaEvents.vue";

const EventPositionHelper = new EventPosition();

export default defineComponent({
  name: 'Month',

  components: {
    AgendaEvents,
    Day,
    EventFlyout,
    WeekDay,
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
    'date-was-clicked',
  ],

  data() {
    return {
      month: [] as dayInterface[][],
      selectedEvent: null as eventInterface | null,
      selectedEventElement: null as any | null,
      events: this.eventsProp,
      fullDayEvents: [] as eventInterface[],
      scrollbar: null as null | PerfectScrollbar,
      selectedDay: null as dayInterface | null,
    };
  },

  mounted() {
    this.initMonth();
    this.initScrollbar();
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
      if (this.config.isSmall) this.setInitialSelectedDay();
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

          // IMPORTANT: we explicitly do NOT separate fullDayEvents from other events here,
          // since all events are positioned in a similar manner in the month view
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

    setInitialSelectedDay() {
      const selectedDayDateString = this.time.getDateStringFromDate(this.period.selectedDate);
      this.selectedDay = this.month.flat().find(day => {
        return this.time.dateStringFrom(day.dateTimeString) === selectedDayDateString;
      }) || null;
    },
  },
});
</script>

<style lang="scss" scoped>
@use '../../styles/_mixins.scss' as mixins;

.calendar-month {
  position: relative;
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;

  .qalendar-is-small & {
    height: initial;
  }

  .calendar-month__week-day-names {
    display: flex;
    justify-content: space-between;

    .calendar-month__week-day-name {
      flex: 1;
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

    &:first-child {
      border-top: var(--qalendar-border-gray-thin);

      @include mixins.dark-mode {
        border-color: var(--qalendar-dark-mode-line-color);
      }
    }
  }

  .calendar-month__day_events {
    height: 100%;
    display: none;

    .qalendar-is-small & {
      display: block;
    }
  }
}
</style>
