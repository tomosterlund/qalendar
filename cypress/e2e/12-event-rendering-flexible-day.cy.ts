import PageObject from "../support/page-object";

describe('Flexible day event rendering', () => {

  beforeEach(() => {
    cy.visit('/#/cypress/events-flexible-day')
  })

  it('renders a timed single day event where its time lies within the "normal" day boundary', () => {
    cy
      .get('.calendar-week__day')
      .eq(5) // Saturday
      .find('.calendar-week__event')
      .eq(0)
      .should('contain.text', 'Event 1')
      .should('contain.text', '6:23 PM - 7:23 PM')
  });

  it('renders a timed single day event where its time lies outside the "normal" day boundary', () => {
    cy
      .get('.calendar-week__day')
      .eq(5) // Saturday
      .find('.calendar-week__event')
      .eq(1)
      .should('contain.text', 'Event 2')
      .should('contain.text', '12:30 AM - 1:45 AM')
  })

  it('renders a full day single day event', () => {
    PageObject.clickChevronRight();

    cy
      .get('.week-timeline__events')
      .find('#week-timeline__event-id-3')
      .should('be.visible')
      .should('contain.text', 'Full single day event')
      .should('have.attr', 'style')
      .and('include', 'width: calc(100% - 6px);')
  })

  it('renders a multi day full-day event', () => {
    PageObject.clickChevronRight();

    cy
      .get('.week-timeline__events')
      .find('#week-timeline__event-id-4')
      .should('be.visible')
      .should('contain.text', 'Full multi day event')
      .should('have.attr', 'style')
      .and('include', 'width: calc(300% - 6px);')
  });

  it(
    'renders a timed multi day event starting just after midnight on 2024-01-01, within dayBoundary of previous day, but only rendered from 2024-01-01',
    () => {
    PageObject.goTo31stDecember();

    cy
      .get('.week-timeline__events')
      .should('not.contain.text', 'Timed multi day event year break')

    PageObject.clickChevronRight();

    cy
      .get('.week-timeline__events')
      .find('#week-timeline__event-id-6')
  })
});

describe('Flexible day event rendering in month mode', () => {
  beforeEach(() => {
    cy.visit('/#/cypress/events-flexible-day')
    PageObject.setMonthMode()
  })

  it('does not render a timed multi-day event in its previous day, though in it according to day boundaries', () => {
    PageObject.goTo31stDecember();

    cy
      .get('#day-2023-12-31')
      .should('not.contain.text', 'Timed multi day event year break')
  })

  it('does render a timed multi-day event starting on the standard calendar day of its time.start', () => {
    PageObject.goTo31stDecember();
    PageObject.clickChevronRight();

    cy
      .get('#day-2024-01-01')
      .should('contain.text', 'Timed multi day event year break')
  })
})
