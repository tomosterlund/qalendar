import PageObject from "../support/page-object";

const {
  getQalendarRootWrapper,
  getTodayInWeekMode,
  getTodayInMonthMode,
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
    getQalendarRootWrapper().should('exist')
  });

  it('Highlights the current date in week mode', () => {
    const today = new Date()
    getTodayInWeekMode().contains(today.getDate().toString())
  });

  it('Highlights the current date in month mode', () => {
    const today = new Date()
    setMonthMode()
    getTodayInMonthMode().contains(today.getDate().toString())
  });

  it('Selects the different modes', () => {
    assertIsWeekMode()

    setMonthMode()
    assertIsMonthMode()

    setDayMode()
    assertIsDayMode()

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
