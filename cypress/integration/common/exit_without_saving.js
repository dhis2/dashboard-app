import { When } from 'cypress-cucumber-preprocessor/steps'

When('I click Exit without saving', () => {
    cy.contains('Exit without saving').click()
})
