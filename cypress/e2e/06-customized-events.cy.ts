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
})