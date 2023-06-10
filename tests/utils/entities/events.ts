import { eventInterface } from "../../../src/typings/interfaces/event.interface";
import { EventBuilder } from "../../../src/models/Event";

export const event1: eventInterface = new EventBuilder(
  {
    start: '2021-01-01 00:00',
    end: '2021-01-01 01:00',
  }
)
.withTitle('Event 1')
.withDescription('Event 1 description')
.build();

export const event2: eventInterface = new EventBuilder(
  {
    start: '2021-01-02 00:00',
    end: '2021-01-02 01:00',
  }
)
.withTitle('Event 2')
.withDescription('Event 2 description')
.build();
