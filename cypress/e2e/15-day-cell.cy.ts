describe('day cell slot', () => {
  beforeEach(() => {
    cy.visit('/#/cypress/day-cell')
  })

  it('Renders a custom day cell', () => {
    // check that the first .calendar-month__weekday has zero events
    cy
      .get('.calendar-month__weekday')
      .first()
      .should('contain.text', '0 events')

    // check that the cell with text 27 has 1 event
    cy
      .get('#day-2022-11-27')
      .should('contain.text', '1 event')
  });
})
