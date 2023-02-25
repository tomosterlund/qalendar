describe('Configure date picker', () => {
  beforeEach(() => {
    cy.visit('#/cypress/configure-date-picker');
  });

  it('Finds 28 disabled days', () => {
    cy.get('.is-disabled').should('have.length', 28);
  })

  it('Sees the month of July 2022, set by the "defaultDate" prop', () => {
    cy.get('.date-picker__toggle-mode').should('have.text', 'Juli 2022');
  })
})
