<template>
  <div class="page">
    <div class="wrapper">
      <Qalendar
        :config="config"
        :selected-date="new Date(2023, 0, 5)"
        :events="events"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Qalendar from '../../src/Qalendar.vue';

export default defineComponent({
  name: 'MultipleDayEvents',

  components: {Qalendar},

  data() {
    return {
      config: {
        locale: 'en-US',
        // defaultMode: 'month',
      },

      events: [
        {
          "title": "Meeting: John w. parents",
          "with": "Monica Geller",
          "time": {"start": "2023-01-05 00:52", "end": "2023-03-06 02:52"},
          "color": "purple",
          "isEditable": true,
          "id": "372556a20f2a",
          "description": "Pick up the dry cleaning. 234 Center Str.",
          "topic": "Chemistry"
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
  max-width: 1400px;
  height: 1000px;
  margin-left: auto;
  margin-right: auto;
}

</style>
