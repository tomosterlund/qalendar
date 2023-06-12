<template>
  <div class="page">
    <div class="wrapper" id="wrapper">
      <Qalendar
        :config="config"
        :selected-date="new Date(2022, (6 - 1), 16)"
        :events="events"
        @day-was-clicked="handleEvent('day-was-clicked', $event)"
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
        locale: 'zn-ZH',
        week: {
          startsOn: WEEK_START_DAY.SUNDAY,
        },
      } as configInterface,

      events: [],
    }
  },

  methods: {
    handleEvent(eventName: 'day-was-clicked', eventPayload: any) {
      const newElement = document.createElement('div');
      newElement.setAttribute('id', eventName)
      newElement.innerText = eventPayload

      document.getElementById('wrapper').prepend(newElement);
    },
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
