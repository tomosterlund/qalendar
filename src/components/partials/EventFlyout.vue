<template>
	<div class="event-flyout"
		 :class="{ 'is-visible': isVisible }"
		 :style="eventFlyoutInlineStyles">
		<div class="event-flyout__menu">
			<span>
				<font-awesome-icon class="event-flyout__menu-item is-edit-icon"
								   :icon="icons.edit"
								   @click="editEvent" />
				<font-awesome-icon class="event-flyout__menu-item is-trash-icon"
								   :icon="icons.trash"
								   @click="deleteEvent" />
			</span>

			<span>
				<font-awesome-icon class="event-flyout__menu-item is-times-icon"
								   :icon="icons.times"
								   @click="closeFlyout" />
			</span>
		</div>

		<div class="event-flyout__info-wrapper" v-if="calendarEvent">
			<div v-if="calendarEvent.title" class="event-flyout__row is-title">
				{{ calendarEvent.title }}
			</div>

			<div class="event-flyout__row is-time" v-if="calendarEvent.time">
				{{ getEventDate + ' ⋅ ' + getEventTime }}
			</div>

			<div v-if="calendarEvent.with" class="event-flyout__row">
				<font-awesome-icon :icon="icons.user" />
				{{ calendarEvent.with }}
			</div>

			<div v-if="calendarEvent.topic" class="event-flyout__row">
				<font-awesome-icon :icon="icons.topic" class="calendar-week__event-icon" />
				{{ calendarEvent.topic }}
			</div>

			<div v-if="calendarEvent.description" class="event-flyout__row">
				<font-awesome-icon :icon="icons.description" class="calendar-week__event-icon" />
				{{ calendarEvent.description }}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {eventInterface} from "../../typings/interfaces/event.interface";
import {DOMRect} from "../../typings/types";
import EventFlyoutPosition, {EVENT_FLYOUT_WIDTH} from "../../helpers/EventFlyoutPosition";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {faClock, faComment, faUser, faEdit, faTrashAlt, faQuestionCircle} from "@fortawesome/free-regular-svg-icons";
const eventFlyoutPositionHelper = new EventFlyoutPosition()
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import Time from "../../helpers/Time";

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
		eventElementDomRect: {
			type: Object as PropType<DOMRect|any>,
			required: true,
		},
		time: {
			type: Object as PropType<Time>,
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
			},
			calendarEvent: this.calendarEventProp,
			flyoutWidth: EVENT_FLYOUT_WIDTH + 'px',
		}
	},

	computed: {
		getEventTime() {
			if ( ! this.calendarEvent || ! this.calendarEvent.time) return null

			return this.time.getLocalizedTime(this.calendarEvent.time.start)
				+ ' - '
				+ this.time.getLocalizedTime(this.calendarEvent.time.end)
		},

		getEventDate() {
			if ( ! this.calendarEvent) return null

			return new Date(this.calendarEvent.time.start).toLocaleDateString(
				(<any>window).qalendar?.locale || navigator.language,
				{
					month: 'long',
					day: 'numeric',
				}
			)
		},

		eventFlyoutInlineStyles() {
			if ([typeof this.top, typeof this.left].some(x => x !== 'number')) {
				return {
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
				}
			}

			return {
				top: this.top + 'px',
				left: this.left + 'px',
			}
		}
	},

	methods: {
		setFlyoutPosition() {
			const flyout = document.querySelector('.event-flyout')

			const flyoutPosition = eventFlyoutPositionHelper.calculateFlyoutPosition(
				this.eventElementDomRect,
				{ width: window.innerWidth, height: window.innerHeight },
				{ height: flyout?.clientHeight || 300, width: flyout?.clientWidth || 0 }
			)

			this.top = flyoutPosition?.top || null
			this.left = flyoutPosition?.left || null
		},

		editEvent() {
			this.$emit('edit-event', this.calendarEvent?.id)
			this.closeFlyout()
		},

		deleteEvent() {
			this.$emit('delete-event', this.calendarEvent?.id)
			this.closeFlyout()
		},

		closeFlyout() {
			this.isVisible = false

			setTimeout(() => {
				this.$emit('hide')
			}, 100)
		}
	},
	
	watch: {
		calendarEventProp: {
			deep: true,
			handler(value) {
				this.isVisible = !!value;
				this.calendarEvent = value

				setTimeout(() => {
					this.setFlyoutPosition()
				}, 1)
			}
		}
	}
})
</script>

<style scoped lang="scss">

.event-flyout {
	position: fixed;
	z-index: 50;
	background-color: #fff;
	max-height: 100%;
	width: v-bind(flyoutWidth);
	max-width: 98%;
	border: var(--qalendar-border-gray-thin);
	border-radius: 8px;
	box-shadow: var(--qalendar-box-shadow);
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.18s ease;

	&.is-visible {
		opacity: 1;
		pointer-events: initial
	}

	&__menu {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--qalendar-spacing) var(--qalendar-spacing) 0 var(--qalendar-spacing);

		span {
			display: flex;
			grid-gap: 20px;
		}
	}

	&__menu-item {
		font-size: 20px;
		border-radius: 50%;
		color: gray;

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
		margin-bottom: 4px;
		font-weight: 400;
	}

	&__row {

		svg {
			color: #5f6368;
		}
	}

	.is-title {
		font-size: 20px;
	}

	.is-time {
		font-size: 14px;
		margin-bottom: var(--qalendar-spacing-half);
	}
}

</style>
