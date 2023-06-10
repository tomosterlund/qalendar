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
  })

  it('Should open the event flyout on clicking a custom monthEvent', () => {
    setMonthMode()
    getEventFlyout().should('not.be.visible')
    clickFirstCustomEventInMonth()
    getEventFlyout().should('be.visible')
  })
})
