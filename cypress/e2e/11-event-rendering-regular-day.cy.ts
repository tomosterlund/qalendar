import {CYPRESS_FOR_WHITE} from "../support";
import PageObject from "../support/page-object";

describe('event rendering - regular day in week mode', () => {
  beforeEach(() => {
    cy.visit('/#/cypress/events-regular-day')
  })

  it('Renders two timed single day events', () => {
    // get the sixth day with selector .calendar-week__day, and then the two events inside of it
    // data-ref="event-1" and data-ref="event-2"
    cy
      .get('.calendar-week__day')
      .eq(5)
      .find('.calendar-week__event')
      .should('have.length', 2)
  })

  it('renders first concurrent event to full width and no border', () => {
    cy
      .get('[data-ref="event-1"]')
      .should('have.attr', 'style')
      .and('include', 'width: 100%')
      .and('include', 'border: none')
  })

  it('renders second concurrent event to half width and white border', () => {
    cy
      .get('[data-ref="event-2"]')
      .should('have.attr', 'style')
      .and('include', 'width: 50%')
      .and('include', `border: 1px solid ${CYPRESS_FOR_WHITE}`);
  })

  it('renders a single day full-day event', () => {
    PageObject.clickChevronRight();

    cy
      .get('#week-timeline__event-id-3')
      .should('be.visible')
      .should('have.attr', 'style')
      .and('include', 'width: calc(100% - 6px);')
  })

  it('renders a multi day full-day event', () => {
    PageObject.clickChevronRight();

    cy
      .get('#week-timeline__event-id-4')
      .should('be.visible')
      .should('have.attr', 'style')
      .and('include', 'width: calc(300% - 6px);')
  })

  it('renders a multi day full-day event, spanning two years', () => {
    PageObject.clickChevronRight(41);

    cy
      .get('#week-timeline__event-id-5')
      .should('be.visible')
      .should('have.attr', 'style')
      .and('include', 'width: calc(100% - 6px);')

    PageObject.clickChevronRight();

    cy
      .get('#week-timeline__event-id-5')
      .should('be.visible')
      .should('have.attr', 'style')
      .and('include', 'width: calc(300% - 6px);')
  })

  it('renders a multi day timed event, spanning two years', () => {
    PageObject.clickChevronRight(41);

    cy
      .get('#week-timeline__event-id-6')
      .should('be.visible')
      .should('have.attr', 'style')
      .and('include', 'width: calc(100% - 6px);')

    PageObject.clickChevronRight();

    cy
      .get('#week-timeline__event-id-6')
      .should('be.visible')
      .should('have.attr', 'style')
      .and('include', 'width: calc(700% - 6px);')

    PageObject.clickChevronRight();

    cy
      .get('#week-timeline__event-id-6')
      .should('be.visible')
      .should('have.attr', 'style')
      .and('include', 'width: calc(700% - 6px);')
  })
})

describe('event rendering - regular day in month mode', () => {
  beforeEach(() => {
    cy.visit('/#/cypress/events-regular-day')
    PageObject.setMonthMode()
  })

  it('renders two single-day timed events', () => {
    cy
      .get('#calendar-month__event-12023-03-18')
      .should('be.visible')
      .should('contain.text', '6:23 PM')
      .should('contain.text', 'Event 1')

    cy
      .get('#calendar-month__event-22023-03-18')
      .should('be.visible')
  })

  it('renders a full day single day event', () => {
    cy
      .get('#calendar-month__event-32023-03-20')
      .should('be.visible')
      .should('contain.text', 'Full single day event')
  })

  it('renders a full day multi day event', () => {
    cy
      .get('#calendar-month__event-42023-03-21')
      .should('be.visible')
      .should('contain.text', 'Full multi day event')

    cy
      .get('#calendar-month__event-42023-03-22')
      .should('be.visible')
      .should('contain.text', 'Full multi day event')

    cy
      .get('#calendar-month__event-42023-03-23')
      .should('be.visible')
      .should('contain.text', 'Full multi day event')

    cy
      .get('#calendar-month__event-42023-03-24')
      .should('not.exist')
  })

  it('renders full day multi day event spanning two years', () => {
    PageObject.clickChevronRight(9)

    cy
      .get('#calendar-month__event-52023-12-31')
      .should('be.visible')
      .should('contain.text', 'Full multi day event year break')

    PageObject.clickChevronRight()

    cy
      .get('#calendar-month__event-52024-01-01')
      .should('be.visible')
      .should('contain.text', 'Full multi day event year break')

    cy
      .get('#calendar-month__event-52024-01-02')
      .should('be.visible')

    cy
      .get('#calendar-month__event-52024-01-03')
      .should('be.visible')

    cy
      .get('#calendar-month__event-52024-01-04')

  })
});
