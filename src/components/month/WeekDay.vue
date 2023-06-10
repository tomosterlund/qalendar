<template>
  <span
    class="calendar-month__day-name"
  >
    {{ day.dayName }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { dayInterface } from '../../typings/interfaces/day.interface';

export default defineComponent({
  name: 'WeekDay',

  props: {
    day: {
      type: Object as PropType<dayInterface>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.calendar-month__day-name {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--qalendar-gray-quite-dark);
  margin-bottom: var(--qalendar-spacing-half);
}
</style>
