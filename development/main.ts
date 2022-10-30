import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import DatePickerView from "./DatePickerView.vue";
import QalendarView from "./QalendarView.vue";
import CypressSmoke from './cypress/CypressSmoke.vue'
import FiveDayWeek from './cypress/FiveDayWeek.vue'
import DragAndDrop from './cypress/DragAndDrop.vue'
import DragAndDropMonth from './cypress/DragAndDropMonth.vue'
import ConfigureDatePicker from './cypress/ConfigureDatePicker.vue'
import DisableDragAndDropForEvent from './cypress/DisableDragAndDropForEvent.vue'
import CustomizedEvents from './cypress/CustomizedEvents.vue'
import CustomizedDayBoundaries from './cypress/CustomizedDayBoundaries.vue'

const routes = [
  { path: "/", component: QalendarView },
  { path: "/date-picker", component: DatePickerView },

  // Routes for Cypress
  { path: "/cypress/smoke", component: CypressSmoke },
  { path: "/cypress/five-day-week", component: FiveDayWeek },
  { path: "/cypress/drag-and-drop", component: DragAndDrop },
  { path: "/cypress/drag-and-drop-month", component: DragAndDropMonth },
  { path: "/cypress/configure-date-picker", component: ConfigureDatePicker },
  { path: "/cypress/disable-dnd", component: DisableDragAndDropForEvent },
  { path: "/cypress/customized-events", component: CustomizedEvents },
  { path: "/cypress/customized-day-boundaries", component: CustomizedDayBoundaries },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount("#app");
