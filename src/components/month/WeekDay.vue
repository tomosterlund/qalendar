<template>
  <div>
    <span
     
      class="calendar-month__day-name"
    >
      {{ day.dayName }}
    </span>
  </div>
</template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { configInterface } from '../../typings/config.interface';
  import Time from '../../helpers/Time';
  import { dayInterface } from '../../typings/interfaces/day.interface';
  import getLanguage from '../../language/index';
  
  export default defineComponent({
    name: 'WeekDay',
  
   
  
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

  
    },
  });
  </script>
  
  <style lang="scss" scoped>
  @mixin dayBase {
    height: 100%;
    flex: 1;
    display: flex;
    flex-flow: column;
    align-items: center;
    border-right: var(--qalendar-border-gray-thin);
    border-bottom: var(--qalendar-border-gray-thin);
  }
  
  .calendar-month__weekday {
      @include dayBase;
  
      overflow: hidden;
      transition: background-color 0.2s ease-in-out;
  
      &.is-droppable {
      background-color: var(--qalendar-light-gray);
    }
  
    &:last-child {
      border-right: 0;
    }
  
    .qalendar-is-small & {
      height: auto;
      min-height: 7rem;
      border-right: 0;
    }
  
    .calendar-month__day-name,
    .calendar-month__day-date {
      font-size: var(--qalendar-font-xs);
      color: var(--qalendar-gray-quite-dark);
  
      &:first-child {
        margin-top: 6px;
      }
    }
  
    .calendar-month__event-wrapper {
      width: 100%;
    }
  
    .calendar-month__weekday-more {
      font-size: var(--qalendar-font-2xs);
      width: 100%;
      padding-left: 4px;
      color: var(--qalendar-gray-quite-dark);
      cursor: pointer;
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
  