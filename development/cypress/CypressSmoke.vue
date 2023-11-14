<template>
  <div class="page">
    <div class="wrapper is-light-mode">
      <Qalendar
        :config="config"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Qalendar from '../../src/Qalendar.vue';

export default defineComponent({
  name: 'CypressSmoke',

  components: {Qalendar},

  data() {
    return {
      config: {
        locale: 'en-US',
      },

      events: [

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
