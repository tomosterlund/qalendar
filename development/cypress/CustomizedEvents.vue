<template>
  <div class="page">
    <div class="wrapper">
      <Qalendar
        :config="config"
        :selected-date="new Date(2022, (6 - 1), 16)"
        :events="events"
      >
        <template #weekDayEvent="eventProps">
          <div :style="{ backgroundColor: 'cornflowerblue', color: '#fff', width: '100%', height: '100%', overflow: 'hidden' }">
            <span class="is-title">{{ eventProps.eventData.title }}</span>

            <div>
              <input type="checkbox">

              <label for="checkbox">
                Select time slot
              </label>
            </div>
          </div>
        </template>

        <template #monthEvent="monthEventProps">
          <div id="custom-month-event">
            {{ monthEventProps.eventData.title }}
          </div>
        </template>

        <template #eventDialog="props">
          <div
            v-if="props.eventDialogData && props.eventDialogData.title"
            :style="{ padding: '16px' }"
          >
            <div :style="{marginBottom: '8px'}">
              Edit event
            </div>

            <input
              class="flyout-input"
              type="text"
              :style="{ width: '90%', padding: '8px', marginBottom: '8px' }"
            >

            <button
              class="close-flyout"
              @click="props.closeEventDialog"
            >
              Finished!
            </button>
          </div>
        </template>
      </Qalendar>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Qalendar from '../../src/Qalendar.vue';
import {fiveDayWeekEvents} from './__data__/02-five-day-week';
import {configInterface} from '../../src/typings/config.interface';
import {DATE_TIME_STRING_PATTERN} from '../../src/constants';
import {WEEK_START_DAY} from "../../src/helpers/Time";

export default defineComponent({
  name: 'CustomizedEvents',

  components: {Qalendar},

  data() {
    return {
      config: {
        locale: 'de-DE',
        week: {
          startsOn: WEEK_START_DAY.MONDAY,
        },
        eventDialog: {
          isCustom: true,
        }
      } as configInterface,

      events: [],
    }
  },

  mounted() {
    // IMPORTANT: Needs to be set through a timeout, to make sure that the test
    // tries adding events through a prop after the component was already rendered
    setTimeout(() => {
      this.events = fiveDayWeekEvents.map((e, i) => {
        // @ts-ignore
        if (i % 2 === 0) e.isCustom = true;

        return e
      }).filter(e => e.time.start.match(DATE_TIME_STRING_PATTERN));
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
