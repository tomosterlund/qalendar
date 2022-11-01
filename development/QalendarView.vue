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
        @interval-was-clicked="handleIntervalWasClicked"
      >
        <template #customCurrentTime>
          <div :style="{ height: '3px', backgroundColor: 'cornflowerblue', position: 'relative' }">
            <div :style="{ position: 'absolute', left: '-7px', top: '-6px', height: '15px', width: '15px', backgroundColor: 'cornflowerblue', borderRadius: '50%' }"></div>
          </div>
        </template>
<!--        <template v-slot:event="eventProps" #event>-->
<!--          <div :style="{ backgroundColor: 'cornflowerblue', color: '#fff', width: '100%', height: '100%', overflow: 'hidden' }">-->
<!--            {{ eventProps.eventData.title }}-->

<!--            <div>-->
<!--              <input type="checkbox" />-->

<!--              <label for="checkbox">-->
<!--                Select time slot-->
<!--              </label>-->
<!--            </div>-->
<!--          </div>-->
<!--        </template>-->

<!--        <template v-slot:eventDialog="props" #eventDialog>-->
<!--          <div-->
<!--            v-if="props.eventDialogData && props.eventDialogData.title"-->
<!--            :style="{ padding: '16px' }"-->
<!--          >-->
<!--            <div :style="{marginBottom: '8px'}">Edit event</div>-->

<!--            <input type="text" v-model="eventDialogForm.title" :style="{ width: '90%', padding: '8px', marginBottom: '8px' }" >-->

<!--            <button @click="props.closeEventDialog">-->
<!--              Finished!-->
<!--            </button>-->
<!--          </div>-->
<!--        </template>-->
      </Qalendar>
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
          // nDays: 5,
          scrollToHour: 8,
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
        showCurrentTime: true,
        // disableModes: ['month'],
        isSilent: true,
        dayIntervals: {
          height: 100,
          length: 15,
          displayClickableInterval: true,
          // intervalStyles: {
          //   color: '#fff',
          //   backgroundColor: 'rgba(10, 10, 10, 0.9)',
          //   borderBottom: '1px dotted #fff',
          // },
        },
        // eventDialog: {
        //   isDisabled: false,
        //   isCustom: true,
        // }
      } as configInterface,
      events: [] as eventInterface[],

      layout: 'none',
      isLoading: false,
      eventDialogForm: {
        title: '',
        id: '',
      }
    };
  },

  mounted() {
    // this.triggerLoadAnimations()
    setTimeout(() => {
      this.events = seededEvents.map((e) => {
        // @ts-ignore
        // e.isCustom = true;
        // e.isEditable = false;

        return e
      });
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
    },

    handleIntervalWasClicked(e) {
      console.log('interval was clicked')
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
    max-width: 100%;
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
