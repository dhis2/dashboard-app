import { dashboards } from '../assets/backends/index.js'
import {
    starSel,
    dashboardUnstarredSel,
    dashboardStarredSel,
    dashboardChipSel,
} from '../elements/viewDashboard.js'

export const starDashboardFails = (title) => {
    cy.log('url', `dashboards/${dashboards[title].id}/favorite`)
    cy.intercept('POST', `**/dashboards/${dashboards[title].id}/favorite`, {
        statusCode: 409,
    }).as('starDashboardFail')

    cy.get(starSel).click()
    cy.wait('@starDashboardFail').its('response.statusCode').should('eq', 409)
}

export const expectDashboardNotStarredWarning = () => {
    cy.get('[data-test="dhis2-uicore-alertbar"]')
        .should('be.visible')
        .should('have.class', 'warning')

    cy.contains('Failed to star the dashboard').should('be.visible')
}

export const expectDashboardNotStarred = (title) => {
    // check for the unfilled star next to the title
    cy.get(dashboardUnstarredSel).should('be.visible')
    cy.get(dashboardStarredSel).should('not.exist')

    cy.get(dashboardChipSel).contains(title).siblings().should('not.exist')
}
