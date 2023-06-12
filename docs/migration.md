# Migration guide

## v1 to v2

qalendar v2.0.0 came with one breaking change. This one affects all implementations using
the `isCustom` property on events. Any implementations that **do not** use the `isCustom` property
can safely be upgraded to v2.0.0.

In order to allow taking full control of the looks of an event, we have now added the possibility to
customize the looks of an event in "month" mode as well. Previously, one could only take control of
the looks of an event in modes "day" and "week".

To achieve this, simply keep passing the `isCustom` property to the event you want to customize, but
now additionally add the scoped named slot `#monthEvent`. You also have to rename the `#event` slot
into `#weekDayEvent`. A basic example of how this can be
implemented, can be seen
in: https://github.com/tomosterlund/qalendar/blob/master/development/cypress/CustomizedEvents.vue

## Side note on build output

For being able to support older applications and browsers as well, the build output was now changed
from ESNext to ES2019. This should, however, not affect any applications already using the library,
merely extending its domain of usage.

## v2 to v3

### Breaking change:

The view for month mode on small devices has been rebuilt. Instead of displaying days in a column,
the month now has an "agenda" type layout, where each day can be clicked to display a list of
events. Nothing has to be configured for this. Nevertheless, if any of your business
logic or tests are tied to the type of elements that is displayed in the calendar, you might want to
test your implementation on a small screen before rolling out an update.

Please note, that in case you are using the `monthEvent` slot, this will now only work for larger
screens. The custom month event slot for mobile view will be released with a later minor version.