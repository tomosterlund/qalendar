import PageObject from "../support/page-object";

const {
  getFirstEventInWeekTimeline,
  getFlyoutTime,
  setMonthMode,
  getFirstMonthEvent,
  getAllMonthEvents,
  clickChevronRight,
} = PageObject

describe('Multiple day events', () => {
  beforeEach(() => {
    cy.visit('/#/cypress/multiple-day-events')
  })

  it('Renders an event starting on 5th of January, until 6th of March in week mode', () => {
    getFirstEventInWeekTimeline().click({ force: true })
    getFlyoutTime()
      .should('contain.text', 'January 5, 2023 12:52 AM - March 6, 2023 2:52 AM')
  })

  it('Renders an event starting on 5th of January, until 6th of March in month mode', () => {
    setMonthMode()
    getFirstMonthEvent().click({ force: true })
    getFlyoutTime()
      .should('contain.text', 'January 5, 2023 12:52 AM - March 6, 2023 2:52 AM')
  })

  it('Displays all correct days in month mode', () => {
    setMonthMode()
    getAllMonthEvents().should('have.length', 32)
    clickChevronRight()
    getAllMonthEvents().should('have.length', 35)
    clickChevronRight()
    getAllMonthEvents().should('have.length', 8)
  })
})
