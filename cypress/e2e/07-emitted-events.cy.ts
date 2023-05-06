import PageObject from "../support/page-object";

const { setMonthMode } = PageObject

describe('EmittedEvents.vue', () => {
  beforeEach(() => {
    cy.visit('#/cypress/emitted-events')
  })

  it("Should display the output of the 'day-was-clicked' event after clicking day in week timeline", () => {
    cy
      .get('#day-was-clicked').should('not.exist')

    PageObject.getFirstTimelineDate()
      .click()
      .get('#day-was-clicked').should('exist').should('contain', '2022-06-12')
  })

  it('Should display the output of the \'day-was-clicked\' event after clicking day in month', () => {
    setMonthMode()
    cy.get('#day-was-clicked').should('not.exist')

    PageObject
      .getLastDayOfMonth()
      .click()
      .get('#day-was-clicked').should('exist').should('contain', '2022-07-02')
  });
})
