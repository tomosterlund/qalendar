<template>
  <div
    v-if="scheduleEvent"
    class="week-timeline__event"
    :style="{
      width: `calc(${scheduleEvent.nDays * 100}% - 6px)`,
      color: eventColor,
      backgroundColor: eventBackgroundColor,
    }"
  >
    {{ scheduleEvent.title }}
  </div>

  <div v-else class="week-timeline__event"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { eventInterface } from '../../typings/interfaces/event.interface';
import { configInterface } from '../../typings/config.interface';
import { EVENT_COLORS } from '../../constants';

interface extendedEventInterface extends eventInterface {
  nDays: number;
}

export default defineComponent({
  name: 'FullDayEvent',

  props: {
    scheduleEvent: {
      type: Object as PropType<extendedEventInterface>,
      default: null,
    },
    config: {
      type: Object as PropType<configInterface>,
      required: true,
    },
  },

  data() {
    return {
      colors: EVENT_COLORS as { [key: string]: string },
      eventColor: '#fff',
      eventBackgroundColor: '',
    };
  },

  mounted() {
    this.setColors();
  },

  methods: {
    setColors() {
      // First, if the event has a customColorScheme, and the name of that
      if (
        this.scheduleEvent?.colorScheme &&
        this.config.style?.colorSchemes &&
        this.config.style.colorSchemes[this.scheduleEvent.colorScheme]
      ) {
        this.eventColor =
          this.config.style.colorSchemes[this.scheduleEvent.colorScheme].color;
        return (this.eventBackgroundColor =
          this.config.style.colorSchemes[
            this.scheduleEvent.colorScheme
          ].backgroundColor);
      }

      if (this.scheduleEvent?.color) {
        this.eventColor = '#fff';
        return (this.eventBackgroundColor =
          this.colors[this.scheduleEvent.color]);
      }

      return (this.eventBackgroundColor = this.colors.blue);
    },
  },
});
</script>

<style lang="scss" scoped>
.week-timeline__event {
  position: relative;
  z-index: 1;
  // If the variable changes, so does the hard coded value of the (padding * 2), in inline styles above
  --event-padding: 3px;

  height: 0.8rem;
  width: calc(100% - #{var(--event-padding)});
  font-size: var(--qalendar-font-2xs);
  border-radius: 4px;
  padding: var(--event-padding);
  margin-bottom: 0.25em;
  text-align: left;
}
</style>
