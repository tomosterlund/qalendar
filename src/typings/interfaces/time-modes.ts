export enum DAY_MODE {
  // a regular day, starting and ending at 0:00 and 24:00
  REGULAR = 'regular',
  // a day with custom day boundaries, but within an actual calendar day
  SHORTENED = 'shortened',
  // a day with custom day boundaries, but spanning two actual calendar days,
  // for example, a day that starts at 06:00 and ends at 04:00 the day after
  FLEXIBLE = 'flexible',
}
