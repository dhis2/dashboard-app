import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { getApiBaseUrl } from '../../../support/server/utils'

before(() => {
    cy.request({
        method: 'PUT',
        url: `${getApiBaseUrl()}/api/userDataStore/dashboard/showDescription`,
        headers: {
            'content-type': 'application/json',
        },
        body: 'false',
    }).then(response => expect(response.status).to.equal(201))
})

When('I click to show description', () => {
    cy.intercept('PUT', 'userDataStore/dashboard/showDescription').as(
        'toggleDescription'
    )

    cy.clickMoreButton()
    cy.contains('Show description').click()

    cy.wait('@toggleDescription').its('response.statusCode').should('eq', 201)
})

When('I click to hide the description', () => {
    cy.clickMoreButton()
    cy.contains('Hide description').click()

    cy.wait('@toggleDescription').its('response.statusCode').should('eq', 201)
})

// Error scenario
When('clicking to show description fails', () => {
    cy.intercept('PUT', 'userDataStore/dashboard/showDescription', {
        statusCode: 409,
    }).as('showDescriptionFails')

    cy.clickMoreButton()
    cy.contains('Show description').click()
    cy.wait('@showDescriptionFails')
        .its('response.statusCode')
        .should('eq', 409)
})

Then(
    'a warning message is displayed stating that starring dashboard failed',
    () => {
        cy.get('[data-test="dhis2-uicore-alertbar"]')
            .should('be.visible')
            .should('have.class', 'critical')

        cy.contains('Failed to show description').should('be.visible')
    }
)
