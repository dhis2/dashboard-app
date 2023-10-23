import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { clickViewActionButton } from '../../../elements/viewDashboard.js'
import { getApiBaseUrl } from '../../../support/utils.js'

const RESP_CODE_200 = 200
const RESP_CODE_201 = 201
const SHOW_DESC_RESP_CODE_FAIL = 409

before(() => {
    //ensure that the description is not currently shown
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

When('I click to show description', () => {
    cy.intercept('PUT', 'userDataStore/dashboard/showDescription').as(
        'toggleDescription'
    )

    clickViewActionButton('More')
    cy.contains('Show description').click()

    cy.wait('@toggleDescription')
        .its('response.statusCode')
        .should('be.oneOf', [RESP_CODE_200, RESP_CODE_201])
})

When('I click to hide the description', () => {
    clickViewActionButton('More')
    cy.contains('Hide description').click()

    cy.wait('@toggleDescription')
        .its('response.statusCode')
        .should('be.oneOf', [RESP_CODE_200, RESP_CODE_201])
})

// Error scenario
When('clicking to show description fails', () => {
    cy.intercept('PUT', 'userDataStore/dashboard/showDescription', {
        statusCode: SHOW_DESC_RESP_CODE_FAIL,
    }).as('showDescriptionFails')

    clickViewActionButton('More')
    cy.contains('Show description').click()
    cy.wait('@showDescriptionFails')
        .its('response.statusCode')
        .should('eq', SHOW_DESC_RESP_CODE_FAIL)
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
