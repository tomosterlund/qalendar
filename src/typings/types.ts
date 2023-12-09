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

export type modeType = "day" | "week" | "month" | "agenda";

export enum DRAG_N_RESIZE_DIRECTION {
  BACKWARDS = "backwards",
  FORWARDS = "forwards",
}

export type DayInfo = {
  daysTotalN: number;
  thisDayIndex: number,
  dateTimeString: string
}

// Since the agenda doesn't need its own translations, we map it to the month mode
export enum ModeTranslationMapping {
  month = "month",
  agenda = "month",
  week = "week",
  day = "day",
}
