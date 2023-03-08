import { eventInterface } from "./event.interface";
import {dayWithFullDayEvents} from './full-day-events-week.type';

export interface dayInterface {
  isTrailingOrLeadingDate?: boolean,
  dayName: string;
  dateTimeString: string;
  events: eventInterface[];
  fullDayEvents?: dayWithFullDayEvents;
}
