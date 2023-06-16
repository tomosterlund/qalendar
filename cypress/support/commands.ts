// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import compareSnapshotCommand from "cypress-visual-regression/dist/command";

// @ts-ignore
Cypress.Commands.add('changeMode', mode => {
  cy
    .get('.calendar-header__mode-value')
    .click()
    .get('.is-' + mode + '-mode')
    .click()
})

compareSnapshotCommand();
