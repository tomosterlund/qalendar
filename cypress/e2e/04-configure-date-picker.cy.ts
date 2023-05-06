class DatePickerObject {
  static getDisabledDays() {
    return cy.get('.is-disabled')
  }

  static getCurrentPeriod() {
    return cy.get('.date-picker__toggle-mode')
  }
}

describe('Configure date picker', () => {
  beforeEach(() => {
    cy.visit('#/cypress/configure-date-picker');
  });

  it('Finds 28 disabled days', () => {
    DatePickerObject.getDisabledDays().should('have.length', 28);
  })

  it('Sees the month of July 2022, set by the "defaultDate" prop', () => {
    DatePickerObject.getCurrentPeriod().should('have.text', 'Juli 2022');
  })
})
