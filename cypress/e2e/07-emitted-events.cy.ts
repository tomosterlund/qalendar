describe('EmittedEvents.vue', () => {
  beforeEach(() => {
    cy.visit('#/cypress/emitted-events')
  })

  it("Should display the output of the 'day-was-clicked' event after clicking day in week timeline", () => {
    cy
      .get('#day-was-clicked').should('not.exist')

    cy
      .get('.week-timeline__date')
      .first()
      .click()
      .get('#day-was-clicked').should('exist').should('contain', '2022-06-12')
  })

  it('Should display the output of the \'day-was-clicked\' event after clicking day in month', () => {
    cy
    // @ts-ignore
      .changeMode('month')
      .get('#day-was-clicked').should('not.exist')

    cy
      .wait(1000)
      .get('.calendar-month__weekday')
      .last()
      .click()
      .get('#day-was-clicked').should('exist').should('contain', '2022-07-02')
  });
})
