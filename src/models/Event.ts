import type {EventColor, eventId, eventInterface} from "../typings/interfaces/event.interface";
import type {modeType} from "../typings/types";

export class EventImpl implements eventInterface {
  title?: string;
  description?: string;
  topic?: string;
  location?: string;
  with?: string;
  colorScheme?: string;
  color?: EventColor;
  isEditable?: boolean;
  disableDnD?: modeType[];
  disableResize?: modeType[];
  isCustom?: boolean | modeType[];

  // Properties that should not be set from outside Qalendar
  nOfPreviousConcurrentEvents?: number;

  constructor(
    public time: { start: string; end: string },
    public id: eventId,
  ) {}
}

export class EventBuilder {
  private eventImpl: EventImpl;

  constructor(
    public time: { start: string; end: string },
    id?: eventId,
  ) {
    if (!id) id = Math.random().toString(36).substring(2, 9);
    this.eventImpl = new EventImpl(time, id);
  }

  build() {
    return this.eventImpl;
  }

  withTitle(title: string) {
    this.eventImpl.title = title;

    return this;
  }

  withColor(color: EventColor) {
    this.eventImpl.color = color;

    return this;
  }

  withColorScheme(colorScheme: string) {
    this.eventImpl.colorScheme = colorScheme;

    return this;
  }

  withDescription(description: string) {
    this.eventImpl.description = description;

    return this;
  }

  withTopic(topic: string) {
    this.eventImpl.topic = topic;

    return this;
  }

  withLocation(location: string) {
    this.eventImpl.location = location;

    return this;
  }

  withWith($with: string) {
    this.eventImpl.with = $with;

    return this;
  }

  withNOfPreviousConcurrentEvents(nOfPreviousConcurrentEvents: number) {
    this.eventImpl.nOfPreviousConcurrentEvents = nOfPreviousConcurrentEvents;

    return this;
  }

  withIsEditable(isEditable: boolean) {
    this.eventImpl.isEditable = isEditable;

    return this;
  }

  withIsCustom(isCustom: boolean | modeType[]) {
    this.eventImpl.isCustom = isCustom;

    return this;
  }

  withDisableDnD(disableDnD: modeType[]) {
    this.eventImpl.disableDnD = disableDnD;

    return this;
  }

  withDisableResize(disableResize: modeType[]) {
    this.eventImpl.disableResize = disableResize;

    return this;
  }
}
