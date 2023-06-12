import {CYPRESS_FOR_WHITE} from "../support";
import PageObject from "../support/page-object";

const {
  getEventsOfDayNumberXInWeek,
  clickChevronRight,
  goTo31stDecember,
  setMonthMode,
  getWeekEventNumberX,
  getWeekTimelineEventNumberX,
  getElementWithId,
} = PageObject

describe('event rendering - regular day in week mode', () => {
  beforeEach(() => {
    cy.visit('/#/cypress/events-regular-day')
  })

  it('Renders two timed single day events', () => {
    getEventsOfDayNumberXInWeek(6).should('have.length', 2)
  })

  it('renders first concurrent event to full width and no border', () => {
    getWeekEventNumberX(1)
      .should('have.attr', 'style')
      .and('include', 'width: 100%')
      .and('include', 'border: none')
  })

  it('renders second concurrent event to half width and white border', () => {
    getWeekEventNumberX(2)
      .should('have.attr', 'style')
      .and('include', 'width: 50%')
      .and('include', `border: 1px solid ${CYPRESS_FOR_WHITE}`);
  })

  it('renders a single day full-day event', () => {
    clickChevronRight();

    getWeekTimelineEventNumberX(3).should('be.visible')
      .should('have.attr', 'style')
      .and('include', 'width: calc(100% - 6px);')
  })

  it('renders a multi day full-day event', () => {
    clickChevronRight();

    getWeekTimelineEventNumberX(4)
      .should('be.visible')
      .should('have.attr', 'style')
      .and('include', 'width: calc(300% - 6px);')
  })

  it('renders a multi day full-day event, spanning two years', () => {
    goTo31stDecember();

    getWeekTimelineEventNumberX(5)
      .should('be.visible')
      .should('have.attr', 'style')
      .and('include', 'width: calc(100% - 6px);')

    clickChevronRight();

    getWeekTimelineEventNumberX(5)
      .should('be.visible')
      .should('have.attr', 'style')
      .and('include', 'width: calc(300% - 6px);')
  })

  it('renders a multi day timed event, spanning two years', () => {
    goTo31stDecember();

    getWeekTimelineEventNumberX(6)
      .should('be.visible')
      .should('have.attr', 'style')
      .and('include', 'width: calc(100% - 6px);')

    clickChevronRight();

    getWeekTimelineEventNumberX(6)
      .should('be.visible')
      .should('have.attr', 'style')
      .and('include', 'width: calc(700% - 6px);')

    clickChevronRight();

    getWeekTimelineEventNumberX(6)
      .should('be.visible')
      .should('have.attr', 'style')
      .and('include', 'width: calc(700% - 6px);')

    clickChevronRight(3);

    getWeekTimelineEventNumberX(6)
    .should('be.visible')
    .should('have.attr', 'style')
    .and('include', 'width: calc(400% - 6px);')
  })
})

describe('event rendering - regular day in month mode', () => {
  beforeEach(() => {
    cy.visit('/#/cypress/events-regular-day')
    setMonthMode()
  })

  it('renders two single-day timed events', () => {
    getElementWithId('calendar-month__event-12023-03-18')
      .should('be.visible')
      .should('contain.text', '6:23 PM')
      .should('contain.text', 'Event 1')

    getElementWithId('calendar-month__event-22023-03-18')
      .should('be.visible')
      .should('contain.text', '6:30 PM')
      .should('contain.text', 'Event 2')
  })

  it('renders a full day single day event', () => {
    getElementWithId('calendar-month__event-32023-03-20')
      .should('be.visible')
      .should('contain.text', 'Full single day event')
  })

  it('renders a full day multi day event', () => {
    getElementWithId('calendar-month__event-42023-03-21')
      .should('be.visible')
      .should('contain.text', 'Full multi day event')

    getElementWithId('calendar-month__event-42023-03-22')
      .should('be.visible')
      .should('contain.text', 'Full multi day event')

    getElementWithId('calendar-month__event-42023-03-23')
      .should('be.visible')
      .should('contain.text', 'Full multi day event')

    getElementWithId('calendar-month__event-42023-03-24')
      .should('not.exist')
  })

  it('renders full day multi day event spanning two years', () => {
    PageObject.goTo31stDecember()
    PageObject.setMonthMode()

    getElementWithId('calendar-month__event-52023-12-31')
      .should('be.visible')
      .should('contain.text', 'Full multi day event year break')

    clickChevronRight()

    getElementWithId('calendar-month__event-52024-01-01')
      .should('be.visible')
      .should('contain.text', 'Full multi day event year break')

    getElementWithId('calendar-month__event-52024-01-02')
      .should('be.visible')

    getElementWithId('calendar-month__event-52024-01-03')
      .should('be.visible')

    getElementWithId('calendar-month__event-52024-01-04')
      .should('not.exist')
  })

  it('renders a multi day timed event spanning two years', () => {
    goTo31stDecember()
    setMonthMode()

    getElementWithId('calendar-month__event-62023-12-31')
      .should('contain.text', '6:23 PM')
      .should('contain.text', 'Timed multi day event year break')

    clickChevronRight()

    getElementWithId('calendar-month__event-62024-01-01')
      .should('contain.text', '6:23 PM')

    getElementWithId('calendar-month__event-62024-02-01')
      .should('contain.text', '6:23 PM')

    getElementWithId('calendar-month__event-62024-02-02')
      .should('not.exist')
  })
});
