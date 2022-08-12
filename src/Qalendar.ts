/**
 * To be compiled into a d.ts file.
 * */
import Vue, { VNode } from 'vue';
import type {eventInterface} from './typings/interfaces/event.interface';
import type {configInterface} from './typings/config.interface';

interface tolerantEventInterface extends eventInterface {
  [key: string]: any;
}

// @ts-ignore
declare class Qalendar extends Vue {
  events: tolerantEventInterface[];
  config: configInterface;

  $slots: {
    eventDialog: VNode[];
    event: VNode[];
  };
}

export default Qalendar;
