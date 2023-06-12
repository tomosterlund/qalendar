<template>
  <div class="page">
    <div class="wrapper">
      <Qalendar
        :config="config"
        :selected-date="new Date(2023, (12 - 1), 18)"
        :events="events"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Qalendar from '../../src/Qalendar.vue';
import {configInterface} from '../../src/typings/config.interface';
import {WEEK_START_DAY} from "../../src/helpers/Time";

export default defineComponent({
  name: 'DisableDragAndDropForEvent',

  components: {Qalendar},

  data() {
    return {
      config: {
        locale: 'de-DE',
        week: {
          nDays: 7,
          startsOn: WEEK_START_DAY.MONDAY,
        },
        defaultMode: 'week',
      } as configInterface,

      events: [
        {
          "title": "Advanced algebra",
          "with": "John Doe",
          "time": {"start": "2023-12-18 10:00", "end": "2023-12-18 12:00"},
          "color": "blue",
          "isEditable": true,
          "id": "810a978a901e",
          "location": "120 Center Str, 95872 Saint Cloud, MN",
          "disableDnD": ['week', 'month', 'day'],
        },
        {
          "title": "Advanced algebra",
          "with": "John Doe",
          "time": {"start": "2024-01-01 10:00", "end": "2024-01-01 12:00"},
          "color": "blue",
          "isEditable": true,
          "id": "810a978a901e",
          "location": "120 Center Str, 95872 Saint Cloud, MN"
        },
      ],
    }
  },
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
