<template>
  <div
    v-if="!hideLeadingAndTrailingDate"
    :id="'day-' + time.dateStringFrom(day.dateTimeString)"
    class="calendar-month__weekday"
    :class="{
      'is-droppable': canBeDropped,
      'trailing-or-leading': day.isTrailingOrLeadingDate ,
      'selected':selected
    }"
    @click="emitDayWasClicked"
    @dragleave="handleDragLeave"
    @dragover="handleDragOver"
    @drop="handleDrop"
    @dragend="handleDragEnd"
  >
    <span
      class="calendar-month__day-date"
    >
      {{ day.dateTimeString.substring(8, 10).startsWith('0')?day.dateTimeString.substring(9, 10): day.dateTimeString.substring(8, 10) }}
    </span>



    <div class="calendar-month_events">
      <template
        v-for="(calendarEvent, index) in day.events"
        :key="index"
      >
        <Event
          v-if="index < 3"
          :key="calendarEvent.id"
          :calendar-event="calendarEvent"
          :config="config"
          :time="time"
          :day="day"
          @event-was-clicked="$emit('event-was-clicked', $event)"
        >
          <template #monthEvent="p">
            <slot
              :event-data="p.eventData"
              name="monthEvent"
            />
          </template>
        </Event>
      </template>
      <div
        v-if="day.events.length >= 4"
        class="calendar-month__weekday-more"
        @click="getMoreEvents"
      >
        {{ getLanguage(languageKeys.moreEvents, time.CALENDAR_LOCALE) }}
      </div>
    </div>
  </div>

  <div
    v-else
    class="space-reserver"
  />
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { type configInterface } from '../../typings/config.interface';
import Time from '../../helpers/Time';
import Event from './Event.vue';
import { type dayInterface } from '../../typings/interfaces/day.interface';
import getLanguage from '../../language/index';
import { type eventInterface } from '../../typings/interfaces/event.interface';

export default defineComponent({
  name: 'Day',

  components: { Event },

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
    isFirstWeek: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },

  },

  emits: [
    'event-was-clicked',
    'event-was-dragged',
    'updated-period',
    'day-was-clicked',
  ],

  data() {
    return {
      isActiveDroppable: false,
    };
  },

  computed: {
    canBeDropped() {
      return this.isActiveDroppable;
    },

    hideLeadingAndTrailingDate() {
      return this.day.isTrailingOrLeadingDate === true && this.config.month?.showTrailingAndLeadingDates === false
    },
    selectedDayColor (){
      if(this.config?.month?.selectedDayColor!=null){
        return this.config.month.selectedDayColor
      }
      return 'var(--qalendar-light-gray)'
    }
  },

  methods: {
    getMoreEvents() {
      const { date, month, year } = this.time.getAllVariablesFromDateTimeString(
        this.day.dateTimeString
      );
      const selectedDate = new Date(year, month, date);
      const week = this.time.getCalendarWeekDateObjects(selectedDate);
      const start = week[0];
      const end = week[6];

      this.$emit('updated-period', { start, end, selectedDate });
    },

    handleDragLeave() {
      this.isActiveDroppable = false;
    },

    handleDragEnd(mouseEvent: DragEvent) {
      this.isActiveDroppable = false;
      mouseEvent.stopPropagation();
    },

    handleDrop(dropEvent: DragEvent) {
      this.isActiveDroppable = false;
      dropEvent.stopPropagation();

      if (!dropEvent || !dropEvent.dataTransfer) return;

      const calendarEvent: eventInterface = JSON.parse(
        dropEvent.dataTransfer.getData('json')
      );
      const eventDroppedOnSameDay = this.time.dateStringsHaveEqualDates(
        calendarEvent.time.start,
        this.time.dateStringFrom(this.day.dateTimeString),
      );
      if (eventDroppedOnSameDay) return;

      // Exchange the yyyy-mm-dd part of the string
      calendarEvent.time.start = calendarEvent.time.start.replace(
        /^\d{4}-\d{2}-\d{2}/,
        this.time.dateStringFrom(this.day.dateTimeString)
      );
      calendarEvent.time.end = calendarEvent.time.end.replace(
        /^\d{4}-\d{2}-\d{2}/,
        this.time.dateStringFrom(this.day.dateTimeString)
      );
      this.$emit('event-was-dragged', calendarEvent);
    },

    handleDragOver(e: DragEvent) {
      this.isActiveDroppable = true;
      e.preventDefault();

      return false;
    },

    emitDayWasClicked() {
      this.$emit('day-was-clicked', {...this.day,date: this.time.dateStringFrom(this.day.dateTimeString)});
      },
  },
});
</script>

<style lang="scss" scoped>
@mixin day-base {
  height: 100%;
  flex: 1;
  display: flex;
  flex-flow: column;
  align-items: center;
  border-right: var(--qalendar-border-gray-thin);
  border-bottom: var(--qalendar-border-gray-thin);
}



.calendar-month__weekday {
    @include day-base;

    overflow: hidden;
    transition: background-color 0.2s ease-in-out;

    &.is-droppable {
    background-color: var(--qalendar-light-gray);
  }

  &:last-child {
    border-right: 0;
  }

  &.selected{
    background-color: v-bind(selectedDayColor) ;
  }

  .qalendar-is-small & {
    height: 45px;
    width: 45px;
    display: flex;
    flex-flow: column;
    justify-content: space-around;
  }




  .calendar-month__day-name,
  .calendar-month__day-date {
    font-size: var(--qalendar-font-xs);
    color: var(--qalendar-gray-quite-dark);

    &:first-child {
      margin-top: 6px;
    }

  }
  .calendar-month_events{
    .qalendar-is-small & {
      display: flex ;
      flex-flow:row;
      width: 100%;
      justify-content: center;
    }
    .calendar-month__weekday-more{
      .qalendar-is-small & {
        display: none ;
      }
    }
  }


  .calendar-month__weekday-more {
    font-size: var(--qalendar-font-2xs);
    width: 100%;
    padding-left: 4px;
    color: var(--qalendar-gray-quite-dark);
    cursor: pointer;
  }
}

.space-reserver {
  @include day-base;

  border-right-color: transparent;

  + .calendar-month__weekday:not(.trailing-or-leading) {
    border-left: var(--qalendar-border-gray-thin);
  }
}

.space-reserver,
.trailing-or-leading {
  .qalendar-is-small & {
    display: none;
  }
}

.calendar-month__week:first-child {
  .space-reserver,
  .calendar-month__weekday {
    border-top: var(--qalendar-border-gray-thin);

    .qalendar-is-small & {
      border-top: 0;

      &:first-child {
        border-top: var(--qalendar-border-gray-thin);
      }
    }
  }
}
</style>
