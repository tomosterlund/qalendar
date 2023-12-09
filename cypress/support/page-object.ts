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

  static setDayMode() {
    // @ts-ignore
    cy.changeMode('day')
  }

  static setWeekMode() {
    // @ts-ignore
    cy.changeMode('week')
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

  static assertIsWeekMode() {
    cy.get('.mode-is-week')
  }

  static assertIsMonthMode() {
    cy.get('.mode-is-month')
  }

  static assertIsDayMode() {
    cy.get('.mode-is-day')
  }

  static getTodayInWeekMode() {
    return cy.get('div.week-timeline__day.is-today')
  }

  static getTodayInMonthMode() {
    return cy.get('.calendar-month__weekday.is-today')
  }

  static getPeriodName() {
    return cy.get('.calendar-header__period-name').first()
  }

  static openDatePicker() {
    cy.get('.date-picker').click()
  }

  static navigateForwardInDatePicker() {
    cy.get('.is-chevron-right').click()
  }

  static clickFirstDayInDatePicker() {
    cy.get('.has-day').first().click()
  }

  static getQalendarRootWrapper() {
    return cy.get('.calendar-root-wrapper')
  }

  static getFirstEventInWeekTimeline() {
    return cy.get('.week-timeline__event').first()
  }

  static getEventFlyoutTitle() {
    return cy.get('.event-flyout__row.is-title')
  }

  static getFirstEventInWeek() {
    return cy.get('.calendar-week__event').first()
  }

  static getAllWeekEvents() {
    return cy.get('.calendar-week__event')
  }

  static getAllTimelineHours() {
    return cy.get('.day-timeline__hour')
  }

  static getFirstTimelineDate() {
    return cy
      .get('.week-timeline__date')
      .first()
  }

  static getLastDayOfMonth() {
    return cy
      .wait(1000)
      .get('.calendar-month__weekday')
      .last()
  }

  static getFlyoutDeleteButton() {
    return cy.get('.is-trash-icon')
  }

  static getEventFlyout() {
    return cy.get('.event-flyout')
  }

  static getEventFlyoutEditIcon() {
    return cy.get('.is-edit-icon')
  }

  static getEventFlyoutInfoWrapper() {
    return cy.get('.event-flyout__info-wrapper')
  }

  static getModePicker() {
    return cy.get('.calendar-header__mode-picker')
  }

  static getEventTime() {
    return cy.get('.is-time')
  }

  static getAllEventsWithDisabledDnD() {
    return cy.get('.calendar-week__event.is-editable.has-disabled-dnd')
  }

  static getAllDraggableDivs() {
    return cy.get('div[draggable]')
  }

  static getDraggableWeekEvents() {
    return cy.get('.calendar-week__event.is-editable')
  }

  static assertInputInCustomFlyoutIsVisible() {
    cy.get('.flyout-input').should('be.visible')
  }

  static closeEventFlyoutInCustomEvent() {
    cy.get('.close-flyout').click()
  }

  static closeEventFlyout() {
    cy.get('.event-flyout__menu-close').click()
  }

  static assertMonthEventExistsWithId(id: string, isCustom = false) {
    cy
    .get(id)
    .should('be.visible')
    .should(!isCustom ? 'have.class' : 'not.have.class', 'calendar-month__event')
  }

  static getElementWithId(id: string) {
    return cy.get('#' + id)
  }

  static clickFirstCustomEventInMonth() {
    cy.get('#calendar-month__event-930ad71ff7e22022-06-07').click()
  }

  static clickViewMoreEventsOnFirstMonthEvent() {
    return cy.get('.calendar-month__weekday-more')
      .first()
      .click()
  }

  static getModePickerMonthOption() {
    return cy.get('.is-month-mode')
  }

  static getModePickerDayOption() {
    return cy.get('.is-day-mode')
  }

  static getModePickerWeekOption() {
    return cy.get('.is-week-mode')
  }

  static getTrailingOrLeadingDays() {
    return cy.get('.trailing-or-leading')
  }

  static getFlyoutTime() {
    return cy.get('.event-flyout__row.is-time')
  }

  static getFirstMonthEvent() {
    return cy
    .get('.calendar-month__event-title')
    .first()
  }

  static getAllMonthEvents() {
    return cy.get('.calendar-month__event-title')
  }

  static getEventsOfDayNumberXInWeek(x: number) {
    return cy
    .get('.calendar-week__day')
    .eq(x - 1)
    .find('.calendar-week__event')
  }

  static getWeekEventNumberX(x: number) {
    return cy
    .get(`[data-ref="event-${x}"]`)
  }

  static getWeekTimelineEventNumberX(x: number) {
    return cy
    .get(`#week-timeline__event-id-${x}`)
  }

  static getSelectedDayInAgenda() {
    return cy.get('.calendar-month__weekday.is-selected')
  }

  static getAgendaEvent() {
    return cy.get('.is-event')
  }

  static simulateMobileView() {
    cy.viewport('iphone-6');
  }

  static assertAgendaEventExistsWithId(id: string) {
    cy.get(id).should('be.visible').and('have.class', 'agenda__event');
  }

  static clickFirstCustomEventInAgenda() {
    // Assuming custom agenda events have a specific class or identifiable attribute
    cy.get('.agenda__event.custom-class').first().click();
  }

  static getFirstAgendaEvent() {
    return cy.get('.agenda__event').first();
  }

}
