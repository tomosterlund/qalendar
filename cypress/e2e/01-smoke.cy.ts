describe('Rendering the component', () => {
  beforeEach(() => {
    cy.visit('#/cypress/smoke');
  });

  it('Renders Qalendar', () => {
    cy.get('.calendar-root-wrapper')
  });

  it('Highlights the current date, using the "is-today" class', () => {
    const today = new Date()

    cy.get('div.week-timeline__day.is-today').contains(today.getDate().toString())
  });

  it('Selects the different modes', async () => {
    // 1. Start in week mode
    cy.get('.mode-is-week')

    // 2. Change to month mode
    cy.get('.calendar-header__mode-picker').click()
    cy.get('.is-month-mode').click()
    cy.get('.mode-is-month')

    // 3. Change to day mode
    cy.get('.calendar-header__mode-picker').click()
    cy.get('.is-day-mode').click()
    cy.get('.mode-is-day')

    // 4. Change back to week mode
    cy.get('.calendar-header__mode-picker').click()
    cy.get('.is-week-mode').click()
    cy.get('.mode-is-week')
  });

  it('Opens the date picker and navigates through months', () => {
    // Start in one month
    let periodName = 'randomString';
    cy.get('.calendar-header__period-name').first().then(periodNameElement => (periodName = periodNameElement.text()))

    cy.get('.date-picker').click()
    cy.get('.is-chevron-right').click()
    cy.get('.is-chevron-right').click()
    cy.get('.is-chevron-right').click()
    cy.get('.is-chevron-right').click()
    cy.get('.is-chevron-right').click()
    cy.get('.has-day').first().click()

    cy.get('.calendar-header__period-name').first().then(periodNameElement => {
      // Expect to have reached a different month
      expect(periodNameElement.text()).to.not.equal(periodName)
    })
  });
})