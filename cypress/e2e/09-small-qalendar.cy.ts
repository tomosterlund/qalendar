import PageObject from "../support/page-object";

const {
  setMonthMode,
  clickViewMoreEventsOnFirstMonthEvent,
  getFirstTimelineDate,
  getModePicker,
  getModePickerWeekOption,
  getModePickerMonthOption,
  getModePickerDayOption,
  getTrailingOrLeadingDays,
} = PageObject

describe('SmallQalendar', () => {
  beforeEach(() => {
    cy.visit('/#/cypress/small-qalendar')
  })

  it('Should visit a day, when clicking "more events" in month mode', () => {
    setMonthMode()
    clickViewMoreEventsOnFirstMonthEvent()
    getFirstTimelineDate().should('have.text', '1')
  })

  it('Should only display mode options for day and month', () => {
    getModePicker().click()
    getModePickerMonthOption().should('exist')
    getModePickerDayOption().should('exist')
    getModePickerWeekOption().should('not.exist')
  })

  it('Should not display leading or trailing days in month mode', () => {
    setMonthMode()
    getTrailingOrLeadingDays().should('not.be.visible')
  })
})
