<template>
  <div
    name="AgendaEvent"
    :event-data="calendarEvent"
    class="agenda__event is-event"
    @click.prevent="handleClickOnEvent"
  >
    <span
      v-if="eventTimeStart && !calendarEvent.originalEvent"
      class="agenda__event-time"
    >
      {{ eventTimeStart }}
    </span>

    <span class="agenda__event-title">
      {{ calendarEvent.title }}
    </span>
  </div>
</template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import Time from '../../helpers/Time';
  import { eventInterface } from '../../typings/interfaces/event.interface';
  import { DATE_TIME_STRING_PATTERN, EVENT_COLORS } from '../../constants';
  import { configInterface } from '../../typings/config.interface';
  import { dayInterface } from '../../typings/interfaces/day.interface';
  
  export default defineComponent({
    name: 'Event',
  
    props: {
      time: {
        type: Object as PropType<Time>,
        required: true,
      },
      calendarEvent: {
        type: Object as PropType<eventInterface>,
        required: true,
      },
      config: {
        type: Object as PropType<configInterface>,
        required: true,
      },
      day: {
        type: Object as PropType<dayInterface>,
        required: true,
      },
    },
  
  
    data() {
      return {
        colors: EVENT_COLORS as { [key: string]: string },
        eventBackgroundColor: '',
        eventIdPrefix: 'agenda__event-',
      };
    },
  
    computed: {
  
      eventTimeStart() {
        return DATE_TIME_STRING_PATTERN.test(this.calendarEvent.time.start)
          ? this.time.getLocalizedTime(this.calendarEvent.time.start)
          : null;
      },
  
      elementId() {
        return (
          this.eventIdPrefix +
          this.calendarEvent.id +
          this.day.dateTimeString.substring(0, 10)
        );
      },
  
  
    },
  
    mounted() {
      this.setColors();
    },
  
    methods: {
      setColors() {
        // First, if the event has a customColorScheme, and the name of that
        if (
          this.calendarEvent?.colorScheme &&
          this.config.style?.colorSchemes &&
          this.config.style.colorSchemes[this.calendarEvent.colorScheme]
        ) {
          return (this.eventBackgroundColor =
            this.config.style.colorSchemes[
              this.calendarEvent.colorScheme
            ].backgroundColor);
        }
  
        if (this.calendarEvent?.color) {
          return (this.eventBackgroundColor =
            this.colors[this.calendarEvent.color]);
        }
  
        return (this.eventBackgroundColor = this.colors.blue);
      },
  
      handleClickOnEvent() {
        const eventElement = document.getElementById(this.elementId);
  
        this.$emit('event-was-clicked', {
          clickedEvent: this.calendarEvent,
          eventElement,
        });
      },
  
      handleDragStart(dragEvent: DragEvent) {
        if (!dragEvent || !dragEvent.dataTransfer) return;
  
        dragEvent.dataTransfer.effectAllowed = 'move';
        dragEvent.dataTransfer.setData(
          'json',
          JSON.stringify(this.calendarEvent)
        );
      },
    },
  });
  </script>
  
  <style lang="scss" scoped>
  @use '../../styles/mixins' as mixins;
  
  .agenda__event {
    --event-inline-padding: 4px;
    background-color: v-bind(eventBackgroundColor);
    display: flex;
    flex-flow: column;
    justify-content: start;
    border-radius: 4px;
    font-size: var(--qalendar-font-2xs);
    margin-bottom: 4px;
    padding: 2px;
    cursor: pointer;
    user-select: none;
    color: white;
  
  
    &.is-draggable {
      cursor: grab;
    }
  
    &:active {
      z-index: 100;
    }
  
    &:not(.is-draggable) {
      &:active {
        cursor: not-allowed;
      }
    }
  
    @include mixins.hover {
      background-color: var(--qalendar-light-gray);
    }
  
  
  }
  </style>
  