<template>
  <div class="page">
    <div class="wrapper">
      <Qalendar
        :config="config"
        :selected-date="new Date(2022, (11 - 1), 27)"
        :events="events"
      >
        <template #dayCell="{dayData}">
          <div>
            <div> {{ dayData.dateTimeString.substring(8, 10) }}</div>
            <div> {{ dayData.events.length }} events</div>
          </div>
        </template>
      </Qalendar>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Qalendar from '../../src/Qalendar.vue';

export default defineComponent({
  name: 'DayCell',

  components: { Qalendar },

  data() {
    return {
      config: {
        defaultMode: 'month',
      },

      events: [
        {
          id: '1',
          title: 'Event 1',
          time: {
            start: '2022-11-27 10:00',
            end: '2022-11-27 11:00'
          }
        }
      ],
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
  max-width: 1200px;
  height: 1000px;
  margin-left: auto;
  margin-right: auto;
}

</style>
