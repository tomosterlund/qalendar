import PageObject from "../support/page-object";

const {
  setMonthMode,
  getModePicker,
  getModePickerWeekOption,
  getModePickerMonthOption,
  getModePickerDayOption,
  getTrailingOrLeadingDays,
  getSelectedDayInAgenda,
  clickChevronRight,
  getElementWithId,
  getFlyoutTime,
  closeEventFlyout,
  getAgendaEvent,
} = PageObject

describe('SmallQalendar', () => {
  beforeEach(() => {
    cy.visit('/#/cypress/small-qalendar')
  })

  it('should only display mode options for day and month', () => {
    cy.compareSnapshot('small-qalendar')
    getModePicker().click()
    getModePickerMonthOption().should('exist')
    getModePickerDayOption().should('exist')
    getModePickerWeekOption().should('not.exist')
  })

  it('should display leading and trailing days by default in month mode', () => {
    setMonthMode()
    getTrailingOrLeadingDays().should('be.visible')
    cy.compareSnapshot('small-qalendar-month', 0.03)
  })

  it('should set selected date by default in month mode and display active style for it', () => {
    setMonthMode()
    getSelectedDayInAgenda().contains('27')
    clickChevronRight()
    getSelectedDayInAgenda().contains('1')
  })

  it('should open event flyout when clicking on events in agenda', () => {
    setMonthMode()

    getElementWithId('agenda__event-371d8f3228ac').click()
    getFlyoutTime().contains('November 24, 2022 - November 29, 2022')
    closeEventFlyout()

    cy.wait(1000)

    getElementWithId('agenda__event-3ec6a094b24e').click()
    getFlyoutTime().contains('November 27, 2022 ⋅ 12:25 AM - 1:55 AM')
  })

  it('should display all all events no matter if timed, full-day or hybrid', () => {
    setMonthMode()
    getAgendaEvent().should('have.length', 13)
  })
})
