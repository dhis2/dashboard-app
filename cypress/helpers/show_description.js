import { getApiBaseUrl } from '../support/utils.js'
import { clickViewActionButton } from './dashboard.js'

const SHOW_DESC_RESP_CODE_SUCCESS = 201
const SHOW_DESC_RESP_CODE_FAIL = 409

export const resetDescriptionToBeHidden = () => {
    //ensure that the description is not currently shown
    cy.request({
        method: 'PUT',
        url: `${getApiBaseUrl()}/api/userDataStore/dashboard/showDescription`,
        headers: {
            'content-type': 'application/json',
        },
        body: 'false',
    }).then((response) =>
        expect(response.status).to.equal(SHOW_DESC_RESP_CODE_SUCCESS)
    )
}

export const clickToShowDescription = () => {
    cy.intercept('PUT', '**/userDataStore/dashboard/showDescription').as(
        'toggleDescription'
    )

    clickViewActionButton('More')
    cy.contains('Show description').click()

    cy.wait('@toggleDescription')
        .its('response.statusCode')
        .should('eq', SHOW_DESC_RESP_CODE_SUCCESS)
}

export const clickToHideDescription = () => {
    clickViewActionButton('More')
    cy.contains('Hide description').click()

    cy.wait('@toggleDescription')
        .its('response.statusCode')
        .should('eq', SHOW_DESC_RESP_CODE_SUCCESS)
}

export const clickingToShowDescriptionFails = () => {
    cy.intercept('PUT', '**/userDataStore/dashboard/showDescription', {
        statusCode: SHOW_DESC_RESP_CODE_FAIL,
    }).as('showDescriptionFails')

    clickViewActionButton('More')
    cy.contains('Show description').click()
    cy.wait('@showDescriptionFails')
        .its('response.statusCode')
        .should('eq', SHOW_DESC_RESP_CODE_FAIL)
}

export const warningMessageIsDisplayedStatingThatShowDescriptionFailed = () => {
    cy.get('[data-test="dhis2-uicore-alertbar"]')
        .should('be.visible')
        .should('have.class', 'critical')

    cy.contains('Failed to show description').should('be.visible')
}
