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
}
