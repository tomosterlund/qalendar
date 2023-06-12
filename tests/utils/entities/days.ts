import { dayInterface } from "../../../src/typings/interfaces/day.interface";
import { event1, event2 } from "./events";

export const dayMonday: dayInterface = {
  isTrailingOrLeadingDate: false,
  dayName: 'Monday',
  dateTimeString: '2021-01-01 00:00',
  events: [
    event1,
    event2,
  ],
}
