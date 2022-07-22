<template>
  <div class="date-picker-parent">
    <DatePicker
      locale="de-DE"
      first-day-of-week="monday"
      :disable-dates="disableDates"
      :default-date="new Date(2022, 4, 1)"
      @updated="updateDate"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DatePicker from '../src/components/header/DatePicker.vue';

export default defineComponent({
  name: 'DatePickerApp',

  components: { DatePicker },

  data() {
    return {
      disableDates: {
        before: new Date(2022, 4, 1),
        after: new Date(2022, 4, 31),
      }
    };
  },

  methods: {
    updateDate(payload: { year: number; month: number; date: number }) {
      const { year, month, date } = payload;
      console.log(`${year}-${month}-${date}`);
    },
  },
});
</script>

<style lang="scss" scoped>
.date-picker-parent {
  font-family: Verdana, sans-serif;
}
</style>
