<template>
  <div
    v-if="!isCustomEvent"
    class="calendar-week__event is-event"
    :class="{
      'is-editable': isEditable,
      'has-disabled-dnd': hasDisabledDragAndDrop,
    }"
    :style="{
      ...requiredStyles,
      border: getBorderRule,
      color: eventColor,
      backgroundColor: eventBackgroundColor,
    }"
    :data-ref="'event-' + event.id"
    @click="handleClickOnEvent"
    @mouseenter="showResizeElements = isEditable && !hasDisabledResize"
    @mouseleave="showResizeElements = false"
    @mousedown="initDrag"
    @touchstart="initDrag"
  >
    <div class="calendar-week__event-info-wrapper">
      <div
        v-if="showResizeElements"
        class="calendar-week__event-resize calendar-week__event-resize-up"
        @mousedown="resizeEvent('up')"
      />

      <div class="calendar-week__event-row is-title">
        {{ event.title }}
      </div>

      <div class="calendar-week__event-row is-time">
        <font-awesome-icon
          :icon="icons.clock"
          class="calendar-week__event-icon"
        />
        <span>{{ getEventTime }}</span>
      </div>

      <div
        v-if="event.location"
        class="calendar-week__event-row is-location"
      >
        <font-awesome-icon
          :icon="icons.location"
          class="calendar-week__event-icon"
        />
        <span>{{ event.location }}</span>
      </div>

      <div
        v-if="event.with"
        class="calendar-week__event-row is-with"
      >
        <font-awesome-icon
          :icon="icons.user"
          class="calendar-week__event-icon"
        />
        <span>{{ event.with }}</span>
      </div>

      <div
        v-if="event.topic"
        class="calendar-week__event-row is-topic"
      >
        <font-awesome-icon
          :icon="icons.topic"
          class="calendar-week__event-icon"
        />
        <span>{{ event.topic }}</span>
      </div>

      <div
        v-if="event.description"
        class="calendar-week__event-row is-description"
      >
        <font-awesome-icon
          :icon="icons.description"
          class="calendar-week__event-icon"
        />
        <!-- eslint-disable vue/no-v-html -->
        <p v-html="event.description" />
        <!--eslint-enable-->
      </div>

      <div
        v-if="eventIsLongerThan30Minutes"
        class="calendar-week__event-blend-out"
        :style="{
          backgroundImage:
            'linear-gradient(to bottom, transparent, ' +
            eventBackgroundColor +
            ')',
        }"
      />

      <div
        v-if="showResizeElements"
        class="calendar-week__event-resize calendar-week__event-resize-down"
        @mousedown="resizeEvent('down')"
      />
    </div>
  </div>

  <div
    v-else
    :style="{
      ...requiredStyles,
      border: getBorderRule,
      color: eventColor,
    }"
    class="calendar-week__event is-event"
    :class="{
      'is-editable': isEditable,
      'has-disabled-dnd': hasDisabledDragAndDrop,
    }"
    @click="handleClickOnEvent"
    @mousedown="initDrag"
    @touchstart="initDrag"
  >
    <slot
      name="weekDayEvent"
      :event-data="event"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, type PropType} from 'vue';
