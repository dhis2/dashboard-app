import { Given } from '@badeball/cypress-cucumber-preprocessor'
import { EXTENDED_TIMEOUT } from '../../../support/utils.js'

//Scenario: edit Dashboard id is invalid
Given('I type an invalid edit dashboard id in the browser url', () => {
    cy.visit('#/invalid/edit', EXTENDED_TIMEOUT)
})

//Scenario: print Dashboard id is invalid
Given('I type an invalid print dashboard id in the browser url', () => {
    cy.visit('#/invalid/printoipp', EXTENDED_TIMEOUT)
})

//Scenario: print layout Dashboard id is invalid
Given('I type an invalid print layout dashboard id in the browser url', () => {
    cy.visit('#/invalid/printlayout', EXTENDED_TIMEOUT)
})
