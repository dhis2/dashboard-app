import { When, Then } from '@badeball/cypress-cucumber-preprocessor'

When('I type a dashboard id in the browser url that fails to load', () => {
    cy.intercept('**/dashboards/iMnYyBfSxmM**', {
        statusCode: 500,
        body: 'Oopsie!',
    }).as('failure')

    cy.visit('#/iMnYyBfSxmM')
    cy.wait('@failure')
})

Then(
    'a warning message is displayed stating that the dashboard could not be loaded',
    () => {
        cy.contains('Load dashboard failed').should('exist')
        cy.contains(
            'This dashboard could not be loaded. Please try again later.'
        ).should('exist')
    }
)
