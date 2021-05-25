import { When, Then } from 'cypress-cucumber-preprocessor/steps'

When("I save dashboard that I don't have access to save", () => {
    cy.intercept('PUT', '/dashboards', { statusCode: 409 })
    cy.clickEditActionButton('Save changes')
})
Then('I remain in edit mode and error message is displayed', () => {
    cy.get('[data-test="dhis2-uicore-alertbar"]')
        .should('be.visible')
        .should('have.class', 'critical')

    cy.contains('Save changes').should('be.visible')
})

When('A 500 error is thrown when I save the dashboard', () => {
    cy.intercept('PUT', '/dashboards', { statusCode: 500 })
    cy.clickEditActionButton('Save changes')
})
