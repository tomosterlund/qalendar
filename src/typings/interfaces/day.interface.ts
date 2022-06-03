import { eventInterface } from "./event.interface";

export interface dayInterface {
  dayName: string;
  dateTimeString: string;
  events: eventInterface[];
}
