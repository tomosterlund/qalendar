<template>
  <div
    class="event-flyout"
    :class="{ 'is-visible': isVisible, 'is-not-editable': !isEditable }"
    :style="eventFlyoutInlineStyles"
  >
    <div
      v-if="!config.eventDialog || !config.eventDialog.isCustom"
      class="event-flyout__relative-wrapper"
    >
      <div class="event-flyout__menu">
        <span
          v-if="isEditable"
          class="event-flyout__menu-editable"
        >
          <font-awesome-icon
            class="event-flyout__menu-item is-edit-icon"
            :icon="icons.edit"
            @click="editEvent"
          />

          <font-awesome-icon
            class="event-flyout__menu-item is-trash-icon"
            :icon="icons.trash"
            @click="deleteEvent"
          />
        </span>

        <span class="event-flyout__menu-close">
          <font-awesome-icon
            class="event-flyout__menu-item is-times-icon"
            :icon="icons.times"
            @click="closeFlyout"
          />
        </span>
      </div>

      <div
        v-if="calendarEvent"
        class="event-flyout__info-wrapper"
      >
        <div
          v-if="calendarEvent.title"
          class="event-flyout__row is-title"
        >
          <div
            class="event-flyout__color-icon"
            :style="{ backgroundColor: eventBackgroundColor }"
          />
          {{ calendarEvent.title }}
        </div>

        <div
          v-if="calendarEvent.time"
          class="event-flyout__row is-time"
        >
          {{ getEventTime }}
        </div>

        <div
          v-if="calendarEvent.location"
          class="event-flyout__row is-location"
        >
          <font-awesome-icon :icon="icons.location" />
          {{ calendarEvent.location }}
        </div>

        <div
          v-if="calendarEvent.with"
          class="event-flyout__row is-with"
        >
          <font-awesome-icon :icon="icons.user" />
          {{ calendarEvent.with }}
        </div>

        <div
          v-if="calendarEvent.topic"
          class="event-flyout__row is-topic"
        >
          <font-awesome-icon
            :icon="icons.topic"
            class="calendar-week__event-icon"
          />
          {{ calendarEvent.topic }}
        </div>

        <div
          v-if="calendarEvent.description"
          class="event-flyout__row is-description"
        >
          <font-awesome-icon
            :icon="icons.description"
            class="calendar-week__event-icon"
          />
          <!-- eslint-disable vue/no-v-html -->
          <p v-html="calendarEvent.description" />
          <!--eslint-enable-->
        </div>
      </div>
    </div>

    <slot
      v-else
      :event-dialog-data="calendarEvent"
      :close-event-dialog="closeFlyout"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, type PropType} from 'vue';
import {EVENT_TYPE, type eventInterface} from '../../typings/interfaces/event.interface';
import EventFlyoutPosition, {EVENT_FLYOUT_WIDTH,} from '../../helpers/EventFlyoutPosition';
import {faMapMarkerAlt, faTimes} from '@fortawesome/free-solid-svg-icons';
import {
  faClock,
  faComment,
  faEdit,
  faQuestionCircle,
  faTrashAlt,
  faUser,
} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import type {configInterface} from '../../typings/config.interface';
import Time from '../../helpers/Time';
import {EVENT_COLORS,} from '../../constants';
import Helpers from "../../helpers/Helpers";

const eventFlyoutPositionHelper = new EventFlyoutPosition();

