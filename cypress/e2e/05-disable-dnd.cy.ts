import PageObject from "../support/page-object";

const {
  getAllEventsWithDisabledDnD,
  setDayMode,
  setMonthMode,
  getAllDraggableDivs,
  clickChevronRight,
  openDatePicker,
  navigateForwardInDatePicker,
  clickFirstDayInDatePicker,
  getDraggableWeekEvents,
} = PageObject;

describe('DisableDnD.vue', () => {
  beforeEach(() => {
    cy.visit('#/cypress/disable-dnd');
  });

  it('Should find an event with disabled DnD in week mode', () => {
    getAllEventsWithDisabledDnD().should('have.length', 1);
  })

  it('Should find an event with disabled DnD in day mode', () => {
    setDayMode()

    // Assert that the event has disabled DnD
    getAllEventsWithDisabledDnD().should('have.length', 1);
  });

  it('Should find an event with disabled DnD in month mode', () => {
    setMonthMode()
    getAllDraggableDivs().should('have.length', 0);
  });

  it('Should find an event that can be dragged and dropped in month mode', () => {
    setMonthMode()

    // Go to January 2024
    clickChevronRight();

    // Expect to find a draggable event
    getAllDraggableDivs().should('have.length', 1);
  })

  it('Should find an event that can be dragged and dropped in week mode', () => {
    // Navigate to 1st of January 2024
    openDatePicker()
    navigateForwardInDatePicker()
    clickFirstDayInDatePicker()

    // Expect to find a draggable event
    getAllEventsWithDisabledDnD().should('have.length', 0);
    getDraggableWeekEvents().should('have.length', 1);
  })
})
