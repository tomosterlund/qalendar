describe('DisableDnD.vue', () => {
  beforeEach(() => {
    cy.visit('#/cypress/disable-dnd');
  });

  it('Should find an event with disabled DnD in week mode', () => {
    cy.get('.calendar-week__event.is-editable.has-disabled-dnd').should('have.length', 1);
  })

  it('Should find an event with disabled DnD in day mode', () => {
    // Change mode to day mode
    cy.get('.calendar-header__mode-picker').click();
    cy.get('.is-day-mode').click();

    // Assert that the event has disabled DnD
    cy.get('.calendar-week__event.is-editable.has-disabled-dnd').should('have.length', 1);
  });

  it('Should find an event with disabled DnD in month mode', () => {
    // Change mode to month mode
    cy.get('.calendar-header__mode-picker').click();
    cy.get('.is-month-mode').click();

    // Assert that the event has disabled DnD
    cy.get('div[draggable]').should('have.length', 0);
  });

  it('Should find an event that can be dragged and dropped in month mode', () => {
    // Change mode to month mode
    cy.get('.calendar-header__mode-picker').click();
    cy.get('.is-month-mode').click();

    // Go to January 2024
    cy.get('.calendar-header__chevron-arrow-right').click();

    // Expect to find a draggable event
    cy.get('div[draggable]').should('have.length', 1);
  })

  it('Should find an event that can be dragged and dropped in week mode', () => {
    // Navigate to 1st of January 2024
    cy.get('.date-picker__value-display').click()
    cy.get('.is-chevron-right').click()
    cy.get('.has-day').first().click()

    // Expect to find a draggable event
    cy.get('.calendar-week__event.is-editable.has-disabled-dnd').should('have.length', 0);
    cy.get('.calendar-week__event.is-editable').should('have.length', 1);
  })
})
