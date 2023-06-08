<template>
  <div class="agenda__wrapper">
    <div class="agenda__header">
      <div class="agenda__header-day-name">
        {{ day.dayName }}
      </div>
      <div class="agenda__header-day">
        {{ day.dateTimeString.substring(8, 10) }}
      </div>
    </div>
    <div class="agenda__content">
      <div v-if="day.events.length === 0">
        {{ getLanguage(languageKeys['noEvent'], time.CALENDAR_LOCALE) }}
      </div>
      <div
        v-else
        class="agenda__content-events-list"
      >
        <AgendaEventTile
          v-for="dayEvent of day.events"
          :key="`agenda_event_`+dayEvent.id"
          :day="day"
          :config="config"
          :calendar-event="dayEvent"
          :time="time"
          @event-was-clicked="$emit('event-was-clicked', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import Time from '../../helpers/Time';
import type { configInterface } from '../../typings/config.interface';
import type { dayInterface } from '../../typings/interfaces/day.interface';
import getLanguage from '../../language';
import AgendaEventTile from './AgendaEventTile.vue'
import PerfectScrollbar from "perfect-scrollbar";

export default defineComponent({
  name: 'MonthDayEvents',

  components: { AgendaEventTile },

  mixins: [getLanguage],

  props: {
    config: {
      type: Object as PropType<configInterface>,
      required: true,
    },
    time: {
      type: Object as PropType<Time>,
      required: true,
    },
    day: {
      type: Object as PropType<dayInterface>,
      required: true,
      default: null,
    },
  },

  emits: [
    'event-was-clicked',
  ],

  data() {
    return {
      scrollbar: null as null | PerfectScrollbar,
    };
  },
});
</script>

<style lang="scss" scoped>

.agenda__wrapper {
  display: flex;
  flex-flow: row;
  padding: 10px 5px 0 5px;

  .agenda__header {
    padding-right: 10px;

    .agenda__header-day-name {
      text-align: center;
      color: var(--qalendar-theme-color);
      font-size: var(--qalendar-font-xs);
      font-weight: bold;
    }

    .agenda__header-day {
      border-radius: 4px;
      background-color: var(--qalendar-theme-color);
      padding: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-weight: 600;
      height: fit-content;
      font-size: var(--qalendar-font-m);
    }
  }

  .agenda__content {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: auto;

    .agenda__content-events-list {
      width: 100%;
      height: auto;
      overflow-y: auto;
    }
  }
}
</style>
