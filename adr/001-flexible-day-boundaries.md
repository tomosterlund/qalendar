# Flexible day boundaries

## Context

Until now, one could only set `dayBoundaries.start < 23 && dayBoundaries.start > 0`.
Also `dayBoundary.end` had to be greater than `dayBoundaries.start` and less than or equal to 24.
With the following issue https://github.com/tomosterlund/qalendar/issues/117 it was suggested that
implementers should be able to set a `dayBoundaries.start` that is greater than the day end. For
example:

```js
const config = {
  dayBoundaries: {
    start: 4,
    end: 1
  }
}
```

This would have Qalendar show the day from 4am to 1am the next day.

## Decision

From v3.0.0 it will be allowed to set a `dayBoundaries.end` that is less than the day start, in
order to display days that span beyond midnight.

## Consequences

1. An event with time `{ start: '2023-03-26 03:00', end: '2023-03-26 04:00' }` will be displayed
   within the day
   of 2023-03-25 if `dayBoundaries.start` is set to 6 and `dayBoundaries.end` is set to 4.
2. The above rule applies to day & week mode.
3. The above rule does not apply to month mode. In month mode, all timed single-day events will be
   sorted into the day of their `dayBoundaries.start`.
4. The above rule applies does not apply to timed multi-day events that are displayed in the week
   header. Multi-day timed events will be displayed as starting on actual calendar day
   of `dayBoundaries.start`, and ending on the actual calendar day of `dayBoundaries.end`. 