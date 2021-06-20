import { When } from 'cypress-cucumber-preprocessor/steps'

When('I click to exit print preview', () => {
    cy.get('button').not('.small').contains('Exit print preview').click()
})
