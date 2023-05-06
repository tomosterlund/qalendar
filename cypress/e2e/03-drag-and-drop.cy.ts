import PageObject from "../support/page-object";

const {
  getEventTime,
  getFirstEventInWeek,
} = PageObject

describe('DragAndDrop.vue', () => {
  beforeEach(() => {
    cy.visit('#/cypress/drag-and-drop');
  });

  it('Drags an editable event within a day', () => {
    const initialTimeString = '9:20 AM - 10:20 AM'
    getEventTime().then($el => {
      expect($el).to.have.text(initialTimeString)
    })
    let initialY = 0

    getFirstEventInWeek().then($calendarEvent => {
      initialY = $calendarEvent.position().top

      getFirstEventInWeek()
        .trigger('mousedown', { which: 1 })
        .trigger('mousemove', { clientY: initialY + 300 })
        .trigger('mouseup')

      getEventTime().then($el => {
        expect($el).to.have.text('10:35 PM - 11:35 PM')
      })
    })
  });

  // TODO: Fix this test
  // it('Drags an editable event between days', () => {
  //   // 1. Go to next week
  //   PageObject.clickChevronRight()
  //
  //   // 2. Assert initial time
  //   const initialTimeString = '10:00 AM - 11:20 AM'
  //   cy.get('.is-time').then($el => {
  //     expect($el).to.have.text(initialTimeString)
  //   })
  //   let initialX = 0
  //   let initialY = 0
  //
  //   cy.get(EVENT_SELECTOR).then($calendarEvent => {
  //     initialY = $calendarEvent.position().top
  //     initialX = $calendarEvent.position().left
  //
  //     // 3. Drag event from Monday, to last day of week
  //     cy.get(EVENT_SELECTOR)
  //       .trigger('mousedown', { which: 1 })
  //       .trigger('mousemove', { clientX: initialX + 1000, clientY: initialY + 300 })
  //       .trigger('mouseup')
  //
  //     cy.get(EVENT_SELECTOR).click()
  //     cy.get('.event-flyout__row.is-time').then($el => {
  //       expect($el).to.have.text('June 10, 2022 ⋅ 11:45 PM - 1:05 AM')
  //     })
  //   })
  // });

  it('Fails dragging a non-editable event', () => {
    // 1. Go to the third week of June
    PageObject.clickChevronRight(2)

    // 2. Assert initial time
    const initialTimeString = '10:00 AM - 11:20 AM'
    cy.get('.is-time').then($el => {
      expect($el).to.have.text(initialTimeString)
    })
    let initialY = 0

    getFirstEventInWeek().then($calendarEvent => {
      initialY = $calendarEvent.position().top

      // 3. Try to drag an drop
      getFirstEventInWeek()
        .trigger('mousedown')
        .trigger('mousemove', { clientY: initialY + 300 })
        .trigger('mouseup')

      // 4. Time should not have changed
      getEventTime().then($el => {
        expect($el).to.have.text(initialTimeString)
      })
    })
  });
})

describe('DragAndDrop on mobile', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
    cy.visit('#/cypress/drag-and-drop');
  });

  it('Drags an editable event within a day', () => {
    const initialTimeString = '9:20 AM - 10:20 AM';
    cy.get('.is-time').then(($el) => {
      expect($el).to.have.text(initialTimeString);
    });
    let initialY = 0;

    getFirstEventInWeek().then(($calendarEvent) => {
      initialY = $calendarEvent.position().top;

      getFirstEventInWeek()
      .trigger('touchstart')
      .trigger('touchmove', { clientY: initialY + 300 })
      .trigger('touchend');

      getEventTime().then(($el) => {
        expect($el).not.to.have.text(initialTimeString);
      });
    });
  });
});
