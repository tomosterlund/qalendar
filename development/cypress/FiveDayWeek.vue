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
import {configInterface} from '../../dist/typings/config.interface';
import {fiveDayWeekEvents} from './__data__/02-five-day-week';

export default defineComponent({
  name: 'CypressSmoke',

  components: {Qalendar},

  data() {
    return {
      config: {
        locale: 'de-DE',
        week: {
          nDays: 5,
          startsOn: 'monday',
        },
      } as configInterface,

      events: fiveDayWeekEvents,
    }
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
