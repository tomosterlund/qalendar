import {dayStartOrEnd} from "./config.interface";

export type dayBoundaries = { start: dayStartOrEnd; end: dayStartOrEnd }

export interface DOMRect {
	bottom: number;
	height: number;
	left: number;
	right: number;
	top: number;
	width: number;
	x: number;
	y: number;
}