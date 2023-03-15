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
import {dragAndDropEvents} from './__data__/03-drag-and-drop-events';
import {WEEK_START_DAY} from "../../src/helpers/Time";

export default defineComponent({
  name: 'DragAndDrop',

  components: {Qalendar},

  data() {
    return {
      config: {
        locale: 'en-US',
        week: {
          nDays: 5,
          startsOn: WEEK_START_DAY.MONDAY,
        },
      } as configInterface,

      events: dragAndDropEvents,
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
