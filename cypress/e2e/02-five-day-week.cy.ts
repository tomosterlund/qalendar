import PageObject from "../support/page-object";

const {
  getFirstEventInWeek,
  getEventFlyoutTitle,
  getFirstEventInWeekTimeline,
  getEventFlyout,
  getFlyoutDeleteButton,
  getEventFlyoutEditIcon,
  getEventFlyoutInfoWrapper,
  getModePicker
} = PageObject;

describe('FiveDayWeek.vue', () => {
  beforeEach(() => {
    cy.visit('#/cypress/five-day-week');
  });

  it('Gets a multiple day event, and opens it in EventFlyout', () => {
    cy.wait(500)
    cy.compareSnapshot('02-five-day-week', 0.03)
    getFirstEventInWeekTimeline().click()
    getEventFlyoutTitle().contains('Advanced algebra')
  });

  it('Gets a timed event, and opens it in EventFlyout', () => {
    getFirstEventInWeek().click()
    getEventFlyoutTitle().contains('Meeting: John w. parents')
  });

  it('Shuts the EventFlyout by clicking the delete icon', () => {
    getFirstEventInWeek().click()
    getFlyoutDeleteButton().click()
    getEventFlyout().should('not.be.visible')
  });

  it('Shuts the EventFlyout by clicking the edit icon', () => {
    getFirstEventInWeek().click()
    getEventFlyoutEditIcon().click()
    getEventFlyout().should('not.be.visible')
  })

  it('Shuts the event flyout on click outside, but not on click inside', () => {
    // 1. Assert that the event flyout is visible
    getEventFlyout().should('not.be.visible')
    getFirstEventInWeek().click()
    getEventFlyout().should('be.visible')

    // 2. Click somewhere inside the event flyout, and assert that it is still open
    getEventFlyoutInfoWrapper().click()
    getEventFlyout().should('be.visible')

    // 3. Click somewhere outside the event flyout, and assert that it is now not visible anymore
    getModePicker().click()
    getEventFlyout().should('not.be.visible')
  })
})
