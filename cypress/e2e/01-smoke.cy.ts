import PageObject from "../support/page-object";

const {
  getQalendarRoowWrapper,
  getToday,
  assertIsDayMode,
  assertIsMonthMode,
  assertIsWeekMode,
  setDayMode,
  setMonthMode,
  setWeekMode,
  openDatePicker,
  navigateForwardInDatePicker,
  clickFirstDayInDatePicker,
  getPeriodName,
} = PageObject

describe('Rendering the component', () => {
  beforeEach(() => {
    cy.visit('#/cypress/smoke');
  });

  it('Renders Qalendar', () => {
    getQalendarRoowWrapper().should('exist')
  });

  it('Highlights the current date, using the "is-today" class', () => {
    const today = new Date()

    getToday().contains(today.getDate().toString())
  });

  it('Selects the different modes', () => {
    assertIsWeekMode()
    cy.compareSnapshot('01-smoke__week-mode')

    setMonthMode()
    assertIsMonthMode()
    cy.compareSnapshot('01-smoke__month-mode')

    setDayMode()
    assertIsDayMode()
    cy.compareSnapshot('01-smoke__day-mode')

    setWeekMode()
    assertIsWeekMode()
  });

  it('Opens the date picker and navigates through months', () => {
    let periodName = 'randomString';
    getPeriodName().then(periodNameElement => (periodName = periodNameElement.text()))

    openDatePicker()
    navigateForwardInDatePicker()
    navigateForwardInDatePicker()
    cy.wait(1000)
    clickFirstDayInDatePicker()

    getPeriodName().then(periodNameElement => {
      expect(periodNameElement.text()).to.not.equal(periodName)
    })
  });

  it('Keeps selected mode on resizing', () => {
    assertIsWeekMode()

    setMonthMode()
    assertIsMonthMode()

    // Resize the window
    cy.viewport(1000, 500).wait(1000)

    assertIsMonthMode()
  })
})
