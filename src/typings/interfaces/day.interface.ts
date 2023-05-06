import type { eventInterface } from "./event.interface";
import type { dayWithFullDayEvents } from './full-day-events-week.type';

export interface dayInterface {
  isTrailingOrLeadingDate?: boolean,
  dayName: string;
  dateTimeString: string;
  events: eventInterface[];
  fullDayEvents?: dayWithFullDayEvents;
}
