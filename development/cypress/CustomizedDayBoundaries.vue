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
import {WEEK_START_DAY} from "../../src/helpers/Time";

export default defineComponent({
  name: 'FiveDayWeek',

  components: {Qalendar},

  data() {
    return {
      config: {
        locale: 'de-DE',
        week: {
          nDays: 7,
          startsOn: WEEK_START_DAY.MONDAY,
        },
        dayBoundaries: {
          start: 6,
          end: 18,
        },
        dayIntervals: {
          length: 30,
          height: 40,
        }
      } as configInterface,

      events: [],
    }
  },

  mounted() {
    setTimeout(() => {
      this.events = [
        {
          "title": "English essay deadline",
          "with": "Janina Elisabeth Parker Larson",
          "time": {"start": "2022-06-01 04:05", "end": "2022-06-01 05:59"},
          "color": "yellow",
          "isEditable": true,
          "id": "89eef99affbf",
          "description": "Read textbook p. 70-72",
          "location": "29 40th Street, 12345 Chikinawa"
        }, {
          "title": "Call with Karo",
          "with": "Lily Aldrin",
          "time": {"start": "2022-06-01 06:00", "end": "2022-06-01 07:20"},
          "color": "green",
          "isEditable": true,
          "id": "8175cccf8267"
        }, {
          "title": "Call with Karo",
          "with": "Lily Aldrin",
          "time": {"start": "2022-06-01 10:50", "end": "2022-06-01 12:20"},
          "color": "green",
          "isEditable": true,
          "id": "8175cccf8267"
        }, {
          "title": "Break",
          "with": "Ross Geller",
          "time": {"start": "2022-06-01 13:30", "end": "2022-06-01 14:30"},
          "color": "green",
          "isEditable": true,
          "id": "150b36a7c1c2",
          "location": "Fejkvägen 90, 234 91 Solsidan"
        }, {
          "title": "Break",
          "with": "Ross Geller",
          "time": {"start": "2022-06-01 18:30", "end": "2022-06-01 19:30"},
          "color": "green",
          "isEditable": true,
          "id": "150b36a7c1c2",
          "location": "Fejkvägen 90, 234 91 Solsidan"
        }
      ];
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
