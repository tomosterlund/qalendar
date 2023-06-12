<template>
  <div class="page">
    <div class="wrapper">
      <Qalendar
        :config="config"
        :selected-date="new Date(2022, (11 - 1), 27)"
        :events="events"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Qalendar from '../../src/Qalendar.vue';
import calendarEvents from './__data__/09-small-qalendar'

export default defineComponent({
  name: 'CypressSmoke',

  components: {Qalendar},

  data() {
    return {
      config: {
        locale: 'en-US',
      },

      events: calendarEvents,
    }
  }
})
</script>

<style lang="scss">

.page {
  width: 100%;
}

.wrapper {
  margin-top: 24px;
  max-width: 370px;
  height: 1000px;
  margin-left: auto;
  margin-right: auto;
}

</style>
