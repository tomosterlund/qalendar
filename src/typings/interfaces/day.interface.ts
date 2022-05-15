import {eventInterface} from "./event.interface";

export interface dayInterface {
	dayName: string;
	date: Date;
	events: eventInterface[];
}