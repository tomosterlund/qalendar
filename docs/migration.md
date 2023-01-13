# Migration guide

## v1 to v2

qalendar v2.0.0 came with one breaking change. This one affects all implementations using the `isCustom` property on events. Any implementations that **do not** use the `isCustom` property can safely be upgraded to v2.0.0.

In order to allow taking full control of the looks of an event, we have now added the possibility to customize the looks of an event in "month" mode as well. Previously, one could only take control of the looks of an event in modes "day" and "week".

To achieve this, simply keep passing the `isCustom` property to the event you want to customize, but now additionally add the scoped named slot `#monthEvent`. A basic example of how this can be implemented, can be seen in: https://github.com/tomosterlund/qalendar/blob/master/development/cypress/CustomizedEvents.vue

Additionally, it is now possible to disable the use of custom events per calendar mode. For this, please add the configuration option `disableCustomEvents` which takes an array with 0 or more of the following values: `day`, `week`, `month`.

## Side note on build output

For being able to support older applications and browsers as well, the build output was now changed from ESNext to ES2019. This should, however, not affect any applications already using the library, merely extending its domain of usage.