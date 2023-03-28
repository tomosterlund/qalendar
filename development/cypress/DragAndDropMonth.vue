<template>
  <div class="page">
    <div class="wrapper">
      <Qalendar
          :config="config"
          :selected-date="new Date(2022, (6 - 1), 1)"
          :events="events"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Qalendar from '../../src/Qalendar.vue';
import {configInterface} from '../../src/typings/config.interface';
import {dragAndDropMonthEvents} from './__data__/04-drag-and-drop-month';
import {WEEK_START_DAY} from "../../src/helpers/Time";

export default defineComponent({
  name: 'DragAndDropMonth',

  components: {Qalendar},

  data() {
    return {
      config: {
        locale: 'en-US',
        week: {
          nDays: 7,
          startsOn: WEEK_START_DAY.SUNDAY,
        },
        style: {
          fontFamily: `Roboto, sans-serif`
        },
        isSilent: true,
        defaultMode: 'month',
      } as configInterface,

      events: dragAndDropMonthEvents,
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
