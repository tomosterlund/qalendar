<template>
  <div class="app-container" :class="'layout-has-' + layout">
    <DevSidebar v-if="layout === 'sidebar'" />

    <DevHeader v-if="layout === 'header'" />

    <main>
      <Qalendar
        :key="config.locale + config.week.nDays"
        :selected-date="new Date()"
        :config="config"
        :events="events"
        :is-loading="isLoading"
        @event-was-clicked="reactToEvent"
        @updated-period="updatedPeriod"
        @updated-mode="updatedPeriod"
        @event-was-resized="reactToEvent"
        @edit-event="editEvent"
        @delete-event="deleteEvent"
        @event-was-dragged="handleEventWasDragged"
      />
    </main>

    <DevToolbar
      @selected-locale="config.locale = $event"
      @selected-layout="layout = $event"
      @selected-n-days="config.week.nDays = $event"
    />
  </div>
</template>

<script lang="ts">
import Qalendar from '../src/Qalendar.vue';
import { defineComponent } from 'vue';
import { configInterface } from '../src/typings/config.interface';
import { eventInterface } from '../src/typings/interfaces/event.interface';
import { seededEvents } from './data/seeded-events';
import DevToolbar from './components/DevToolbar.vue';
import DevSidebar from './components/DevSidebar.vue';
import DevHeader from './components/DevHeader.vue';

export default defineComponent({
  name: 'QalendarView',

  components: {
    DevHeader,
    DevSidebar,
    DevToolbar,
    Qalendar,
  },

  data() {
    return {
      config: {
        week: {
          startsOn: 'monday',
          nDays: 7,
        },
        locale: 'de-DE',
        style: {
          fontFamily: `'Nunito', 'sans-serif', 'Verdana`,
          colorSchemes: {
            meetings: {
              color: '#fff',
              backgroundColor: '#131313',
            },
            ladies: {
              color: '#fff',
              backgroundColor: '#ff4081',
            },
          },
        },
        defaultMode: 'week',
        // isSilent: true,
      } as configInterface,
      events: [] as eventInterface[],

      layout: 'none',
      isLoading: false,
    };
  },

  mounted() {
    // this.triggerLoadAnimations()
    setTimeout(() => {
      this.events = seededEvents;
    }, 200)
  },

  methods: {
    reactToEvent(payload: any) {
      console.log(payload);
    },
    
    updatedPeriod(e) {
      console.log('updated period')
      console.log(e)
    },

    triggerLoadAnimations() {
      this.isLoading = !this.isLoading;

      setTimeout(() => this.triggerLoadAnimations(), 5000);
    },

    editEvent(payload: string) {
      console.log('editEvent%s: ', payload);
    },

    deleteEvent(payload: string) {
      console.log('deleteEvent%s: ', payload);
    },

    handleEventWasDragged(e) {
      console.log('event was dragged')
      console.log(e)
    }
  },
});
</script>

<style lang="scss">
.app-container {
  --container-padding: 10px;

  padding: var(--container-padding);

  main {
    width: 1400px;
    max-width: 90%;
    height: 900px;
    max-height: 100%;
  }
}

body {
  margin: 0;
}

.layout-has-sidebar {
  display: flex;

  main {
    width: 100%;
  }
}

.layout-has-header {
  main {
    display: flex;
    justify-content: center;
  }
}
</style>
