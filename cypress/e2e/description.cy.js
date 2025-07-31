import { dashboardDescriptionSel } from '../elements/viewDashboard.js'
import { getApiBaseUrl } from '../support/utils.js'

const RESP_CODE_200 = 200
const RESP_CODE_201 = 201

describe('description', () => {
    before(() => {
        // Ensure that the description is not currently shown
        cy.request({
            method: 'PUT',
            url: `${getApiBaseUrl()}/api/userDataStore/dashboard/showDescription`,
            headers: {
                'content-type': 'application/json',
            },
            body: 'false',
        }).as('resetToHiddenRequest')

        cy.get('@resetToHiddenRequest').should((response) => {
            expect(response.status).to.be.oneOf([RESP_CODE_201, RESP_CODE_200])
        })
    })

    it('toggles show description', () => {
        //  Open dashboard and confirm that the description is not shown
        cy.visit('/')
        cy.getByDataTest('view-dashboard-title').should('be.visible')
        cy.get(dashboardDescriptionSel).should('not.exist')

        // intercept the request to toggle visibility to visible
        cy.intercept({
            method: 'PUT',
            pathname: '**/userDataStore/dashboard/showDescription',
            times: 1,
        }).as('toggleDescriptionVisible')

        //  Click to display the description
        cy.getByDataTest('more-actions-button').click()
        cy.get('li').contains('Show description').click()

        cy.wait('@toggleDescriptionVisible')
            .its('response.statusCode')
            .should('be.oneOf', [RESP_CODE_200, RESP_CODE_201])
        cy.get(dashboardDescriptionSel).should('be.visible')

        // intercept the request to toggle visibility to hidden
        cy.intercept({
            method: 'PUT',
            pathname: '**/userDataStore/dashboard/showDescription',
            times: 1,
        }).as('toggleDescriptionHidden')

        //  Click to hide the description
        cy.getByDataTest('more-actions-button').click()
        cy.get('li').contains('Hide description').click()

        // Confirm that show description has been set to false
        cy.wait('@toggleDescriptionHidden')
            .its('response.statusCode')
            .should('be.oneOf', [RESP_CODE_200, RESP_CODE_201])
        cy.get(dashboardDescriptionSel).should('not.exist')
    })
})