import {type eventInterface} from '../../typings/interfaces/event.interface';
import {
  faClock,
  faComment,
  faMapMarkerAlt,
  faQuestionCircle,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import Time from '../../helpers/Time';
import {type configInterface} from '../../typings/config.interface';
import {EVENT_COLORS} from '../../constants';
import {type DayInfo, DRAG_N_RESIZE_DIRECTION, type modeType} from '../../typings/types';
import { EventChange } from '../../helpers/EventChange';
import Helpers from "../../helpers/Helpers";

export default defineComponent({
  name: 'DayEvent',

  components: {
    FontAwesomeIcon,
  },

  props: {
    eventProp: {
      type: Object as PropType<eventInterface>,
      required: true,
    },
    time: {
      type: Object as PropType<Time>,
      required: true,
    },
    config: {
      type: Object as PropType<configInterface>,
      required: true,
    },
    dayInfo: {
      type: Object as PropType<DayInfo>,
      required: true,
    },
    mode: {
      type: String as PropType<modeType>,
      required: true,
    },
  },

  emits: ['event-was-clicked', 'event-was-resized', 'event-was-dragged', 'drag-start', 'drag-end'],

  data() {
    return {
      event: this.eventProp,
      icons: {
        clock: faClock,
        user: faUser,
        description: faComment,
        location: faMapMarkerAlt,
        topic: faQuestionCircle,
      },
      showResizeElements: false,
      eventTransformValue: 'initial',
      eventZIndexValue: 'initial' as 'initial' | number,
      dayElement: document.querySelector('.calendar-week__day'),
      dayBoundariesDateTimeStrings: this.time.getDateTimeStringDayBoundariesFrom(this.dayInfo.dateTimeString),

      // Resizing events
      resizingStartingPoint: undefined as undefined | number,
      resizingStartingPointEndOfTime: this.eventProp.time.end,
      resizingStartingPointStartOfTime: this.eventProp.time.start,
      resizingDirection: '',
      changeInQuarterHoursEventStart: 0,
      changeInQuarterHoursEventEnd: 0,
      isEditable: this.eventProp.isEditable || false,
      colors: EVENT_COLORS as { [key: string]: string },
      eventColor: '#fff',
      eventBackgroundColor: '',
      isResizing: false,

      // Dragging events
      canDrag: false, // set to true on mousedown and false on mouseup
      clientYDragStart: null as null | number,
      clientXDragStart: null as null | number,
      changeInQuartersOnDrag: 0,
      changeInDaysOnDrag: 0,
      isDragging: false,
      timeStartDragStart: this.eventProp.time.start,
      timeEndDragStart: this.eventProp.time.end,

      dragMoveListenerNameAndCallbacks: [
        ['mousemove', this.handleDrag],
        ['touchmove', this.handleDrag],
        ['mouseup', this.onMouseUpWhenDragging],
        ['touchend', this.onMouseUpWhenDragging],
      ] as ReadonlyArray<[string, any]>,
    };
  },

  computed: {
    eventChangeHelper() {
      const eventCurrentDay = this.time.addDaysToDateTimeString(this.changeInDaysOnDrag, this.dayInfo.dateTimeString)

      return new EventChange(this.time, this.time.dateStringFrom(eventCurrentDay))
    },

    isCustomEvent(): boolean {
      if (Array.isArray(this.eventProp.isCustom)) {
        return this.eventProp.isCustom.includes(this.mode);
      }

      return this.eventProp.isCustom || false;
    },

    getEventTime() {
      return (
        this.time.getLocalizedTime(this.event.time.start) +
        ' - ' +
        this.time.getLocalizedTime(this.event.time.end)
      );
    },

    timePointsInDay() {
      return this.time.HOURS_PER_DAY * 100;
    },

    timePointsInOneMinute() {
      return 100 / 60;
    },

    getLeftRule() {
      if (
        !this.event.totalConcurrentEvents ||
        !this.event.nOfPreviousConcurrentEvents
      )
        return 0;

      return (
        (this.event.nOfPreviousConcurrentEvents /
          this.event.totalConcurrentEvents) *
        100
      );
    },

    getWidthRule() {
      return 100 - this.getLeftRule;
    },

    getBorderRule() {
      if (!this.event.nOfPreviousConcurrentEvents) return 'none';

      return '1px solid #fff';
    },

    eventIsLongerThan30Minutes() {
      const { hour: startHour, minutes: startMinutes } =
        this.time.getAllVariablesFromDateTimeString(this.event.time.start);
      const { hour: endHour, minutes: endMinutes } =
        this.time.getAllVariablesFromDateTimeString(this.event.time.end);
      const startDateMS = new Date(0, 0, 0, startHour, startMinutes).getTime();
      const endDateMS = new Date(0, 0, 0, endHour, endMinutes).getTime();

      return endDateMS - startDateMS >= 1800000;
    },

    hasDisabledDragAndDrop() {
      return !!(
        this.eventProp.disableDnD &&
        this.eventProp.disableDnD.includes(this.mode)
      );
    },

    hasDisabledResize() {
      return !!(
        this.eventProp.disableResize &&
        this.eventProp.disableResize.includes(this.mode)
      );
    },

    requiredStyles() {
      return {
        top: this.getPositionInDay(this.event.time.start),
        height: this.getLengthOfEvent(
          this.event.time.start,
          this.event.time.end
        ),
        left: this.getLeftRule + '%',
        width: this.getWidthRule + '%',
        transform: this.eventTransformValue,
        zIndex: this.eventZIndexValue,
      };
    },
  },

  watch: {
    changeInQuarterHoursEventStart(newValue, oldValue) {
      const newStartOfTimeDateTimeString = this.time.addMinutesToDateTimeString(
        15 * newValue,
        this.resizingStartingPointStartOfTime
      );
      const direction = newValue > oldValue ? DRAG_N_RESIZE_DIRECTION.FORWARDS : DRAG_N_RESIZE_DIRECTION.BACKWARDS;
      const eventCanBeResizedFurther = this.eventChangeHelper.canEventBeMoved(
        this.event,
        direction
      )

      // Only set the new start time, if it's earlier than the end time of the event
      if (newStartOfTimeDateTimeString < this.event.time.end && eventCanBeResizedFurther) {
        this.event.time.start = newStartOfTimeDateTimeString;
      }
    },

    changeInQuarterHoursEventEnd(newValue, oldValue) {
      const newEndOfTimeDateTimeString = this.time.addMinutesToDateTimeString(
        15 * newValue,
        this.resizingStartingPointEndOfTime
      )
      const direction = newValue > oldValue ? DRAG_N_RESIZE_DIRECTION.FORWARDS : DRAG_N_RESIZE_DIRECTION.BACKWARDS;
      const eventCanBeResizedFurther = this.eventChangeHelper.canEventBeMoved(
        this.event,
        direction
      )

      // Only set the new end time, if it's later than the start time of the event
      if (newEndOfTimeDateTimeString > this.event.time.start && eventCanBeResizedFurther) {
        this.event.time.end = newEndOfTimeDateTimeString;
      }
    },

    changeInQuartersOnDrag(newValue, oldValue) {
      const direction = newValue > oldValue ? DRAG_N_RESIZE_DIRECTION.FORWARDS : DRAG_N_RESIZE_DIRECTION.BACKWARDS;

      const eventCanBeDraggedFurther = this.eventChangeHelper.canEventBeMoved(
        this.event,
        direction
      )

      if (!eventCanBeDraggedFurther) return;

      this.updatePositionOnDrag();
    },

    changeInDaysOnDrag(newValue) {
      if (!this.dayElement) return;
      // +1 to account for the zero indexing vs length
      const upcomingDaysInWeek = this.dayInfo.daysTotalN - (this.dayInfo.thisDayIndex + 1);
      const previousDaysInWeek = 0 - this.dayInfo.thisDayIndex;
      if (newValue > upcomingDaysInWeek || newValue < previousDaysInWeek)
        return;

      const pixelsToTransform = newValue * this.dayElement.clientWidth;
      this.eventTransformValue = `translateX(${pixelsToTransform}px)`;
      this.updatePositionOnDrag();
    },
  },

  mounted() {
    this.setColors();
  },

  methods: {
    getPositionInDay(dateTimeString: string) {
      return (
        this.time
          .getPercentageOfDayFromDateTimeString(
            dateTimeString,
            this.time.DAY_START,
            this.time.DAY_END,
          )
          .toString() + '%'
      );
    },

    getLengthOfEvent(start: string, end: string) {
      const startOfEvent =
        this.time.getPercentageOfDayFromDateTimeString(
          start,
          this.time.DAY_START,
          this.time.DAY_END
        );
      const endOfEvent =
        this.time.getPercentageOfDayFromDateTimeString(
          end,
          this.time.DAY_START,
          this.time.DAY_END
        );
      const length = Math.abs(endOfEvent - startOfEvent);

      return length + '%';
    },

    handleClickOnEvent(event: any) {
      const eventElement = this.getEventElementFromChildElement(event);

      if (!eventElement) return;

      this.$emit('event-was-clicked', {
        clickedEvent: this.event,
        eventElement,
      });
    },

    /**
     * When a child element of the event is clicked, return the parent event element
     * */
    getEventElementFromChildElement(event: any) {
      const eventTarget = event.target;
      if (!eventTarget || typeof eventTarget.className.includes !== 'function')
        return null;

      if (eventTarget.className.includes('.calendar-week__event'))
        return event.target;

      return eventTarget.closest('.calendar-week__event');
    },

    /**
     * Handle mousemove-events, while the event is being resized
     * */
    onMouseMoveResize(event: MouseEvent) {
      const eventsContainer = document.querySelector('.calendar-week__events');

      if (!eventsContainer) return;

      if (typeof this.resizingStartingPoint === 'undefined') {
        this.resizingStartingPoint = event.clientY;
      }

      const cursorPositionY = event.clientY;
      const nOfPixelsDistance = cursorPositionY - this.resizingStartingPoint;
      const eventsContainerHeight = eventsContainer.clientHeight;
      const percentageOfDayChanged = (nOfPixelsDistance / eventsContainerHeight) * 100;
      const changeInTimePoints = (this.timePointsInDay / 100) * percentageOfDayChanged;
      const changeInMinutes = this.getMinutesFromTimePoints(changeInTimePoints);

      // Count how many quarters have changed, since the event will only be updated
      // for every quarter that is added or subtracted
      if (this.resizingDirection === 'down') {
        this.changeInQuarterHoursEventEnd = Math.floor(changeInMinutes / 15);
      } else {
        this.changeInQuarterHoursEventStart = Math.floor(changeInMinutes / 15);
      }
    },

    /**
     * Handle mouseup-events, for when an event stops being resized
     * */
    onMouseUpWhenResizing() {
      this.stopResizing();
    },

    resizeEvent(direction: 'down' | 'up') {
      this.isResizing = true;
      this.resizingDirection = direction;
      document.addEventListener('mousemove', this.onMouseMoveResize);
      document.addEventListener('mouseup', this.onMouseUpWhenResizing);
    },

    stopResizing() {
      document.removeEventListener('mousemove', this.onMouseMoveResize);
      document.removeEventListener('mouseup', this.onMouseUpWhenResizing);
      this.resetResizingValues();
      this.$emit('event-was-resized', this.event);
      this.isResizing = false;
    },

    /**
     * Reset values used for resizing an event, to prepare for upcoming resizing events
     * */
    resetResizingValues() {
      this.resizingStartingPoint = undefined;
      this.resizingStartingPointStartOfTime = this.eventProp.time.start;
      this.resizingStartingPointEndOfTime = this.eventProp.time.end;
      this.changeInQuarterHoursEventEnd = 0;
    },

    /**
     * Calculate the change of an event in minutes, based on the number of time points that changed
     * */
    getMinutesFromTimePoints(timePoints: number) {
      return timePoints / this.timePointsInOneMinute;
    },

    setColors() {
      // First, if the event has a customColorScheme, and the name of that
      if (
        this.event?.colorScheme &&
        this.config.style?.colorSchemes &&
        this.config.style.colorSchemes[this.event.colorScheme]
      ) {
        this.eventColor =
          this.config.style.colorSchemes[this.event.colorScheme].color;
        return (this.eventBackgroundColor =
          this.config.style.colorSchemes[
            this.event.colorScheme
          ].backgroundColor);
      }

      if (this.event?.color) {
        this.eventColor = '#fff';
        this.eventBackgroundColor = this.colors[this.event.color];

        return;
      }

      this.eventBackgroundColor = this.colors.blue;
    },

    initDrag(domEvent: UIEvent) {
      // Do not allow drag & drop, if event is not editable
      if (!this.event.isEditable || this.hasDisabledDragAndDrop) return;

      this.$emit('drag-start');

      this.dragMoveListenerNameAndCallbacks.forEach(([name, callback]) => {
        document.addEventListener(name, callback);
      });

      if (Helpers.isUIEventTouchEvent(domEvent)) {
        this.setInitialDragValues(
          (domEvent as TouchEvent).touches[0]?.clientX,
          (domEvent as TouchEvent).touches[0]?.clientY
        );
      } else {
        this.setInitialDragValues((domEvent as MouseEvent).clientX, (domEvent as MouseEvent).clientY);
      }
    },

    setInitialDragValues(clientX: number, clientY: number) {
      this.canDrag = true;
      this.eventZIndexValue = 10;
      this.clientYDragStart = clientY;
      this.clientXDragStart = clientX;
      this.timeStartDragStart = this.event.time.start;
      this.timeEndDragStart = this.event.time.end;
    },

    onMouseUpWhenDragging() {
      this.$emit('drag-end');
      this.handleDragEnd();
    },

    handleDragEnd() {
      this.canDrag = false;
      this.eventZIndexValue = 'initial';
      this.dragMoveListenerNameAndCallbacks.forEach(([name, callback]) => {
        document.removeEventListener(name, callback);
      });
      const dayChanged = this.changeInDaysOnDrag <= -1 || this.changeInDaysOnDrag > 0;
      const timeChanged = this.changeInQuartersOnDrag <= -1 || this.changeInQuartersOnDrag > 0;
      if (dayChanged || timeChanged) this.$emit('event-was-dragged', this.event);
    },

    handleDrag(mouseEvent: UIEvent) {
      // Do not run the drag & drop algorithms, under the following conditions:
      if (this.isResizing || !this.canDrag || !this.clientYDragStart) return;

      if (Helpers.isUIEventTouchEvent(mouseEvent)) {
        this.handleVerticalDrag((mouseEvent as TouchEvent).touches[0].clientY);
        this.handleHorizontalDrag((mouseEvent as TouchEvent).touches[0].clientX);
      } else {
        this.handleVerticalDrag((mouseEvent as MouseEvent).clientY);
        this.handleHorizontalDrag((mouseEvent as MouseEvent).clientX);
      }
    },

    /**
     * Handle dragging within days
     * */
    handleVerticalDrag(clientY: number) {
      const eventsContainer = document.querySelector('.calendar-week__events');
      if (!eventsContainer || !this.clientYDragStart) return;

      const nOfPixelsDistance = clientY - this.clientYDragStart;
      const eventsContainerHeight = eventsContainer.clientHeight;
      const percentageOfDayChanged =
        (nOfPixelsDistance / eventsContainerHeight) * 100;
      const changeInTimePoints =
        (this.timePointsInDay / 100) * percentageOfDayChanged;
      const changeInMinutes = this.getMinutesFromTimePoints(changeInTimePoints);
      this.changeInQuartersOnDrag =
        changeInMinutes < 0
          ? Math.ceil(changeInMinutes / 15)
          : Math.floor(changeInMinutes / 15);
    },

    /**
     * Handle dragging between days
     * */
    handleHorizontalDrag(clientX: number) {
      if (!this.dayElement || !this.clientXDragStart) return;

      const dayWidth = this.dayElement.clientWidth;
      const changeInPixelsX = clientX - this.clientXDragStart;
      this.changeInDaysOnDrag =
        changeInPixelsX < 0
          ? Math.ceil(changeInPixelsX / dayWidth)
          : Math.floor(changeInPixelsX / dayWidth);
    },

    updatePositionOnDrag() {
      const minutesChangedVertically = this.changeInQuartersOnDrag * 15;
      const minutesChangedHorizontally = this.changeInDaysOnDrag * 1440;

      this.event.time.start = this.time.addMinutesToDateTimeString(
        minutesChangedVertically + minutesChangedHorizontally,
        this.timeStartDragStart
      );

      this.event.time.end = this.time.addMinutesToDateTimeString(
        minutesChangedVertically + minutesChangedHorizontally,
        this.timeEndDragStart
      );
    },
  },
});
</script>

<style scoped lang="scss">
.calendar-week__event {
  position: absolute;
  width: 100%;
  border-radius: 4px;
  cursor: pointer;
  box-sizing: content-box;
  user-select: none;

  &.is-editable {
    cursor: grab;
  }

  &.has-disabled-dnd {
    cursor: initial;
  }

  .calendar-week__event-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 0.25em;

    p {
      margin: 0;
      padding: 0;
    }
  }

  .calendar-week__event-info-wrapper {
    position: relative;
    padding: var(--qalendar-spacing-half);
    font-size: var(--qalendar-font-xs);
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    user-select: none;
  }

  .calendar-week__event-blend-out {
    position: absolute;
    bottom: 0;
    height: 20px;
    width: 100%;
    transform: translateX(calc(var(--qalendar-spacing-half) * -1));
  }

  .calendar-week__event-icon {
    margin: 2px 4px 0 0;
    font-size: var(--qalendar-font-xs);
  }

  .calendar-week__event-resize {
    position: absolute;
    width: 100%;
    cursor: ns-resize;
    height: 5px;
  }

  .calendar-week__event-resize-up {
    top: 0;
  }

  .calendar-week__event-resize-down {
    bottom: 0;
  }
}
</style>
