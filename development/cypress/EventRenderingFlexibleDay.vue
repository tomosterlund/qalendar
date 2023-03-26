<template>
  <div class="page">
    <div class="wrapper">
      <Qalendar
        :config="config"
        :events="events"
        :selected-date="new Date(2023, 3 - 1, 18)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Qalendar from '../../src/Qalendar.vue';
import eventsFlexibleDay from "./__data__/12-events-flexible-day";

export default defineComponent({
  name: 'EventRenderingFlexibleDay',

  components: {Qalendar},

  data() {
    return {
      config: {
        locale: 'en-US',
        dayBoundaries: {
          start: 4,
          end: 3,
        }
      },

      events: eventsFlexibleDay,
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
