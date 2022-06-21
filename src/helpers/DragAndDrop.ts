import {eventInterface} from '../typings/interfaces/event.interface';

export default class DragAndDrop {
  draggedEvent: eventInterface|null

  constructor() {
    this.draggedEvent = null
  }

  setDraggedEvent(draggedEvent: eventInterface) {
    this.draggedEvent = draggedEvent
  }
}