describe('SmallQalendar', () => {
  beforeEach(() => {
    cy.visit('/#/cypress/small-qalendar')
  })

  it('Should visit a day, when clicking "more events" in month mode', () => {
    cy
    // @ts-ignore
      .changeMode('month')

    cy.get('.calendar-month__weekday-more')
      .first()
      .click()
      .get('.week-timeline__date')
      .should('have.text', '1')
  })

  it('Should only display mode options for day and month', () => {
    cy
      .get('.calendar-header__mode-picker')
      .click()

    cy.get('.is-month-mode').should('exist')
    cy.get('.is-day-mode').should('exist')
    cy.get('.is-week-mode').should('not.exist')
  })
})
