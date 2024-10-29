<template>
  <div class="agenda__wrapper">
    <header class="agenda__header">
      <div class="agenda__header-day-name">
        {{ day.dayName }}
      </div>
      <div class="agenda__header-date">
<!--        Here we want to display leading zero for days 1-9, in order to prevent layout shifts-->
        {{ day.dateTimeString.substring(8, 10) }}
      </div>
    </header>
    <div class="agenda__content">
      <div
        v-if="day.events.length === 0"
        class="is-empty"
      >
        {{ getLanguage(languageKeys['noEvent'], time.CALENDAR_LOCALE) }}
      </div>
      <div
        v-else
        class="agenda__content-events-list"
      >
        <AgendaEventTile
          v-for="dayEvent of day.events"
          :key="`agenda_event_` + dayEvent.id"
          :day="day"
          :config="config"
          :calendar-event="dayEvent"
          :time="time"
          @event-was-clicked="$emit('event-was-clicked', $event)"
          >
          <template #agendaEvent="{ eventData }">
            <slot
              :event-data="eventData"
              name="agendaEvent"
            />
          </template>
        </AgendaEventTile>
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
  name: 'AgendaEvents',

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
    },
  },

  emits: [
    'event-was-clicked',
  ],
});
</script>

<style lang="scss" scoped>

.agenda__wrapper {
  display: flex;
  flex-flow: row;
  padding: 10px 5px 0;

  .agenda__header {
    padding-right: 10px;

    .agenda__header-day-name {
      text-align: center;
      color: var(--qalendar-theme-color);
      font-size: var(--qalendar-font-xs);
      font-weight: bold;
    }

    .agenda__header-date {
      height: fit-content;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px;
      border-radius: 4px;
      background-color: var(--qalendar-theme-color);
      color: white;
      font-weight: 600;
      font-size: var(--qalendar-font-m);
    }
  }

  .agenda__content {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: auto;

    .is-empty {
      min-height: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
