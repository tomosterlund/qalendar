import { modeType } from "./types";
import {WEEK_START_DAY} from "../helpers/Time";

export enum DAY_TIME_POINT {
  MIDNIGHT = 0,
  ONE_AM = 100,
  TWO_AM = 200,
  THREE_AM = 300,
  FOUR_AM = 400,
  FIVE_AM = 500,
  SIX_AM = 600,
  SEVEN_AM = 700,
  EIGHT_AM = 800,
  NINE_AM = 900,
  TEN_AM = 1000,
  ELEVEN_AM = 1100,
  TWELVE_PM = 1200,
  ONE_PM = 1300,
  TWO_PM = 1400,
  THREE_PM = 1500,
  FOUR_PM = 1600,
  FIVE_PM = 1700,
  SIX_PM = 1800,
  SEVEN_PM = 1900,
  EIGHT_PM = 2000,
  NINE_PM = 2100,
  TEN_PM = 2200,
  ELEVEN_PM = 2300,
  TWELVE_AM = 2400,
}

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
    startsOn?: WEEK_START_DAY;
    scrollToHour?: number;
  };
  style?: {
    fontFamily?: string;
    colorSchemes?: colorSchemes;
  };
  defaultMode?: modeType;
  disableModes?: ('week'|'month'|string)[];
  isSilent?: boolean;
  isSmall?: boolean;
  dayIntervals?: dayIntervalsType;
  eventDialog?: {
    isDisabled?: boolean;
    isCustom?: boolean;
  }
  dayBoundaries?: {
    start: number; // integer between 0 and 24
    end: number; // integer between 0 and 24
  }
  showCurrentTime?: boolean;

  //specific settings for month view
  month?:{
    //Hide the days of the next month and previous month in calendar to enhance the appearance
    showTrailingAndLeadingDates?:boolean,
    showAgenda?:boolean, // weither the   agenda will show on mobile view on not,
    agendaHeight?: "500px", // height of agenda part on mobile view
    showEventsOnMobileView?:boolean,
    selectedDayColor?: string,
  }
}
