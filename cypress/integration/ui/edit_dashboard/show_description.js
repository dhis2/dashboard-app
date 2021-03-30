import { When, Then } from 'cypress-cucumber-preprocessor/steps'
// import { getApiBaseUrl } from '../../../support/server/utils'

// TODO this request currently fails with 415 Unsupported media type
// goal is to add this step
// Given('the description is not shown', () => {
//     cy.request(
//         'PUT',
//         `${getApiBaseUrl()}/api/userDataStore/dashboard/showDescription`,
//         false
//     ).then(response => {
//         expect(response.status).to.equal(201)
//     })
// })

When('I click to show description', () => {
    cy.intercept('PUT', 'userDataStore/dashboard/showDescription').as(
        'toggleDescription'
    )

    cy.get('button').contains('More').click()
    cy.contains('Show description').click()

    cy.wait('@toggleDescription').its('response.statusCode').should('eq', 201)
})

When('I click to hide the description', () => {
    cy.get('button').contains('More').click()
    cy.contains('Hide description').click()

    cy.wait('@toggleDescription').its('response.statusCode').should('eq', 201)
})

// Error scenario
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
    'a warning message is displayed stating that starring dashboard failed',
    () => {
        cy.get('[data-test="dhis2-uicore-alertbar"]')
            .should('be.visible')
            .should('have.class', 'critical')

        cy.contains('Failed to show description').should('be.visible')
    }
)
