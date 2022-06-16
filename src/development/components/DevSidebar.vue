<template>
  <div class="dev-sidebar"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DevSidebar',
});
</script>

<style lang="scss" scoped>
.dev-sidebar {
  display: none;
  margin: 0 24px;
  background-color: rgba(241, 239, 239, 0.88);
  border-radius: 10px;
  border: 3px dashed darkgrey;
  height: calc(100vh - 48px);
  width: 270px;

  @media (min-width: 800px) {
    display: block;
  }
}
</style>
