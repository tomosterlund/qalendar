import PageObject from "../support/page-object";

const {
  getEventsOfDayNumberXInWeek,
  clickChevronRight,
  getElementWithId,
  goTo31stDecember,
  setMonthMode,
} = PageObject

describe('Flexible day event rendering', () => {

  beforeEach(() => {
    cy.visit('/#/cypress/events-flexible-day')
  })

  it('renders a timed single day event where its time lies within the "normal" day boundary', () => {
    getEventsOfDayNumberXInWeek(6) // Saturday
      .eq(0) // first event of Saturday
      .should('contain.text', 'Event 1')
      .should('contain.text', '6:23 PM - 7:23 PM')
  });

  it('renders a timed single day event where its time lies outside the "normal" day boundary', () => {
    getEventsOfDayNumberXInWeek(6)
      .eq(1)
      .should('contain.text', 'Event 2')
      .should('contain.text', '12:30 AM - 1:45 AM')
  })

  it('renders a full day single day event', () => {
    clickChevronRight();

    getElementWithId('week-timeline__event-id-3')
      .should('be.visible')
      .should('contain.text', 'Full single day event')
      .should('have.attr', 'style')
      .and('include', 'width: calc(100% - 6px);')
  })

  it('renders a multi day full-day event', () => {
    PageObject.clickChevronRight();

    getElementWithId('week-timeline__event-id-4')
      .should('be.visible')
      .should('contain.text', 'Full multi day event')
      .should('have.attr', 'style')
      .and('include', 'width: calc(300% - 6px);')
  });

  it(
    'renders a timed multi day event starting just after midnight on 2024-01-01, within dayBoundary of previous day, but only rendered from 2024-01-01',
    () => {
    goTo31stDecember();

    cy
      .get('.week-timeline__events')
      .should('not.contain.text', 'Timed multi day event year break')

    clickChevronRight();

    getElementWithId('week-timeline__event-id-6')
  })
});

describe('Flexible day event rendering in month mode', () => {
  beforeEach(() => {
    cy.visit('/#/cypress/events-flexible-day')
    setMonthMode()
  })

  it('does not render a timed multi-day event in its previous day, though in it according to day boundaries', () => {
    goTo31stDecember();

    getElementWithId('day-2023-12-31')
      .should('not.contain.text', 'Timed multi day event year break')
  })

  it('does render a timed multi-day event starting on the standard calendar day of its time.start', () => {
    goTo31stDecember();
    clickChevronRight();

    getElementWithId('day-2024-01-01')
      .should('contain.text', 'Timed multi day event year break')
  })
})
