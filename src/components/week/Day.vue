<template>
  <div class="calendar-week__day">
    <DayEvent
      v-for="(event, eventIndex) in events"
      :key="eventIndex"
      :event-prop="event"
      :day="day"
      :time="time"
      :config="config"
      :day-info="dayInfo"
      :mode="mode"
      @event-was-clicked="$emit('event-was-clicked', $event)"
      @event-was-dragged="$emit('event-was-dragged', $event)"
      @event-was-resized="handleEventWasResized"
    />

    <div v-if="dayIntervals"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { dayInterface } from '../../typings/interfaces/day.interface';
import DayEvent from './DayEvent.vue';
import EventConcurrency from '../../helpers/EventConcurrency';
import { eventInterface } from '../../typings/interfaces/event.interface';
import Time from '../../helpers/Time';
import {
  configInterface,
  dayIntervalsType,
} from '../../typings/config.interface';
import { modeType } from '../../typings/types';
const eventConcurrencyHelper = new EventConcurrency();

export default defineComponent({
  name: 'Day',

  components: { DayEvent },

  props: {
    day: {
      type: Object as PropType<dayInterface>,
      required: true,
    },
    time: {
      type: Object as PropType<Time>,
      required: true,
    },
    config: {
      type: Object as PropType<configInterface>,
      required: true,
    },
    dayInfo: {
      type: Object as PropType<{ daysTotalN: number; thisDayIndex: number }>,
      required: true,
    },
    mode: {
      type: String as PropType<modeType>,
      required: true,
    },
    dayIntervals: {
      type: Object as PropType<dayIntervalsType>,
      required: true,
    },
  },

  emits: ['event-was-clicked', 'event-was-resized', 'event-was-dragged'],

  data() {
    return {
      events: [] as eventInterface[],
    };
  },

  mounted() {
    this.calculateEventConcurrency();
  },

  methods: {
    calculateEventConcurrency() {
      this.events = eventConcurrencyHelper.calculateConcurrencyForEvents(
        this.day.events
      );
    },

    handleEventWasResized(event: any) {
      this.$emit('event-was-resized', event);
      this.calculateEventConcurrency();
    },
  },
});
</script>

<style scoped lang="scss">
.calendar-week__day {
  position: relative;
  width: 100%;
  height: 100%;

  &:first-child {
    border-left: 1px dashed rgb(224, 224, 224);
  }

  &:not(:last-child) {
    border-right: 1px dashed rgb(224, 224, 224);
  }

  .calendar-week__day-interval {
  }
}
</style>
