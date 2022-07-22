# Qalendar

Qalendar is an event calendar for Vue 3. It is written in Typescript, in order to provide the best possible usability for JS- as well as TS-based applications.

## Getting started

### Installing

```
npm install qalendar
```

### Basic usage

``` vue
<template>
    <Qalendar :events="events" />
</template>

<script>
import {Qalendar} from "qalendar";

export default {
    components: {
        Qalendar,
    },

    data() {
        return {
            events: [
                // ...
                {
                  title: "Advanced algebra",
                  with: "Chandler Bing",
                  time: { start: "2022-05-16 12:05", end: "2022-05-16 13:35" },
                  color: "yellow",
                  isEditable: true,
                  id: "753944708f0f",
                  description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!"
                },
                {
                  title: "Ralph on holiday",
                  with: "Rachel Greene",
                  time: { start: "2022-05-10", end: "2022-05-22"},
                  color: "green",
                  isEditable: true,
                  id: "5602b6f589fc"
                }
                // ...
            ],
        }
    },
}
</script>

<style>
    /** Please observe,
    that your path to the node_modules directory might be different */
    @import '../../node_modules/qalendar/dist/style.css';
</style>
```

<br>

<div style="height: 800px">
    <Qalendar :selected-date="new Date(2022, 4, 16)" :events="seededEventsDemoWeek" />
</div>

### Style

As in the code example above, you need to import the styles for the component. Since Qalendar is aiming to be a responsive multi-purpose component, it avoids use of fixed height and width where possible. Therefore, for most use-cases you would probably want to place it in a wrapper with a fixed `height`, and possibly a `max-width`.

## Configuration

Qalendar takes a `config` prop, which contains all the most crucial options for configuring its behavior. `config` is passed as an object, which could look like this:

### Basic configuration

```js
data() {
    return {
        config: {
            week: {
                // Takes the value 'sunday' or 'monday'
                // However, if startsOn is set to 'sunday' and nDays to 5, the week displayed will be Monday - Friday
                startsOn: 'monday',
                // Takes the values 5 or 7.
                nDays: 7,
            },
            // Takes any valid locale that the browser understands. However, not all locales have been thorougly tested in Qalendar
            // If no locale is set, the preferred browser locale will be used
            locale: 'de-DE',
            style: {
                // When adding a custom font, please also set the fallback(s) yourself
                fontFamily: 'Nunito', sans-serif,
            },
            // if not set, the mode defaults to 'week'. The three available options are 'month', 'week' and 'day'
            // Please note, that smaller devices can only utilize the day mode
            defaultMode: 'day',
            // The silent flag can be added, to disable the development warnings. This will also bring a slight performance boost
            isSilent: true,
        }
    }
}
```

### Custom colors for events

