<template>
  <div
    v-if="config.isSmall"
    class="calendar-month__event"
  />

  <template v-else>
    <div
      v-if="isCustomEvent"
      :id="elementId"
      class="is-event"
      data-ref="custom-event"
      :class="{ 'is-draggable': elementDraggableAttribute }"
      :draggable="elementDraggableAttribute"
      @dragstart="handleDragStart"
      @click="handleClickOnEvent"
    >
      <slot
        name="monthEvent"
        :event-data="calendarEvent"
      />
    </div>

    <div
      v-else
      :id="elementId"
      data-ref="default-event"
      class="calendar-month__event is-event"
      :class="{ 'is-draggable': elementDraggableAttribute }"
      :draggable="elementDraggableAttribute"
      @dragstart="handleDragStart"
      @click="handleClickOnEvent"
    >
      <span class="calendar-month__event-color" />

      <span
        v-if="eventTimeStart && !calendarEvent.originalEvent"
        class="calendar-month__event-time"
      >
        {{ eventTimeStart }}
      </span>

      <span class="calendar-month__event-title">
        {{ calendarEvent.title }}
      </span>
    </div>
  </template>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import Time from '../../helpers/Time';
import { type eventInterface } from '../../typings/interfaces/event.interface';
import { DATE_TIME_STRING_PATTERN, EVENT_COLORS } from '../../constants';
import { type configInterface } from '../../typings/config.interface';
import { type dayInterface } from '../../typings/interfaces/day.interface';

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

  emits: ['event-was-clicked'],

  data() {
    return {
      colors: EVENT_COLORS as { [key: string]: string },
      eventBackgroundColor: '',
      eventIdPrefix: 'calendar-month__event-',
    };
  },

  computed: {
    isCustomEvent(): boolean {
      if (Array.isArray(this.calendarEvent.isCustom)) {
        return this.calendarEvent.isCustom.includes('month');
      }

      return this.calendarEvent.isCustom || false;
    },

    eventTimeStart() {
      return DATE_TIME_STRING_PATTERN.test(this.calendarEvent.time.start)
        ? this.time.getLocalizedTime(this.calendarEvent.time.start)
        : null;
    },

    elementId() {
      return (
        this.eventIdPrefix +
        this.calendarEvent.id +
        this.time.dateStringFrom(this.day.dateTimeString)
      );
    },

    elementDraggableAttribute() {
      const {
        year: startYear,
        month: startMonth,
        date: startDate,
      } = this.time.getAllVariablesFromDateTimeString(
        this.calendarEvent.time.start
      );
      const {
        year: endYear,
        month: endMonth,
        date: endDate,
      } = this.time.getAllVariablesFromDateTimeString(
        this.calendarEvent.time.end
      );
      const eventIsSingleDay =
        startYear === endYear &&
        startMonth === endMonth &&
        startDate === endDate;

      const dragAndDropIsDisabled =
        this.calendarEvent.disableDnD &&
        this.calendarEvent.disableDnD.includes('month');

      return this.calendarEvent.isEditable &&
        eventIsSingleDay &&
        !dragAndDropIsDisabled
        ? true
        : undefined;
    },
  },

  mounted() {
    this.setColors();
  },

  methods: {
    setColors() {
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

.calendar-month__event {
  --event-inline-padding: 4px;

  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 4px;
  font-size: var(--qalendar-font-2xs);
  width: calc(100% - #{calc(var(--event-inline-padding) * 2)});
  margin-bottom: 4px;
  padding: 0.25rem var(--event-inline-padding);
  cursor: pointer;
  user-select: none;

  .calendar-month__event-time {
    margin-right: 6px;
  }

  .calendar-month__event-time,
  .calendar-month__event-title,
  .calendar-month__event-color {
    flex-shrink: 0;
  }

  .calendar-month__event-time,
  .calendar-month__event-title {
    .qalendar-is-small & {
      display: none;
    }
  }

  .qalendar-is-small & {
    background-color: v-bind(eventBackgroundColor);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    padding: 1px;
    margin-right: 1px;
  }

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

    @include mixins.hover {
      background-color: var(--qalendar-option-hover);
    }
  }

  .calendar-month__event-color {
    background-color: v-bind(eventBackgroundColor);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 4px;
  }
}
</style>
