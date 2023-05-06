export default class PageObject {

  static clickChevronRight(nTimes = 1) {
    const elem = cy.get('.calendar-header__chevron-arrow-right')

    for (let i = 0; i < nTimes; i++) {
      elem.click()
    }
  }

  static setMonthMode() {
    // @ts-ignore
    cy.changeMode('month')
  }

  static goTo31stDecember() {
    cy
    .get('.date-picker__value-display-text')
    .click()
    .get('.date-picker__toggle-mode')
    .click()
    .get('.has-month')
    .eq(11)
    .click()

    cy.get('.date-picker')
    .contains('31')
    .get('.has-day')
    .contains('31')
    .click()
  }
}
