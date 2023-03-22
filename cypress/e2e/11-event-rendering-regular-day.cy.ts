describe('event rendering - regular day', () => {
  beforeEach(() => {
    cy.visit('/#/cypress/events-regular-day')
  })

  it('Renders two timed single day events', () => {
    // get the sixth day with selector .calendar-week__day, and then the two events inside of it
    // data-ref="event-1" and data-ref="event-2"
    cy
      .get('.calendar-week__day')
      .eq(5)
      .find('.calendar-week__event')
      .should('have.length', 2)
  })

  it('renders first concurrent event to full width and no border', () => {
    cy
      .get('[data-ref="event-1"]')
      .should('have.attr', 'width', '100%')
      .should('have.css', 'border', 'none')
  })
})
