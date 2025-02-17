import { When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { dashboards } from '../../assets/backends/index.js'
import {
    dashboardUnstarredSel,
    dashboardStarredSel,
} from '../../elements/viewDashboard.js'

When('clicking to star {string} dashboard fails', (title) => {
    cy.log('url', `dashboards/${dashboards[title].id}/favorite`)
    cy.intercept('POST', `**/dashboards/${dashboards[title].id}/favorite`, {
        statusCode: 409,
    }).as('starDashboardFail')

    cy.get(dashboardUnstarredSel).click()
    cy.wait('@starDashboardFail').its('response.statusCode').should('eq', 409)
})

Then(
    'a warning message is displayed stating that starring dashboard failed',
    () => {
        cy.get('[data-test="dhis2-uicore-alertbar"]')
            .should('be.visible')
            .should('have.class', 'warning')

        cy.contains('Failed to star the dashboard').should('be.visible')
    }
)

Then('the {string} dashboard is not starred', () => {
    // check for the unfilled star next to the title
    cy.get(dashboardUnstarredSel).should('be.visible')
    cy.get(dashboardStarredSel).should('not.exist')
})
