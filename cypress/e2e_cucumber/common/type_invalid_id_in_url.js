import { Given } from '@badeball/cypress-cucumber-preprocessor'

Given('I type an invalid dashboard id in the browser url', () => {
    cy.visit('#/invalid')
})
