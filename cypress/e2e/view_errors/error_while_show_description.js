import { When, Then } from '@badeball/cypress-cucumber-preprocessor'

const RESP_CODE_FAIL = 409

// Error scenario

// TODO We do not want this to run at the start of the suite. It should only run
// before the first scenario that needs it.
// before(() => {
//     //first ensure that the description is not currently shown
//     cy.request({
//         method: 'PUT',
//         url: `${getApiBaseUrl()}/api/userDataStore/dashboard/showDescription`,
//         headers: {
//             'content-type': 'application/json',
//         },
//         body: 'false',
//     }).then((response) =>
//         expect(response.status).to.be.oneOf(200, 201)
//     )
// })

When('clicking to show description fails', () => {
    cy.intercept('PUT', 'userDataStore/dashboard/showDescription', {
        statusCode: RESP_CODE_FAIL,
    }).as('showDescriptionFails')

    cy.get('button').contains('More').click()
    cy.contains('Show description').click()

    cy.wait('@showDescriptionFails')
        .its('response.statusCode')
        .should('eq', RESP_CODE_FAIL)
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