export default defineComponent({
  name: 'EventFlyout',

  components: {
    FontAwesomeIcon,
  },

  props: {
    calendarEventProp: {
      type: Object as PropType<eventInterface | null>,
      default: () => ({}),
    },
    eventElement: {
      type: Object as PropType<HTMLElement | any>,
      default: null,
    },
    time: {
      type: Object as PropType<Time>,
      required: true,
    },
    config: {
      type: Object as PropType<configInterface>,
      required: true,
    },
  },

  emits: ['hide', 'edit-event', 'delete-event'],

  data() {
    return {
      isVisible: false,
      top: 0 as number | null,
      left: 0 as number | null,
      icons: {
        clock: faClock,
        user: faUser,
        description: faComment,
        trash: faTrashAlt,
        edit: faEdit,
        times: faTimes,
        topic: faQuestionCircle,
        location: faMapMarkerAlt,
      },
      calendarEvent: this.calendarEventProp,
      flyoutWidth: EVENT_FLYOUT_WIDTH + 'px',
      colors: EVENT_COLORS,
    };
  },

  computed: {
    getEventTime() {
      if (!this.calendarEvent || !this.calendarEvent.time) return null;

      const eventType = Helpers.getEventType(this.calendarEvent, this.time);

      if ([EVENT_TYPE.MULTI_DAY_TIMED].includes(eventType)) {
        const startLocalizedString = this.getDateFromDateString(
          this.calendarEvent.time.start
        ) + ' ' + this.time.getLocalizedTime(this.calendarEvent.time.start)
        const endLocalizedString = this.getDateFromDateString(
          this.calendarEvent.time.end
        ) + ' ' + this.time.getLocalizedTime(this.calendarEvent.time.end)

        return `${startLocalizedString} - ${endLocalizedString}`;
      }

      if ([EVENT_TYPE.SINGLE_DAY_FULL_DAY, EVENT_TYPE.MULTI_DAY_FULL_DAY].includes(eventType)) {
        const startDate = this.getDateFromDateString(this.calendarEvent.time.start);
        const endDate = this.getDateFromDateString(this.calendarEvent.time.end);

        if (startDate === endDate) return startDate;

        return `${startDate} - ${endDate}`;
      }

      const dateString = this.getDateFromDateString(this.calendarEvent.time.start);
      const timeString = this.time.getLocalizedTimeRange(
        this.calendarEvent.time.start,
        this.calendarEvent.time.end
      );

      return `${dateString} ⋅ ${timeString}`;
    },

    eventFlyoutInlineStyles() {
      if (typeof this.top === 'number' && !this.left) {
        return {
          top: this.top + 'px',
          left: '50%',
          position: 'fixed' as const,
          transform: 'translateX(-50%)',
        };
      }

      return {
        top: this.top + 'px',
        left: this.left + 'px',
        position: 'fixed' as const, // casting, since tsc otherwise thinks we're casting 'string' to 'PositionProperty'
      };
    },

    isEditable() {
      return this.calendarEventProp?.isEditable || false;
    },

    eventBackgroundColor() {
      // First, if the event has a customColorScheme, and the name of that
      if (
        this.calendarEvent?.colorScheme &&
        this.config.style?.colorSchemes &&
        this.config.style.colorSchemes[this.calendarEvent.colorScheme]
      ) {
        return this.config.style.colorSchemes[this.calendarEvent.colorScheme]
          .backgroundColor;
      }

      return this.colors[this.calendarEvent?.color || 'blue'];
    },
  },

  watch: {
    calendarEventProp: {
      deep: true,
      handler(value) {
        // Set the values with a timeout.
        // Otherwise, the click listener for closing the flyout will believe that the flyout is already open
        // When it is in fact just being opened
        setTimeout(() => {
          this.calendarEvent = value;
          this.isVisible = !!value;
          this.$nextTick(() => this.setFlyoutPosition());
        }, 10);
      },
    },
  },

  mounted() {
    this.listenForClickOutside();
  },

  beforeUnmount() {
    document.removeEventListener('click', this.closeFlyoutOnClickOutside);
  },

  methods: {
    setFlyoutPosition() {
      const calendar = this.eventElement?.closest('.calendar-root');
      const flyout = document.querySelector('.event-flyout');

      if (!this.eventElement) return;

      const flyoutPosition = eventFlyoutPositionHelper.calculateFlyoutPosition(
        this.eventElement?.getBoundingClientRect(),
        {
          height: flyout?.clientHeight || 300,
          width: flyout?.clientWidth || 0,
        },
        calendar ? calendar.getBoundingClientRect() : null
      );

      this.top = typeof flyoutPosition?.top === 'number' ? flyoutPosition.top : null;
      this.left = typeof flyoutPosition?.left === 'number' ? flyoutPosition.left : null;
    },

    editEvent() {
      this.$emit('edit-event', this.calendarEvent?.id);
      this.closeFlyout();
    },

    deleteEvent() {
      this.$emit('delete-event', this.calendarEvent?.id);
      this.closeFlyout();
    },

    closeFlyout() {
      this.isVisible = false;

      setTimeout(() => {
        this.$emit('hide');
      }, 100);
    },

    getDateFromDateString(dateString: string) {
      const { year, month, date } =
        this.time.getAllVariablesFromDateTimeString(dateString);

      return new Date(year, month, date).toLocaleDateString(
        this.time.CALENDAR_LOCALE,
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      );
    },

    listenForClickOutside() {
      document.addEventListener('click', this.closeFlyoutOnClickOutside);
    },

    closeFlyoutOnClickOutside(e: any) {
      const flyout = document.querySelector('.event-flyout');
      if (!flyout || !this.isVisible) return;

      const isClickOutside = !flyout.contains(e.target);
      const isClickOnEvent = !!e.target.closest('.is-event');
      const closeOnClickOutside = this.config.eventDialog?.closeOnClickOutside ?? true;

      if (this.isVisible && isClickOutside && !isClickOnEvent && closeOnClickOutside) {
        this.closeFlyout();
      }
    },
  },
});
</script>

