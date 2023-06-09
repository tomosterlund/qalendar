import PageObject from "../support/page-object";

const {
  setMonthMode,
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

  it('Should only display mode options for day and month', () => {
    getModePicker().click()
    getModePickerMonthOption().should('exist')
    getModePickerDayOption().should('exist')
    getModePickerWeekOption().should('not.exist')
  })

  it('Should display leading and trailing days by default in month mode', () => {
    setMonthMode()
    getTrailingOrLeadingDays().should('be.visible')
  })
})
