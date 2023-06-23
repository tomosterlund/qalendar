<template>
  <div class="day-timeline">
    <div
      v-for="hour in timelineHours"
      :key="hour"
      class="day-timeline__hour"
    >
      <span class="day-timeline__hour-text">
        {{ getLocaleTimeString(hour) }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { DAY_TIME_POINT } from '../../typings/config.interface';
import Time from '../../helpers/Time';

export default defineComponent({
  name: 'DayTimeline',

  props: {
    time: {
      type: Object as PropType<Time>,
      required: true,
    },
    weekHeight: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      availableHours: [
        0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
        1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300,
      ] as DAY_TIME_POINT[],
      timelineHours: [] as DAY_TIME_POINT[],
    };
  },

  mounted() {
    this.timelineHours = this.time.getTimelineHours();
  },

  methods: {
    getLocaleTimeString(time: DAY_TIME_POINT): string {
      const { hour } = this.time.getHourAndMinutesFromTimePoints(time);

      return this.time.getLocalizedHour(new Date(2100, 1, 1, hour));
    },
  }
});
</script>

<style scoped lang="scss">
@use '../../styles/_mixins.scss' as mixins;

.day-timeline {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% + 10px);
  height: v-bind(weekHeight);
  transform: translateX(-10px);
  display: flex;
  flex-flow: column;
  justify-content: space-evenly;

  &__hour {
    padding-left: 4px;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    height: 100%;
    font-size: clamp(10px, 0.625rem, 14px);
    color: var(--qalendar-gray-quite-dark);

    &-text {
      line-height: 0;
      transform: translate(-40px, 0);
    }

    &:first-child {
      .day-timeline__hour-text {
        display: none;
      }
    }

    &:not(:last-child) {
      border-bottom: var(--qalendar-border-gray-thin);

      @include mixins.dark-mode {
        border-color: var(--qalendar-dark-mode-line-color);
      }
    }
  }
}
</style>
