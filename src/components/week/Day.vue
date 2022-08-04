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

    <template v-if="dayIntervals && dayIntervals.displayClickableInterval">
      <div
        v-for="interval in intervals"
        :key="interval.intervalStart"
        class="calendar-week__day-interval"
        :class="{ 'has-border': interval.hasBorder }"
        :style="intervalStyles"
        @click="handleClickOnInterval(interval)"
      >
        {{ time.getLocalizedTime(interval.intervalStart) }}
      </div>
    </template>
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
import DayIntervals, { interval } from '../../helpers/DayIntervals';
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

  emits: [
    'event-was-clicked',
    'event-was-resized',
    'event-was-dragged',
    'interval-was-clicked',
  ],

  data() {
    return {
      events: [] as eventInterface[],
      intervals: new DayIntervals(
        this.dayIntervals.length || 60,
        this.day.dateTimeString
      ).getIntervals(),
    };
  },

  computed: {
    intervalStyles() {
      return this.config.dayIntervals?.intervalStyles
        ? this.config.dayIntervals.intervalStyles
        : {};
    },
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

    handleClickOnInterval(payload: interval) {
      const { intervalStart, intervalEnd } = payload;
      this.$emit('interval-was-clicked', { intervalStart, intervalEnd });
    },
  },
});
</script>

<style scoped lang="scss">
.calendar-week__day {
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;

	.calendar-week__day-interval {
		flex: 1;
		font-size: var(--qalendar-font-xs);
		color: var(--qalendar-gray);
		padding: 2px;

		&.has-border {
			border-bottom: var(--qalendar-border-dashed-gray-thin);
		}
	}

	&:first-child {
		border-left: 1px dashed rgb(224 224 224);
	}

	&:not(:last-child) {
		border-right: 1px dashed rgb(224 224 224);
	}
}
</style>
