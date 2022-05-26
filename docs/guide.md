## Getting started

### Installing

```
npm install qalendar
```

### Basic usage

<br>

<script setup>
import Qalendar from '../src/Qalendar.vue'
</script>

<Qalendar :config="{ locale: 'en-US' }" :events="[ { title: 'Foo', color: 'blue', time: { start: '2022-05-23 08:00', end: '2022-05-23 09:00' } }, { title: 'Bar', color: 'green', time: { start: '2022-05-23 10:00', end: '2022-05-23 11:30' } }, { title: 'Foo', color: 'blue', time: { start: '2022-05-23 10:00', end: '2022-05-23 11:30' } } ]" />