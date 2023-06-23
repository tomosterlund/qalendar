<template>
  <div class="page" style="color-scheme: dark">
    <div class="wrapper">
      <Qalendar
        :config="config"
        :selected-date="new Date(2022, (6 - 1), 16)"
        :events="events"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Qalendar from '../../src/Qalendar.vue';
import {fiveDayWeekEvents} from './__data__/02-five-day-week';
import {configInterface} from '../../src/typings/config.interface';
import {WEEK_START_DAY} from "../../src/helpers/Time";

export default defineComponent({
  name: 'DarkMode',

  components: {Qalendar},

  data() {
    return {
      config: {
        locale: 'de-DE',
        week: {
          startsOn: WEEK_START_DAY.MONDAY,
        },
      } as configInterface,

      events: [],
    }
  },

  mounted() {
    this.events = fiveDayWeekEvents;
  }
})
</script>

<style lang="scss" scoped>

.page {
  width: 100%;
  background-color: #000;
}

.wrapper {
  margin-top: 24px;
  max-width: 1400px;
  height: 1000px;
  margin-left: auto;
  margin-right: auto;
}

</style>
