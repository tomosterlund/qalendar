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

export type dayIntervalsType = {
  length: intervalLengthType;
  height: number;
}

export interface configInterface {
  locale?: string;
  week?: {
    nDays?: 5 | 7;
    startsOn?: "sunday" | "monday";
    scrollToHour?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  };
  style?: {
    fontFamily?: string;
    colorSchemes?: colorSchemes;
  };
  defaultMode?: modeType;
  isSilent?: boolean;

  // Lets the implementer define:
  // a) length in time, of clickable intervals in a day
  // b) the height of each individual interval
  dayIntervals: dayIntervalsType;
}
