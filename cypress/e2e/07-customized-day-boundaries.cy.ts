describe('CustomizedDayBoundaries.vue', () => {
  beforeEach(() => {
    cy.visit('#/cypress/customized-day-boundaries');
  });

  it('Finds exactly 3 events, because the other two are outside of day boundaries', () => {
    cy.get('.calendar-week__event').should('have.length', 3)
  });

  it('Finds 12 hours in the day timeline', () => {
    cy.get('.day-timeline__hour').should('have.length', 12)
  })
})
