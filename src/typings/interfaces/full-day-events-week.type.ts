import type { eventInterface } from './event.interface';

export interface dayWithFullDayEvents {
  date: Date;
  [key: string]: eventInterface|any|string;
}

export type fullDayEventsWeek = dayWithFullDayEvents[]
