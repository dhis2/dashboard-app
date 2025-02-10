import { Given } from '@badeball/cypress-cucumber-preprocessor'

//Scenario: edit Dashboard id is invalid
Given('I type an invalid edit dashboard id in the browser url', () => {
    cy.visit('#/invalid/edit')
})

//Scenario: print Dashboard id is invalid
Given('I type an invalid print dashboard id in the browser url', () => {
    cy.visit('#/invalid/printoipp')
})

//Scenario: print layout Dashboard id is invalid
Given('I type an invalid print layout dashboard id in the browser url', () => {
    cy.visit('#/invalid/printlayout')
})
