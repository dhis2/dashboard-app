import { When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { getApiBaseUrl } from '../../../support/server/utils.js'

// Error scenario

before(() => {
    //first ensure that the description is not currently shown
    cy.request({
        method: 'PUT',
        url: `${getApiBaseUrl()}/api/userDataStore/dashboard/showDescription`,
        headers: {
            'content-type': 'application/json',
        },
        body: 'false',
    }).then((response) => expect(response.status).to.equal(201))
})

When('clicking to show description fails', () => {
    cy.intercept('PUT', 'userDataStore/dashboard/showDescription', {
        statusCode: 409,
    }).as('showDescriptionFails')

    cy.get('button').contains('More').click()
    cy.contains('Show description').click()

    cy.wait('@showDescriptionFails')
        .its('response.statusCode')
        .should('eq', 409)
})

Then(
    'a warning message is displayed stating that show description failed',
    () => {
        cy.get('[data-test="dhis2-uicore-alertbar"]')
            .should('be.visible')
            .should('have.class', 'warning')

        cy.contains('Failed to show description').should('be.visible')
    }
)
