<template>
  <div class="page">
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
  name: 'FiveDayWeek',

  components: {Qalendar},

  data() {
    return {
      config: {
        locale: 'de-DE',
        week: {
          nDays: 5,
          startsOn: WEEK_START_DAY.MONDAY,
        },
      } as configInterface,

      events: [],
    }
  },

  mounted() {
    // IMPORTANT: Needs to be set through a timeout, to make sure that the test
    // tries adding events through a prop after the component was already rendered
    setTimeout(() => {
      this.events = fiveDayWeekEvents;
    }, 200);
  }
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
}

</style>
