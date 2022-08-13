<template>
  <div class="page">
    <div class="wrapper">
      <DatePicker
        locale="de-DE"
        first-day-of-week="monday"
        :disable-dates="{ before: new Date(2022, 6, 18), after: new Date(2022, 6, 24) }"
        :default-date="new Date(2022, 6, 1)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import DatePicker from '../../src/components/header/DatePicker.vue'

export default defineComponent({
  name: 'ConfigureDatePicker',

  components: {DatePicker},
})
</script>

<style lang="scss" scoped>

.page {
  width: 100%;
}

.wrapper {
  margin-top: 24px;
  max-width: 1400px;
  height: 1000px;
  margin-left: auto;
  margin-right: auto;
  font-family: Verdana, sans-serif;
}

</style>
