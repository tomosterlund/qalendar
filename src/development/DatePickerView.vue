<template>
  <div class="date-picker-parent">
    <DatePicker
      locale="de-DE"
      first-day-of-week="sunday"
      @updated="updateDate"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DatePicker from "../components/header/DatePicker.vue";

export default defineComponent({
  name: "DatePickerApp",

  components: { DatePicker },

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
