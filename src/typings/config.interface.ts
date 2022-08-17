import { modeType } from "./types";

export type dayStartOrEnd =
  | 0
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 1000
  | 1100
  | 1200
  | 1300
  | 1400
  | 1500
  | 1600
  | 1700
  | 1800
  | 1900
  | 2000
  | 2100
  | 2200
  | 2300
  | 2400;

export type colorScheme = { color: string; backgroundColor: string };

export interface colorSchemes {
  [key: string]: colorScheme;
}

export type intervalLengthType = 15 | 30 | 60;

// Lets the implementer define:
// a) length in minutes, of the day intervals
// b) the height of each individual interval
// c) whether the intervals should appear graphically as clickable elements or not
export type dayIntervalsType = {
  length?: intervalLengthType;
  height?: number;
  displayClickableInterval?: boolean;
  intervalStyles?: { [key: string]: any };
}

export interface configInterface {
  locale?: string;
  week?: {
    nDays?: 5 | 7;
    startsOn?: "sunday" | "monday";
    scrollToHour?: number;
  };
  style?: {
    fontFamily?: string;
    colorSchemes?: colorSchemes;
  };
  defaultMode?: modeType;
  disableModes?: ('week'|'month')[];
  isSilent?: boolean;
  dayIntervals?: dayIntervalsType;
  eventDialog?: {
    isDisabled?: boolean;
    isCustom?: boolean;
  }
}
