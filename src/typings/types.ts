import { DAY_TIME_POINT } from "./config.interface";

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

export type modeType = "day" | "week" | "month";

export enum DRAG_DIRECTION {
  BACKWARDS = "backwards",
  FORWARDS = "forwards",
}

export type DayInfo = {
  daysTotalN: number;
  thisDayIndex: number,
  dateTimeString: string
}
