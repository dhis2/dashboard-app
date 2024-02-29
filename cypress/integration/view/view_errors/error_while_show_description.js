import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { getApiBaseUrl } from '../../../support/utils.js'

const RESP_CODE_200 = 200
const RESP_CODE_201 = 201
const RESP_CODE_FAIL = 409

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
    }).then((response) =>
        expect(response.status).to.be.oneOf([RESP_CODE_201, RESP_CODE_200])
    )
})

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
