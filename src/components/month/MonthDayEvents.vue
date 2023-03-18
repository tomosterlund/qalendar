<template>
  <div>Day</div>
</template>
  
  <script lang="ts">
import { defineComponent, PropType } from 'vue';
import Time from '../../helpers/Time';
import { configInterface } from '../../typings/config.interface';
import { dayInterface } from '../../typings/interfaces/day.interface';


  export default defineComponent({
    name: 'MonthDayEvents',  
    props: {
      config: {
        type: Object as PropType<configInterface>,
        required: true,
      },
      time: {
        type: Object as PropType<Time>,
        required: true,
      },
      day: {
        type: Object as PropType<dayInterface>,
        required: false,
        default:null,
      },
  
    },
  
    emits: [
      'event-was-clicked',
      'event-was-dragged',
      'updated-period',
      'day-was-clicked',
    ],
  
    data() {
      return {
      
      };
    },
  
    computed: {
     
    },
  
    methods: {
     
    },
  });
  </script>
  
  <style lang="scss" scoped>
 
  </style>
  