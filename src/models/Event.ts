import {EventColor, eventId, eventInterface} from "../typings/interfaces/event.interface";
import {modeType} from "../typings/types";

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
}
