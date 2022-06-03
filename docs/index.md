# Documentation

Qalendar is an event calendar for Vue 3. It is written in Typescript, in order to provide the best possible usability for JS- as well as TS-based applications.

::: warning
This component is still in a 0.X.X-version, and is not yet suitable for production applications.
:::

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
                {
                    id: '123'
                    title: 'Beep',
                    color: 'blue',
                    time: { start: '2022-01-01 08:00', end: '2022-05-16 09:00' }
                },
                {
                    id: '456',
                    title: 'Boop',
                    color: 'green',
                    time: { start: '2022-05-16 10:00', end: '2022-05-16 11:30' }
                {
                    id: '789',
                    title: 'Foo',
                    color: 'blue',
                    time: { start: '2022-05-16 10:00', end: '2022-05-16 11:30' }
                }
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
    <Qalendar :selected-date="new Date(2022, 4, 16)" :events="[ { id: 1, title: 'Foo', color: 'blue', time: { start: '2022-05-16 08:00', end: '2022-05-16 09:00' } }, { id: 2, title: 'Bar', color: 'green', time: { start: '2022-05-16 10:00', end: '2022-05-16 11:30' } }, { id: 3, title: 'Foo', color: 'blue', time: { start: '2022-05-16 10:00', end: '2022-05-16 11:30' } } ]" />
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
            defaultMode: 'day'
        }
    }
}
```

### Custom colors for events

All events can be given the `color` property with any of the given values `'blue' | 'green' | 'yellow' | 'red'`. However, you can also pass further color schemes in the `config` object, which the events can then utilize, such as:

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

|   Property    |       type / accepted values       | Required |                                                |
|:-------------:|:----------------------------------:|:--------:|:----------------------------------------------:|
|     `id`      |           string, number           |   yes    |                                                |
|    `title`    |               string               |   yes    |                                                |
|    `time`     |     eventTime (see type below)     |   yes    |                                                |
|    `topic`    |               string               |    no    |                                                |
| `description` |               string               |    no    |                                                |
|  `location`   |               string               |    no    |                                                |
|    `with`     |               string               |    no    |                                                |
|    `color`    | 'blue', 'yellow', 'green' or 'red' |    no    |                                                |
| `colorScheme` |               string               |    no    |               overwrites 'color'               |
| `isEditable`  |              boolean               |    no    | Yields icons for editing and deleting an event |

```ts
type eventTime = { start: string; end: string }; // start & end need the format YYYY-MM-DD hh:mm
```

### Emitted events

Qalendar emits the following events that can be listened to:

|     Event name      |                             Purpose                             |
| :-----------------: | :-------------------------------------------------------------: |
| `event-was-clicked` |                                                                 |
|  `updated-period`   | emits the value with the new period selected in the date picker |
| `event-was-resized` |       emits the updated event, after an event was resized       |
|    `edit-event`     |   is triggered, when a user clicks the edit-icon of an event    |
|   `delete-event`    |  is triggered, when a user clicks the delete-icon of an event   |

### A word on language

As stated in the configuration section, `config.locale` can be any locale understood by the browser. This is made possible, since all occurrences of time or date in the calendar are localized through the native JavaScript APIs. However, since a few words ("month", "week" etc.) need to be hard coded, some words may not be translated in the selected locale. For all vocabulary where translations are missing, translations for "en-US" will be used as a fallback.

If you're using Qalendar, and translations for your specific locale are missing, consider opening a [pull request](https://github.com/tomosterlund/qalendar), editing the two files in ./src/language.

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

const events = [{
	"title": "Meeting with Dora",
	"with": "Albert Einstein",
	"time": {"start": "2022-01-01 04:52", "end": "2022-01-01 05:37"},
	"color": "green",
	"isEditable": true,
	"id": "de471c78cb5c",
	"description": "Think of me as Yoda. Only instead of being little and green, I wear suites and I'm awesome."
}, {
	"title": "Advanced algebra",
	"with": "Pheobe Buffay",
	"time": {"start": "2022-01-02 20:05", "end": "2022-01-02 21:35"},
	"colorScheme": "sports",
	"isEditable": true,
	"id": "6d3c0980a5cf",
	"description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!"
}, {
	"title": "Break",
	"with": "Marshall Eriksen",
	"time": {"start": "2022-01-02 22:10", "end": "2022-01-02 22:55"},
	"colorScheme": "meetings",
	"isEditable": true,
	"id": "9f1b209982f1",
	"location": "Zoom"
}, {
	"title": "English essay deadline",
	"with": "Ross Geller",
	"time": {"start": "2022-01-03 02:05", "end": "2022-01-03 02:55"},
	"color": "blue",
	"isEditable": true,
	"id": "9c85ae24b7f7",
	"description": "Think of me as Yoda. Only instead of being little and green, I wear suites and I'm awesome.",
	"location": "120 Center Str, 95872 Saint Cloud, MN"
}, {
	"title": "Advanced algebra",
	"with": "Max Mustermann",
	"time": {"start": "2022-01-03 17:30", "end": "2022-01-03 18:30"},
	"color": "yellow",
	"isEditable": true,
	"id": "fa558428df3c",
	"location": "Room 3002"
}, {
	"title": "Meeting with Dora",
	"with": "Ross Geller",
	"time": {"start": "2022-01-04 09:05", "end": "2022-01-04 10:35"},
	"color": "green",
	"isEditable": true,
	"id": "dee23be3fd33"
}, {
	"title": "Break",
	"with": "Marshall Eriksen",
	"time": {"start": "2022-01-05 16:05", "end": "2022-01-05 16:35"},
	"color": "blue",
	"isEditable": true,
	"id": "2302dc2fa49a",
	"description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!",
	"location": "29 40th Street, 12345 Chikinawa"
}, {
	"title": "Meeting: John w. parents",
	"with": "Monica Geller",
	"time": {"start": "2022-01-06 04:35", "end": "2022-01-06 06:05"},
	"color": "yellow",
	"isEditable": true,
	"id": "ce58cd392a8a"
}, {
	"title": "Outdoor sports",
	"with": "Barney Stinson",
	"time": {"start": "2022-01-06 12:50", "end": "2022-01-06 13:40"},
	"color": "green",
	"isEditable": true,
	"id": "4293bf845d98"
}, {
	"title": "Break",
	"with": "John Doe",
	"time": {"start": "2022-01-06 16:20", "end": "2022-01-06 17:50"},
	"color": "green",
	"isEditable": true,
	"id": "9af592cb2f05"
}, {
	"title": "English essay deadline",
	"with": "Tom Österlund",
	"time": {"start": "2022-01-07 04:50", "end": "2022-01-07 05:50"},
	"color": "green",
	"isEditable": true,
	"id": "accc6cd8e647",
	"description": "Pick up the dry cleaning. 234 Center Str.",
	"location": "The grand lecture hall"
}, {
	"title": "DEADLINE - english essay",
	"with": "Lily Aldrin",
	"time": {"start": "2022-01-07 07:14", "end": "2022-01-07 07:59"},
	"color": "yellow",
	"isEditable": true,
	"id": "2d4a22195468",
	"location": "Zoom"
}, {
	"title": "Break",
	"with": "Monica Geller",
	"time": {"start": "2022-01-07 13:35", "end": "2022-01-07 14:35"},
	"color": "yellow",
	"isEditable": true,
	"id": "208c0c6a35ff",
	"description": "Sports attire required"
}, {
	"title": "Outdoor sports",
	"with": "Chandler Bing",
	"time": {"start": "2022-01-08 00:30", "end": "2022-01-08 02:30"},
	"color": "yellow",
	"isEditable": true,
	"id": "f7745909c48e",
	"description": "Think of me as Yoda. Only instead of being little and green, I wear suites and I'm awesome."
}, {
	"title": "Introduction to algebra",
	"with": "John Doe",
	"time": {"start": "2022-01-08 23:47", "end": "2022-01-09 01:17"},
	"color": "yellow",
	"isEditable": true,
	"id": "59bcdd2b6ecf",
	"description": "Read textbook p. 70-72"
}, {
	"title": "Meeting with Dora",
	"with": "Marshall Eriksen",
	"time": {"start": "2022-01-11 19:35", "end": "2022-01-11 20:35"},
	"color": "yellow",
	"isEditable": true,
	"id": "712c65449155",
	"location": "Zoom"
}, {
	"title": "DEADLINE - english essay",
	"with": "Martin Gruber",
	"time": {"start": "2022-01-12 02:52", "end": "2022-01-12 03:52"},
	"color": "yellow",
	"isEditable": true,
	"id": "a5164269d8f7",
	"description": "Think of me as Yoda. Only instead of being little and green, I wear suites and I'm awesome."
}, {
	"title": "Advanced algebra",
	"with": "Joey Tribiani",
	"time": {"start": "2022-01-13 03:25", "end": "2022-01-13 05:25"},
	"color": "yellow",
	"isEditable": true,
	"id": "9368927cd7d7",
	"location": "Fejkvägen 90, 234 91 Solsidan"
}, {
	"title": "Advanced algebra",
	"with": "Joey Tribiani",
	"time": {"start": "2022-01-13 16:25", "end": "2022-01-13 17:55"},
	"color": "blue",
	"isEditable": true,
	"id": "c1a93c487de3"
}, {
	"title": "Break",
	"with": "Lily Aldrin",
	"time": {"start": "2022-01-14 02:15", "end": "2022-01-14 03:45"},
	"color": "blue",
	"isEditable": true,
	"id": "f3b541d4ef0a",
	"description": "Sports attire required",
	"location": "The green lab"
}, {
	"title": "Introduction to algebra",
	"with": "Marshall Eriksen",
	"time": {"start": "2022-01-14 15:14", "end": "2022-01-14 17:14"},
	"color": "green",
	"isEditable": true,
	"id": "0f82a9f8e028",
	"location": "Fejkvägen 90, 234 91 Solsidan"
}, {
	"title": "Break",
	"with": "Chandler Bing",
	"time": {"start": "2022-01-14 22:47", "end": "2022-01-14 23:32"},
	"color": "blue",
	"isEditable": true,
	"id": "0a4b8d3cddcc",
	"location": "29 40th Street, 12345 Chikinawa"
}, {
	"title": "DEADLINE - english essay",
	"with": "Max Mustermann",
	"time": {"start": "2022-01-15 02:05", "end": "2022-01-15 03:35"},
	"color": "blue",
	"isEditable": true,
	"id": "993a5bcfc99a",
	"location": "Zoom"
}, {
	"title": "Outdoor sports",
	"with": "Martin Gruber",
	"time": {"start": "2022-01-15 08:15", "end": "2022-01-15 10:15"},
	"color": "green",
	"isEditable": true,
	"id": "389fbc90dc9a",
	"location": "Room 3002"
}, {
	"title": "Introduction to algebra",
	"with": "Janina Elisabeth Parker Larson",
	"time": {"start": "2022-01-16 01:52", "end": "2022-01-16 03:52"},
	"color": "yellow",
	"isEditable": true,
	"id": "c533444e095f",
	"description": "Sports attire required"
}, {
	"title": "Call with Karo",
	"with": "Erika Musterfrau",
	"time": {"start": "2022-01-16 07:45", "end": "2022-01-16 08:45"},
	"color": "blue",
	"isEditable": true,
	"id": "d27a595e1887",
	"location": "Room 3002"
}, {
	"title": "Advanced algebra",
	"with": "Monica Geller",
	"time": {"start": "2022-01-16 08:30", "end": "2022-01-16 10:30"},
	"color": "yellow",
	"isEditable": true,
	"id": "4ed183aed6c1",
	"description": "Pick up the dry cleaning. 234 Center Str.",
	"location": "Zoom"
}, {
	"title": "Call with Karo",
	"with": "John Doe",
	"time": {"start": "2022-01-17 01:10", "end": "2022-01-17 02:40"},
	"color": "yellow",
	"isEditable": true,
	"id": "7614245ce352"
}, {
	"title": "English essay deadline",
	"with": "Janina Elisabeth Parker Larson",
	"time": {"start": "2022-01-17 05:40", "end": "2022-01-17 07:10"},
	"color": "blue",
	"isEditable": true,
	"id": "26f255ce4e4f",
	"description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!"
}, {
	"title": "Outdoor sports",
	"with": "Pheobe Buffay",
	"time": {"start": "2022-01-17 13:25", "end": "2022-01-17 14:25"},
	"color": "yellow",
	"isEditable": true,
	"id": "43cb549863c6"
}, {
	"title": "Meeting: John w. parents",
	"with": "John Doe",
	"time": {"start": "2022-01-17 19:47", "end": "2022-01-17 21:17"},
	"color": "blue",
	"isEditable": true,
	"id": "0d65a06418ea",
	"description": "Pick up the dry cleaning. 234 Center Str."
}, {
	"title": "Introduction to algebra",
	"with": "Martin Gruber",
	"time": {"start": "2022-01-17 23:00", "end": "2022-01-17 23:45"},
	"color": "yellow",
	"isEditable": true,
	"id": "99a83625a3af",
	"location": "The green lab"
}, {
	"title": "Break",
	"with": "Elisabeth Gruber",
	"time": {"start": "2022-01-18 12:55", "end": "2022-01-18 13:10"},
	"color": "blue",
	"isEditable": true,
	"id": "2aababcc1dcb",
	"description": "Sports attire required",
	"location": "Zoom"
}, {
	"title": "Advanced algebra",
	"with": "Erika Musterfrau",
	"time": {"start": "2022-01-19 01:15", "end": "2022-01-19 02:00"},
	"color": "green",
	"isEditable": true,
	"id": "10d7978e5d3a",
	"description": "Sports attire required",
	"location": "The grand lecture hall"
}, {
	"title": "Introduction to algebra",
	"with": "Max Mustermann",
	"time": {"start": "2022-01-20 12:50", "end": "2022-01-20 14:20"},
	"color": "yellow",
	"isEditable": true,
	"id": "33c04d6d4e77",
	"location": "Zoom"
}, {
	"title": "Introduction to algebra",
	"with": "Alejandro Montes Oca de Munós",
	"time": {"start": "2022-01-21 06:40", "end": "2022-01-21 08:10"},
	"color": "green",
	"isEditable": true,
	"id": "c3a64b41fcf8"
}, {
	"title": "Meeting: John w. parents",
	"with": "Monica Geller",
	"time": {"start": "2022-01-22 01:14", "end": "2022-01-22 02:44"},
	"color": "blue",
	"isEditable": true,
	"id": "371761255730",
	"description": "Pick up the dry cleaning. 234 Center Str."
}, {
	"title": "Meeting: John w. parents",
	"with": "Robin Scherbatsky",
	"time": {"start": "2022-01-22 20:30", "end": "2022-01-22 21:30"},
	"color": "yellow",
	"isEditable": true,
	"id": "7ef6b4e3ffd3",
	"description": "Pick up the dry cleaning. 234 Center Str."
}, {
	"title": "Call with Karo",
	"with": "Lily Aldrin",
	"time": {"start": "2022-01-22 21:30", "end": "2022-01-22 22:30"},
	"color": "yellow",
	"isEditable": true,
	"id": "b4c93a4f29b2",
	"location": "120 Center Str, 95872 Saint Cloud, MN"
}, {
	"title": "Introduction to algebra",
	"with": "Alejandro Montes Oca de Munós",
	"time": {"start": "2022-01-23 14:00", "end": "2022-01-23 15:00"},
	"color": "green",
	"isEditable": true,
	"id": "aa56751cb71c"
}, {
	"title": "Advanced algebra",
	"with": "Rachel Greene",
	"time": {"start": "2022-01-24 09:10", "end": "2022-01-24 10:40"},
	"color": "green",
	"isEditable": true,
	"id": "e90df5c186b3"
}, {
	"title": "Meeting: John w. parents",
	"with": "Lily Aldrin",
	"time": {"start": "2022-01-26 00:52", "end": "2022-01-26 02:22"},
	"color": "blue",
	"isEditable": true,
	"id": "d13ab708dfa6",
	"location": "The grand lecture hall"
}, {
	"title": "Break",
	"with": "Tom Österlund",
	"time": {"start": "2022-01-27 03:30", "end": "2022-01-27 05:00"},
	"color": "yellow",
	"isEditable": true,
	"id": "707132f8c153",
	"location": "The grand lecture hall"
}, {
	"title": "DEADLINE - english essay",
	"with": "Martin Gruber",
	"time": {"start": "2022-01-27 15:00", "end": "2022-01-27 15:45"},
	"color": "blue",
	"isEditable": true,
	"id": "e4a49a6fb185",
	"description": "Pick up the dry cleaning. 234 Center Str."
}, {
	"title": "Introduction to algebra",
	"with": "Erika Musterfrau",
	"time": {"start": "2022-01-28 00:00", "end": "2022-01-28 02:00"},
	"color": "yellow",
	"isEditable": true,
	"id": "dfd8a781aa32",
	"description": "Pick up the dry cleaning. 234 Center Str.",
	"location": "Room 3002"
}, {
	"title": "Outdoor sports",
	"with": "Alejandro Montes Oca de Munós",
	"time": {"start": "2022-01-28 11:00", "end": "2022-01-28 11:30"},
	"color": "blue",
	"isEditable": true,
	"id": "a2e3ba2ee7f7"
}, {
	"title": "Outdoor sports",
	"with": "Albert Einstein",
	"time": {"start": "2022-01-29 10:30", "end": "2022-01-29 12:30"},
	"color": "yellow",
	"isEditable": true,
	"id": "30c12052bda0",
	"location": "120 Center Str, 95872 Saint Cloud, MN"
}, {
	"title": "Outdoor sports",
	"with": "Robin Scherbatsky",
	"time": {"start": "2022-01-29 13:05", "end": "2022-01-29 15:05"},
	"color": "blue",
	"isEditable": true,
	"id": "4dd300524230",
	"location": "29 40th Street, 12345 Chikinawa"
}, {
	"title": "Break",
	"with": "Ted Mosby",
	"time": {"start": "2022-01-30 02:47", "end": "2022-01-30 04:17"},
	"color": "blue",
	"isEditable": true,
	"id": "f734a778ee51",
	"location": "The green lab"
}, {
	"title": "Break",
	"with": "Martin Gruber",
	"time": {"start": "2022-01-31 15:00", "end": "2022-01-31 16:30"},
	"color": "blue",
	"isEditable": true,
	"id": "c73c186f002d",
	"description": "Pick up the dry cleaning. 234 Center Str."
}];

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
