import PageObject from "../support/page-object";

const {
  getFirstEventInWeek,
  assertInputInCustomFlyoutIsVisible,
  closeEventFlyoutInCustomEvent,
  getEventFlyout,
  setMonthMode,
  assertMonthEventExistsWithId,
  clickFirstCustomEventInMonth,
} = PageObject

describe('CustomizedEvents.vue', () => {
  beforeEach(() => {
    cy.visit('#/cypress/customized-events');
  });

  it('Gets the title from a custom event', () => {
    getFirstEventInWeek().contains('Meeting: John w. parents')
    cy.compareSnapshot('06-customized-events')
  });

  it('Opens a customized flyout from a custom event and closes it again', () => {
    getFirstEventInWeek().click()
    assertInputInCustomFlyoutIsVisible()
    closeEventFlyoutInCustomEvent()
    getEventFlyout().should('not.be.visible')
  });

  it('Should display a custom monthEvent', () => {
    setMonthMode()
    // First check that a "normal" event is displayed
    assertMonthEventExistsWithId('#calendar-month__event-98485e08441e2022-06-07')
    // Then check that a custom event is displayed
    assertMonthEventExistsWithId('#calendar-month__event-930ad71ff7e22022-06-07', true)
    cy.compareSnapshot('06-customized-events-month')
  })

  it('Should open the event flyout on clicking a custom monthEvent', () => {
    setMonthMode()
    getEventFlyout().should('not.be.visible')
    clickFirstCustomEventInMonth()
    getEventFlyout().should('be.visible')
    cy.compareSnapshot('06-customized-events-month-flyout')
  })
})

describe('CustomizedEvents.vue', () => {
  beforeEach(() => {
    PageObject.simulateMobileView(); // Ensure mobile view is simulated
    cy.visit('#/cypress/customized-events');
  });

  it('Should display a custom agenda event in mobile view', () => {
    PageObject.setMonthMode(); // This should automatically switch to agenda mode in mobile view
    PageObject.assertAgendaEventExistsWithId('#agenda__event-custom-id'); // Replace with actual ID
  });

  it('Should open the event flyout on clicking a custom agenda event in mobile view', () => {
    PageObject.setMonthMode(); // Ensure it's in month mode which switches to agenda in mobile view
    PageObject.getFirstAgendaEvent().should('not.be.visible');
    PageObject.clickFirstCustomEventInAgenda();
    PageObject.getEventFlyout().should('be.visible');
  });
});