<template>
  <transition name="slide">
    <div v-show="isVisible" class="dev-toolbar">
      <div>TZ offset: {{ new Date().getTimezoneOffset() }}</div>

      <select id="layout" v-model="layout" name="layout">
        <option value="none">No layout</option>
        <option value="sidebar">Sidebar</option>
        <option value="header">Header</option>
      </select>

      <select id="locale" v-model="locale" name="locale">
        <option value="en-US">en-US</option>
        <option value="de-DE">de-DE</option>
        <option value="sv-SE">sv-SE</option>
        <option value="ja-JP">ja-JP</option>
        <option value="ru-RU">ru-RU</option>
        <option value="zh-CN">zh-CN</option>
        <option value="pt-BR">pt-BR</option>
        <option value="fr-FR">fr-FR</option>
        <option value="ar-YE">ar-YE</option>
        <option value="es-ES">es-ES</option>
      </select>

      <select id="nDays" v-model="nDays" name="nDays">
        <option value="7">7 days</option>
        <option value="5">5 days</option>
      </select>

      <button @click="isVisible = false">X</button>
    </div>
  </transition>

  <button v-if="!isVisible" class="toolbar-toggle" @click="isVisible = true">
    Dev toolbar
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DevToolbar',

  emits: ['selected-layout', 'selected-locale', 'selected-n-days'],

  data() {
    return {
      isVisible: false,
      layout: 'none',
      locale: '',
      nDays: 7,
    };
  },

  watch: {
    isVisible(value) {
      localStorage.setItem('toolbar-visible', value);
    },

    layout(value) {
      this.$emit('selected-layout', value);
      localStorage.setItem('layout-setting', value);
    },

    locale(value) {
      this.$emit('selected-locale', value);
      localStorage.setItem('locale-setting', value);
    },

    nDays(value) {
      this.$emit('selected-n-days', +value);
      localStorage.setItem('nDays-setting', value);
    },
  },

  mounted() {
    const visibleSetting = localStorage.getItem('toolbar-visible');
    if (visibleSetting && visibleSetting === 'true') this.isVisible = true;

    const layoutSetting = localStorage.getItem('layout-setting');
    if (layoutSetting) this.layout = layoutSetting;

    const localeSetting = localStorage.getItem('locale-setting');
    if (localeSetting) this.locale = localeSetting;

    const nDaysSetting = localStorage.getItem('nDays-setting');
    if (nDaysSetting) this.nDays = +nDaysSetting;
  },
});
</script>

<style lang="scss" scoped>
.dev-toolbar {
  font-family: Courier, 'sans-serif';
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  height: 50px;
  padding: 10px;
  border-radius: 10px;
  background-color: #181818;
  color: #fff;
  display: flex;
  align-items: center;
  grid-gap: 40px;
  transition: all 0.2s ease;

  select {
    padding: 12px;
    font-family: inherit;
  }

  button {
    background-color: inherit;
    color: #fff;
    border: 0;
    font-size: var(--qalendar-font-l);
    cursor: pointer;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  bottom: -100px;
}

.toolbar-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #181818;
  color: #fff;
  padding: 8px 16px;
  font-family: Courier, 'sans-serif';
  border: 0;
  border-radius: 4px;
}
</style>
