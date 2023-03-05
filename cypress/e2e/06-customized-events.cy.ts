describe('CustomizedEvents.vue', () => {
  beforeEach(() => {
    cy.visit('#/cypress/customized-events');
  });

  it('Gets the title from a custom event', () => {
    cy.get('.calendar-week__event').first().contains('Meeting: John w. parents')
    // cy.get('.event-flyout.is-title').contains('Advanced algebra')
  });

  it('Opens a customized flyout from a custom event and closes it again', () => {
    cy.get('.calendar-week__event').first().click()
    cy.get('.flyout-input')
    cy.get('.close-flyout').click()
    cy.get('.event-flyout').should('not.be.visible')
  });

  it('Should display a custom monthEvent', () => {
    const calendarMonthEvent = 'calendar-month__event';
    // @ts-ignore
    cy.changeMode('month')

    // First check that a "normal" event is displayed
    cy
      .get('#calendar-month__event-98485e08441e2022-06-07')
      .should('be.visible')
      .should('have.class', calendarMonthEvent)

    // Then check that a custom event is displayed
    cy
      .get('#calendar-month__event-930ad71ff7e22022-06-07')
      .should('be.visible')
      .should('not.have.class', calendarMonthEvent)
  })

  it('Should open the event flyout on clicking a custom monthEvent', () => {
    // @ts-ignore
    cy.changeMode('month')
    cy.get('.event-flyout').should('not.be.visible')
    cy.get('#calendar-month__event-930ad71ff7e22022-06-07').click()
    cy.get('.event-flyout').should('be.visible')
  })
})
