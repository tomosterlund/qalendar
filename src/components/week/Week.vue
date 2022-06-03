<template>
  <WeekTimeline :days="days" :time="time" />

  <div class="calendar-week__wrapper">
    <section class="calendar-week">
      <DayTimeline :key="period.start + period.end + mode" :time="time" />

      <div class="calendar-week__events">
        <Day
          v-for="day in days"
          :key="day.dateTimeString + mode"
          :day="day"
          :time="time"
          :config="config"
          @event-was-clicked="handleClickOnEvent"
          @event-was-resized="$emit('event-was-resized', $event)"
        />
      </div>
    </section>

    <EventFlyout
      :calendar-event-prop="selectedEvent"
      :event-element="selectedEventElement"
      :time="time"
      :config="config"
      @hide="selectedEvent = null"
      @edit-event="$emit('edit-event', $event)"
      @delete-event="$emit('edit-event', $event)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { configInterface } from "../../typings/config.interface";
import DayTimeline from "./DayTimeline.vue";
import { periodInterface } from "../../typings/interfaces/period.interface";
import { dayInterface } from "../../typings/interfaces/day.interface";
import WeekTimeline from "./WeekTimeline.vue";
import Day from "./Day.vue";
import EventFlyout from "../partials/EventFlyout.vue";
import { eventInterface } from "../../typings/interfaces/event.interface";
import Time from "../../helpers/Time";
import { WEEK_HEIGHT } from "../../constants";

export default defineComponent({
  name: "Week",

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
    events: {
      type: Array as PropType<eventInterface[]>,
      default: () => [],
    },
    period: {
      type: Object as PropType<periodInterface>,
      required: true,
    },
    nDays: {
      type: Number as PropType<5 | 7>,
      default: 5,
    },
    modeProp: {
      type: String as PropType<"day" | "week" | "month">,
      default: "week",
    },
    time: {
      type: Object as PropType<Time | any>,
      required: true,
    },
  },

  emits: [
    "event-was-clicked",
    "event-was-resized",
    "edit-event",
    "delete-event",
  ],

  data() {
    return {
      days: [] as dayInterface[],
      mode: this.modeProp as "day" | "week" | "month",
      selectedEvent: null as eventInterface | null,
      selectedEventElement: null as any | null,
      weekHeight: WEEK_HEIGHT + "px",
    };
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
    this.setInitialEvents(this.modeProp);
    this.scrollOnMount();
  },

  methods: {
    setDays() {
      // TODO: Refactor and use map, after first having filtered out all events that are not in the period
      const days = this.time
        .getCalendarWeekDateObjects(this.period.start)
        .map((day: Date) => {
          const dayName = this.time.getLocalizedNameOfWeekday(day, "long");
          const dateTimeString = this.time.getDateTimeStringFromDate(
            day,
            "start"
          );
          const events = this.events.filter((event: eventInterface) => {
            return (
              event.time.start.substring(0, 11) ===
              dateTimeString.substring(0, 11)
            );
          });

          return { dayName, dateTimeString, events };
        });

      if (this.nDays === 5 && this.time.FIRST_DAY_OF_WEEK === "monday") {
        // Delete Saturday & Sunday
        days.splice(5, 2);
      } else if (this.nDays === 5 && this.time.FIRST_DAY_OF_WEEK === "sunday") {
        // First delete Saturday, then Sunday
        days.splice(6, 1);
        days.splice(0, 1);
      }

      this.days = days;
    },

    setDay() {
      // Since we will still iterate over this.days for showing a single day, we'll initialize an array here too
      const days = [
        {
          dayName: new Date(this.period.selectedDate).toLocaleDateString(
            this.time.CALENDAR_LOCALE,
            { weekday: "long" }
          ),
          dateTimeString: this.time.getDateTimeStringFromDate(
            this.period.selectedDate,
            "start"
          ),
          events: [] as eventInterface[],
        },
      ];

      for (const calendarEvent of this.events) {
        const eventIsInPeriod =
          calendarEvent.time.start.substring(0, 10) ===
          this.time
            .getDateTimeStringFromDate(this.period.selectedDate)
            .substring(0, 10);
        if (!eventIsInPeriod) continue;

        for (const [dayIndex, day] of days.entries()) {
          const dayDate = day.dateTimeString.substring(0, 11);
          const eventDate = calendarEvent.time.start.substring(0, 11);

          if (dayDate === eventDate) days[dayIndex].events.push(calendarEvent);
        }
      }

      this.days = days;
    },

    setInitialEvents(mode: "day" | "week" | "month") {
      if (mode === "day") this.setDay();
      if (mode === "week") this.setDays();
    },

    handleClickOnEvent(event: {
      eventElement: HTMLDivElement;
      clickedEvent: eventInterface;
    }) {
      this.$emit("event-was-clicked", event);

      this.selectedEventElement = event.eventElement;
      this.selectedEvent = event.clickedEvent;
    },

    scrollOnMount() {
      const weekWrapper = document.querySelector(".calendar-week__wrapper");

      if (weekWrapper) {
        const scrollToHourFromConfig = this.config?.week?.scrollToHour;
        const scrollToHour = scrollToHourFromConfig
          ? scrollToHourFromConfig * 50
          : 400; // 400 for 08:00
        weekWrapper.scroll(0, scrollToHour - 10); // -10 to display the hour in DayTimeline
      }
    },
  },
});
</script>

<style scoped lang="scss">
.calendar-week__wrapper {
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
  }
}
</style>
