TODOS:
1. remove processEvents in Qalendar.vue. Multi-day timed events should be displayed like full day events.
2. fix date of multi-day timed events in EventFlyout.vue
3. Write thorough E2E tests for:
    - multi-day timed events
    - multi-day full day events
    - single day timed events
    - single day full day events
    - multi-day timed events with month and year breaks
    - multi-day full day events with month and year breaks
    - ALL of the above with no custom day boundaries
    - ALL of the above with custom day boundaries
    - ALL of the above with custom day boundaries spanning 2 real days