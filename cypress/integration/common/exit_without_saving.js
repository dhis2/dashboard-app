import { When } from 'cypress-cucumber-preprocessor/steps'

When('I click Exit without saving', () => {
    cy.clickEditActionButton('Exit without saving')
})
