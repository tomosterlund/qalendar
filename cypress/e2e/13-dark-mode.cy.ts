import PageObject from "../support/page-object";

const {
  setMonthMode,
  setDayMode,
} = PageObject

describe('Dark mode on desktop', () => {
  beforeEach(() => {
    cy.visit('/#/cypress/dark-mode');
  })

  it('should render the week view in dark mode', () => {
    cy.compareSnapshot('dark-mode-week-view', 0.03);
  });

  it('should render the month view in dark mode', () => {
    setMonthMode();
    cy.compareSnapshot('dark-mode-month-view');
  });

  it('should render the day view in dark mode', () => {
    setDayMode();
    cy.compareSnapshot('dark-mode-day-view');
  })
});


describe('Dark mode on mobile', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
    cy.visit('/#/cypress/dark-mode');
  })

  it('should render the month view in dark mode', () => {
    setMonthMode();
    cy.compareSnapshot('dark-mode-month-view-mobile', 0.03);
  });

  it('should render the day view in dark mode', () => {
    setDayMode();
    cy.compareSnapshot('dark-mode-day-view-mobile');
  })
});