<style scoped lang="scss">
@use '../../styles/mixins' as mixins;

.event-flyout {
  position: fixed;
  z-index: 50;
  background-color: #fff;
  max-height: 100%;
  width: v-bind(flyoutWidth);
  max-width: 98%;
  border: var(--qalendar-border-gray-thin);
  border-radius: 8px;
  box-shadow: 0 12px 24px rgb(0 0 0 / 9%), 0 6px 12px rgb(0 0 0 / 18%);
  overflow: hidden;
  transition: all 0.2s ease;
  transition-property: opacity, transform;
  transform: translateY(-40px);
  opacity: 0;
  pointer-events: none;

  @include mixins.dark-mode {
    background-color: var(--qalendar-dark-mode-elevated-surface);
    border-color: transparent;
  }

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: initial;
  }

  &__relative-wrapper {
    position: relative;
  }

  &__menu {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .event-flyout__menu-editable,
    .event-flyout__menu-close {
      padding: var(--qalendar-spacing) var(--qalendar-spacing) 0
        var(--qalendar-spacing);
      display: flex;
      grid-gap: 20px;
    }

    .event-flyout__menu-close {
      .is-not-editable & {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }

  &__menu-item {
    font-size: var(--qalendar-font-l);
    color: gray;

    @include mixins.dark-mode {
      color: var(--qalendar-dark-mode-text-hint);
    }

    &:hover {
      color: var(--qalendar-theme-color);
      cursor: pointer;
    }
  }

  .is-trash-icon {
    &:hover {
      color: red;
    }
  }

  &__info-wrapper {
    padding: var(--qalendar-spacing);
  }

  &__row {
    display: flex;
    grid-gap: var(--qalendar-spacing);
    margin-bottom: 0.25em;
    font-weight: 400;

    p {
      margin: 0;
      padding: 0;
    }

    svg {
      margin-top: 0.1rem;
      color: #5f6368;
      width: 14px;

      @include mixins.dark-mode {
        color: var(--qalendar-dark-mode-text-hint);
      }
    }
  }

  &__color-icon {
    --icon-height: 16px;

    border-radius: 50%;
    height: var(--icon-height);
    width: var(--icon-height);
  }

  .is-title {
    font-size: var(--qalendar-font-l);
    align-items: center;

    .is-not-editable & {
      max-width: 90%;
    }
  }

  .is-time {
    font-size: var(--qalendar-font-s);
    margin-bottom: 0.75em;
  }
}
</style>
