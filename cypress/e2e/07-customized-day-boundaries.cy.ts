import PageObject from "../support/page-object";

const {
  getAllWeekEvents,
  getAllTimelineHours
} = PageObject

describe('CustomizedDayBoundaries.vue', () => {
  beforeEach(() => {
    cy.visit('#/cypress/customized-day-boundaries');
  });

  it('Finds exactly 3 events, because the other two are outside of day boundaries', () => {
    getAllWeekEvents().should('have.length', 3)
  });

  it('Finds 12 hours in the day timeline', () => {
    getAllTimelineHours().should('have.length', 12)
    cy.compareSnapshot('customized-day-boundaries')
  })
})
