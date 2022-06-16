describe('FiveDayWeek.vue', () => {
  beforeEach(() => {
    cy.visit('#/cypress/five-day-week');
  });

  it('Gets a multiple day event, and opens it in EventFlyout', () => {
    cy.get('.week-timeline__event').first().click()
    cy.get('.event-flyout__row.is-title').contains('Advanced algebra')
  });

  it('Gets a timed event, and opens it in EventFlyout', () => {
    cy.get('.calendar-week__event').first().click()
    cy.get('.event-flyout__row.is-title').contains('Meeting: John w. parents')
  });

  it('Shuts the EventFlyout by clicking edit and delete icons', () => {
    cy.get('.calendar-week__event').first().click()
    cy.get('.is-trash-icon').click()
    cy.get('.event-flyout').should('not.be.visible')

    cy.get('.calendar-week__event').first().click()
    cy.get('.is-edit-icon').click()
    cy.get('.event-flyout').should('not.be.visible')
  });
})