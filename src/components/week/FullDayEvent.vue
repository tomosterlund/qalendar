<template>
  <div
    v-if="scheduleEvent"
    :id="`${eventElementIdPrefix}${scheduleEvent.id}`"
    class="week-timeline__event is-event"
    :style="{
      width: eventWidth,
      color: eventColor,
      backgroundColor: eventBackgroundColor,
      zIndex: 1,
    }"
    @click="handleClickOnEvent"
  >
    {{ scheduleEvent.title }}
  </div>

  <div
    v-else
    class="week-timeline__event"
  />
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { type eventInterface } from '../../typings/interfaces/event.interface';
import { type configInterface } from '../../typings/config.interface';
import { EVENT_COLORS } from '../../constants';
import { type modeType } from '../../typings/types';

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
    mode: {
      type: String as PropType<modeType>,
      required: true,
    },
  },

  emits: ['event-was-clicked'],

  data() {
    return {
      colors: EVENT_COLORS as { [key: string]: string },
      eventColor: '#fff',
      eventBackgroundColor: '',
      eventElementIdPrefix: 'week-timeline__event-id-',
    };
  },

  computed: {
    eventWidth() {
      if (this.mode !== 'day')
        return `calc(${this.scheduleEvent.nDays * 100}% - 6px)`;

      return 'calc(100% - 6px)';
    },
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

    handleClickOnEvent() {
      const eventElement = document.getElementById(
        this.eventElementIdPrefix + this.scheduleEvent.id
      );

      this.$emit('event-was-clicked', {
        clickedEvent: this.scheduleEvent,
        eventElement,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.week-timeline__event {
  position: relative;

  // If the variable changes, so does the hard coded value of the 100% - (padding * 2), in computed property above
  --event-padding: 3px;

  display: flex;
  align-items: center;
  height: 0.9rem;
  width: calc(100% - #{var(--event-padding)});
  font-size: var(--qalendar-font-2xs);
  border-radius: 4px;
  padding: var(--event-padding);
  margin-bottom: 0.25em;
  text-align: left;
  cursor: pointer;
  user-select: none;
  overflow: hidden;

  &:active {
    cursor: not-allowed;
  }
}
</style>
