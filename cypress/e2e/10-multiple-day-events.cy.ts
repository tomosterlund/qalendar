describe('SmallQalendar', () => {
  beforeEach(() => {
    cy.visit('/#/cypress/multiple-day-events')
  })

  it('Renders an event starting on 5th of January, until 6th of March in week mode', () => {
    cy
      .get('.calendar-week__event')
      .click({ force: true })

    cy
      .get('.event-flyout__row.is-time')
      .should('contain.text', 'January 5, 2023 12:52 AM - March 6, 2023 2:52 AM')
  })

  it('Renders an event starting on 5th of January, until 6th of March in month mode', () => {
    // @ts-ignore
    cy.changeMode('month')

    cy
      .get('.calendar-month__event-title')
      .first()
      .click({ force: true })

    cy
      .get('.event-flyout__row.is-time')
      .should('contain.text', 'January 5, 2023 12:52 AM - March 6, 2023 2:52 AM')
  })

  it('Displays all correct days in month mode', () => {
    // @ts-ignore
    cy.changeMode('month')

    cy
      .get('.calendar-month__event-title')
      .should('have.length', 32)

    cy
      .get('.calendar-header__chevron-arrow-right')
      .click({ force: true })

    cy
      .get('.calendar-month__event-title')
      .should('have.length', 35)

    cy
      .get('.calendar-header__chevron-arrow-right')
      .click({ force: true })

    cy
      .get('.calendar-month__event-title')
      .should('have.length', 8)
  })
})
