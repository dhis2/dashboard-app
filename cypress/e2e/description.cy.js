import { dashboardDescriptionSel } from '../elements/viewDashboard.js'
import { getApiBaseUrl } from '../support/utils.js'

const RESP_CODE_200 = 200
const RESP_CODE_201 = 201

// Ensure that the description is not currently shown
const resetShowDescription = () => {
    return cy
        .request({
            method: 'PUT',
            url: `${getApiBaseUrl()}/api/userDataStore/dashboard/showDescription`,
            headers: {
                'content-type': 'application/json',
            },
            body: 'false',
        })
        .then((response) =>
            expect(response.status).to.be.oneOf([RESP_CODE_201, RESP_CODE_200])
        )
}

describe('description', () => {
    it('toggle show description', () => {
        resetShowDescription().then(() => {
            cy.intercept(
                'PUT',
                '**/userDataStore/dashboard/showDescription'
            ).as('toggleDescription')

            //  Open dashboard and confirm that the description is not shown
            cy.visit('/')
            cy.getByDataTest('view-dashboard-title').should('be.visible')
            cy.get(dashboardDescriptionSel).should('not.exist')

            //  Click to display the description
            cy.getByDataTest('more-actions-button').click()
            cy.get('li').contains('Show description').click()

            cy.wait('@toggleDescription')
                .its('response.statusCode')
                .should('be.oneOf', [RESP_CODE_200, RESP_CODE_201])
            cy.get(dashboardDescriptionSel).should('be.visible')

            //  Click to hide the description
            cy.getByDataTest('more-actions-button').click()
            cy.get('li').contains('Hide description').click()

            // Confirm that show description has been set to false
            resetShowDescription().then(() => {
                cy.wait('@toggleDescription')
                    .its('response.statusCode')
                    .should('be.oneOf', [RESP_CODE_200, RESP_CODE_201])
                cy.get(dashboardDescriptionSel).should('not.exist')
            })
        })
    })
})
