describe('DragAndDrop.vue', () => {
  beforeEach(() => {
    cy.visit('#/cypress/drag-and-drop');
  });

  it('Drags an editable event within a day', () => {
    const initialTimeString = '9:20 AM - 10:20 AM'
    cy.get('.is-time').then($el => {
      expect($el).to.have.text(initialTimeString)
    })
    let initialY = 0

    cy.get('.calendar-week__event').then($calendarEvent => {
      initialY = $calendarEvent.position().top
    })
    
    cy.get('.calendar-week__event')
      .trigger('mousedown')
      .trigger('mousemove', { clientY: initialY + 300 })

    cy.get('.is-time').then($el => {
      expect($el).not.to.have.text(initialTimeString)
    })
  });

  it.skip('Drags an editable event between days', () => {

  });

  it.skip('Fails dragging a non-editable event', () => {

  });
})