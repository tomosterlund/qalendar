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

  it('Shuts the EventFlyout by clicking the delete icon', () => {
    cy.get('.calendar-week__event').first().click()
    cy.get('.is-trash-icon').click()
    cy.get('.event-flyout').should('not.be.visible')
  });

  it('Shuts the EventFlyout by clicking the edit icon', () => {
    cy.get('.calendar-week__event').first().click()
    cy.get('.is-edit-icon').click()
    cy.get('.event-flyout').should('not.be.visible')
  })

  it('Shuts the event flyout on click outside, but not on click inside', () => {
    // 1. Assert that the event flyout is visible
    cy.get('.event-flyout').should('not.be.visible')
    cy.get('.calendar-week__event').first().click()
    cy.get('.event-flyout').should('be.visible')

    // 2. Click somewhere inside the event flyout, and assert that it is still open
    cy.get('.event-flyout__info-wrapper').click()
    cy.get('.event-flyout').should('be.visible')

    // 3. Click somewhere outside the event flyout, and assert that it is now not visible anymore
    cy.get('.calendar-header__mode-picker').click()
    cy.get('.event-flyout').should('not.be.visible')
  })
})
