import { When } from 'cypress-cucumber-preprocessor/steps'

When('A 500 error is thrown when I delete the dashboard', () => {
    cy.intercept('DELETE', '/dashboards', { statusCode: 500 })
    cy.clickEditActionButton('Delete')
    cy.get('[data-test="confirm-delete-dashboard"]').click()
})
