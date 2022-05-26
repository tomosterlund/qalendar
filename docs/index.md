# Documentation
## About
Qalendar is an event calendar for Vue 3. It is written in Typescript, in order to provide the best possible usability for JS- as well as TS-based applications.

::: warning
This library is still in an early Beta version, and is not yet suitable for production applications.
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
import Qalendar from "../Qalendar.vue";

export default {
    components: {
        Qalendar,
    },

    data() {
        return {
            events: [
                {
                    title: 'Beep',
                    color: 'blue',
                    time: { start: '2022-05-16 08:00', end: '2022-05-16 09:00' }
                },
                {
                    title: 'Boop',
                    color: 'green',
                    time: { start: '2022-05-16 10:00', end: '2022-05-16 11:30' }
                {
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
    @import '../../node_modules/qalendar/dist/style.css';
</style>
```

<br>

<script setup>
import Qalendar from '../src/Qalendar.vue'
</script>

<Qalendar :selected-date-default="new Date(2022, 4, 16)" :events="[ { title: 'Foo', color: 'blue', time: { start: '2022-05-16 08:00', end: '2022-05-16 09:00' } }, { title: 'Bar', color: 'green', time: { start: '2022-05-16 10:00', end: '2022-05-16 11:30' } }, { title: 'Foo', color: 'blue', time: { start: '2022-05-16 10:00', end: '2022-05-16 11:30' } } ]" />

## Configuration

Qalendar takes a `config` prop, which contains all the most crucial options for configuring its behavior. `config` is passed as an object, which could look like this:

### Basic configuration

``` js
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
        }
    }
}
```

### Custom colors for events

All events can be given the `color` property with any of the given values `'blue' | 'green' | 'yellow' | 'red'`. However, you can also pass further color schemes in the `config` object, which the events can then utilize, such as:

``` js
data() {
    return {
        config: {
            style: {
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
        },
        events: [
            {
                title: 'Beep',
                time: { start: '2022-05-16 08:00', end: '2022-05-16 09:00' },
                colorScheme: 'meetings'
            },
            {
                title: 'Boop',
                time: { start: '2022-05-16 08:00', end: '2022-05-16 09:00' },
                colorScheme: 'sports'
            },
        ]
    }
}
```

## Guide

### Calendar event properties
A calendar event can bed given the following properties:

|   Property    |       type / accepted values       | Required  |                                                 |
|:-------------:|:----------------------------------:|:---------:|:-----------------------------------------------:|
|      id       |               string               |    yes    |                                                 |
|     title     |               string               |    yes    |                                                 |
|     time      |     eventTime (see type below)     |    yes    |                                                 |
|     topic     |               string               |    no     |                                                 |
|  description  |               string               |    no     |                                                 |
|   location    |               string               |    no     |                                                 |
|     with      |               string               |    no     |                                                 |
|     color     | 'blue', 'yellow', 'green' or 'red' |    no     |                                                 |
|  colorScheme  |               string               |    no     |               overwrites 'color'                |
|  isEditable   |              boolean               |    no     | Yields icons for editing and deleting an event  |

``` ts
type eventTime = { start: string, end: string } // start & end need the format YYYY-MM-DD hh:mm
```

### Emitted events
Qalendar emits the following events that can be listened to:

|    Event name     |                             Purpose                             |
|:-----------------:|:---------------------------------------------------------------:|
| event-was-clicked |                                                                 |
|  updated-period   | emits the value with the new period selected in the date picker |
| event-was-resized |       emits the updated event, after an event was resized       |
|    edit-event     |   is triggered, when a user clicks the edit-icon of an event    |
|   delete-event    |  is triggered, when a user clicks the delete-icon of an event   |
