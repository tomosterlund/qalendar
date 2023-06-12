<template>
  <div class="week-timeline">
    <div
      v-for="(day, dayIndex) in days"
      :key="dayIndex"
      class="week-timeline__day"
      :class="{
        'is-today':
          time.getDateTimeStringFromDate(now, 'start') === day.dateTimeString,
      }"
      @click="$emit('day-was-clicked', time.dateStringFrom(day.dateTimeString))"
    >
      <div class="week-timeline__day-name">
        {{ day.dayName.substring(0, 2).toUpperCase() }}
      </div>

      <div class="week-timeline__date">
        {{ getDaysDate(day) }}
      </div>

      <div class="week-timeline__events">
        <template
          v-for="(event, key) in day.fullDayEvents"
          :key="key"
        >
          <FullDayEvent
            v-if="key !== 'date'"
            :schedule-event="typeof event === 'object' ? event : null"
            :config="config"
            :mode="mode"
            @event-was-clicked="$emit('event-was-clicked', $event)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { type dayInterface } from '../../typings/interfaces/day.interface';
import Time from '../../helpers/Time';
import { type dayWithFullDayEvents } from '../../typings/interfaces/full-day-events-week.type';
import FullDayEvent from './FullDayEvent.vue';
import { type configInterface } from '../../typings/config.interface';
import { type modeType } from '../../typings/types';

export default defineComponent({
  name: 'WeekTimeline',

  components: { FullDayEvent },

  props: {
    days: {
      type: Array as PropType<dayInterface[]>,
      required: true,
    },
    time: {
      type: Object as PropType<Time>,
      required: true,
    },
    fullDayEvents: {
      type: Array as PropType<dayWithFullDayEvents[]>,
      default: () => [],
    },
    config: {
      type: Object as PropType<configInterface>,
      required: true,
    },
    mode: {
      type: String as PropType<modeType>,
      required: true,
    },
  },

  emits: ['event-was-clicked', 'day-was-clicked'],

  data() {
    return {
      now: new Date(),
    };
  },

  methods: {
    getDaysDate(day: dayInterface) {
      const { date } = this.time.getAllVariablesFromDateTimeString(
        day.dateTimeString
      );

      return date;
    },
  },
});
</script>

<style scoped lang="scss">
.week-timeline {
  height: fit-content;
  display: flex;
  justify-content: space-evenly;
  padding-bottom: var(--qalendar-spacing-half);
  padding-left: var(--qalendar-week-padding-left);
  border-bottom: var(--qalendar-border-gray-thin);

  .mode-is-day & {
    width: 100%;
    padding-left: 0;
  }

  &__day {
    width: 100%;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: flex-start;
  }

  &__day-name {
    font-size: var(--qalendar-font-3xs);
    font-weight: 400;
    margin-bottom: 4px;
    color: var(--qalendar-gray-quite-dark);
  }

  &__date {
    font-size: 1.2rem;
    margin-bottom: 4px;
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .is-today & {
      background-color: var(--qalendar-blue);
      color: #fff;
    }
  }

  &__events {
    width: 100%;
    flex: 1;
    border-right: 1px dashed rgb(224 224 224);

    .week-timeline__day:first-child & {
      border-left: 1px dashed rgb(224 224 224);
    }
  }
}
</style>