All events can be given the `color` property with any of the given object properties of `EVENT_COLORS` in [this file](https://github.com/tomosterlund/qalendar/blob/master/src/constants.ts). However, you can also pass further color schemes in the `config` object, which the events can then utilize, such as:

```js
data() {
    return {
        config: {
            style: {
                colorSchemes: {
                    meetings: {
                        color: '#fff',
                        backgroundColor: '#131313',
                    },
                    sports: {
                        color: '#fff',
                        backgroundColor: '#ff4081',
                    }
                }
            },
        },
        events: [
            {
                title: 'Beep',
                time: { start: '2022-05-16 08:00', end: '2022-05-16 09:00' },
                colorScheme: 'meetings',
                id: '1',
            },
            {
                title: 'Boop',
                time: { start: '2022-05-16 08:00', end: '2022-05-16 09:00' },
                colorScheme: 'sports',
                id: '2',
            },
        ]
    }
}
```

## Guide

### Props

|      Name       |                                  Type                                   |                  Purpose                  |
|:---------------:|:-----------------------------------------------------------------------:|:-----------------------------------------:|
| `selected-date` |                                  Date                                   |    Define which date to show on render    |
|  `is-loading`   |                                 boolean                                 | Display a loading animation in the header |
|    `events`     | [see section "Calendar event properties"](./#calendar-event-properties) |                                           |
|    `config`     |             [see section "Configuration"](./#configuration)             |                                           |


### Calendar event properties

A calendar event can have the following properties:

|    Property     |                  type / accepted values                  | Required |                                                                |
|:---------------:|:--------------------------------------------------------:|:--------:|:--------------------------------------------------------------:|
|      `id`       |                      string, number                      |   yes    |                                                                |
|     `title`     |                          string                          |   yes    |                                                                |
|     `time`      |                eventTime (see type below)                |   yes    |                                                                |
|     `topic`     |                          string                          |    no    |                                                                |
|  `description`  |                       string/html                        |    no    | HTML content can be anything that can be descendant of a p-tag |
|   `location`    |                          string                          |    no    |                                                                |
|     `with`      |                          string                          |    no    |                                                                |
|     `color`     |            'blue', 'yellow', 'green' or 'red'            |    no    |                                                                |
|  `colorScheme`  |                          string                          |    no    |                       overwrites 'color'                       |
|  `isEditable`   |                         boolean                          |    no    |         Yields icons for editing and deleting an event         |
|  `disableDnD`   | array of strings - accepts values 'month', 'week', 'day' |    no    |    Disable drag & drop for an event in the specified modes     |
| `disableResize` |     array of strings - accepts values 'week', 'day'      |    no    |      Disable resizing for an event in the specified modes      |

```ts
type eventTime = { start: string; end: string };
```

For timed events, the required format of `time.start` and `time.end` is `YYYY-MM-DD hh:mm`, for example `2022-06-16 16:00`.

For full day events, or events spanning multiple days. The required format is `YYYY-MM-DD`, such as `2022-06-16`.

### Emitted events

Qalendar emits the following events that can be listened to:

|     Event name      |                                  Purpose                                   |
|:-------------------:|:--------------------------------------------------------------------------:|
| `event-was-clicked` |                                                                            |
| `event-was-dragged` |            emits the updated event, after an event was dragged             |
| `event-was-resized` |            emits the updated event, after an event was resized             |
|  `updated-period`   |      emits the value with the new period selected in the date picker       |
|   `updated-mode`    | emits the new selected mode and the period, when the user changes the mode |
|    `edit-event`     |         is triggered, when a user clicks the edit-icon of an event         |
|   `delete-event`    |        is triggered, when a user clicks the delete-icon of an event        |

### Drag and drop

Updating events by dragging them across the UI is available in all calendar modes (day, week, month). However, three criteria need to be met, in order for a calendar event to be draggable:

* The event needs the property `isEditable` to be set to `true`
* The event needs to be a single day event. For example, an event with `time: { start: '2022-06-24', end: '2022-06-27' }` cannot be dragged
* The user device needs to allow for pointer events, meaning touch events (smartphone, iPad) won't trigger a drag & drop.

### A word on language

As stated in the configuration section, `config.locale` can be any locale understood by the browser. If no locale is set explicitly, Qalendar will use the user's default browser locale. This is made possible, since all occurrences of time or date in the calendar are localized through the native JavaScript APIs. However, since a few words ("month", "week" etc.) need to be hard coded, some words may not be translated in the selected locale. For all vocabulary where translations are missing, translations for "en-US" will be used as a fallback.

If you're using Qalendar, and translations for your specific locale are missing, consider opening a [pull request](https://github.com/tomosterlund/qalendar), editing the two files in `./src/language`.

### A more elaborate example

A month view:

<div style="height: 800px">
    <Qalendar :selected-date="new Date(2022, 0, 8)" :events="events" :config="config"  />
</div>

From this code:

```vue
<template>
  <Qalendar
    :selected-date="new Date(2022, 0, 8)"
    :events="events"
    :config="config"
  />
</template>

<script>
import { Qalendar } from "qalendar";

export default {
  components: {
    Qalendar,
  },

  data() {
    return {
      events: [
        {
          title: "Meeting with Dora",
          with: "Albert Einstein",
          time: { start: "2022-01-01 04:52", end: "2022-01-01 05:37" },
          color: "green",
          isEditable: true,
          id: "de471c78cb5c",
          description:
            "Think of me as Yoda. Only instead of being little and green, I wear suites and I'm awesome.",
        },
        {
          title: "Advanced algebra",
          with: "Pheobe Buffay",
          time: { start: "2022-01-02 20:05", end: "2022-01-02 21:35" },
          colorScheme: "sports",
          isEditable: true,
          id: "6d3c0980a5cf",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!",
        },
        {
          title: "Break",
          with: "Marshall Eriksen",
          time: { start: "2022-01-02 22:10", end: "2022-01-02 22:55" },
          colorScheme: "meetings",
          isEditable: true,
          id: "9f1b209982f1",
          location: "Zoom",
        },
        // ... and more
      ],

      config: {
        locale: "zh-CN",
        defaultMode: "month",
        style: {
          colorSchemes: {
            meetings: {
              color: "#fff",
              backgroundColor: "#131313",
            },
            sports: {
              color: "#fff",
              backgroundColor: "#ff4081",
            },
          },
        },
      },
    };
  },
};
</script>
```

## Date picker

### Usage

The date picker from the Qalendar-header, can also be used as a stand-alone component:

```vue
<template>
  <DatePicker locale="en-US" firstDayOfWeek="sunday" @updated="handleUpdate" />
</template>

<script>
import { DatePicker } from "qalendar";

export default {
  components: { DatePicker },

  methods: {
    handleUpdate(payload) {
      const { year, month, date } = payload;
    },
  },
};
</script>
```

<DatePicker locale="en-US" first-day-of-week="sunday"  />

The DatePicker component emits one event, `updated`, the payload of which can be spread into three variables: `year`, `month` and `date`, see example above.

### Props

|        Prop         | Type / Accepted values | Required |
|:-------------------:|:----------------------:|:--------:|
|      `locale`       |         string         |   yes    |
| `first-day-of-week` |  `sunday` or `monday`  |   yes    |
|   `default-date`    |          Date          |    no    |

<script setup>
import Qalendar from '../src/Qalendar.vue';
import DatePicker from '../src/components/header/DatePicker.vue';
import {seededEventsDemoWeek} from './__data__/qalendar-demo';
import events from './__data__/qalendar-demo-2';

const config = {
    locale: 'zh-CN',
    defaultMode: 'month',
    style: {
        colorSchemes: {
            meetings: {
                color: '#fff',
                backgroundColor: '#131313',
            },
            sports: {
                color: '#fff',
                backgroundColor: '#ff4081',
            }
        }
    },
}

</script>
