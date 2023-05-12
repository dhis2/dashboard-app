import {
    starSel,
    dashboardStarredSel,
    dashboardUnstarredSel,
    dashboardChipSel,
    chipStarSel,
} from '../elements/viewDashboard.js'

export const starDashboard = () => {
    cy.intercept('POST', '**/favorite').as('starDashboard')

    cy.getBySel(starSel).click()
    cy.wait('@starDashboard').its('response.statusCode').should('eq', 200)
}

export const unstarDashboard = () => {
    cy.intercept('DELETE', '**/favorite').as('unstarDashboard')

    cy.getBySel(starSel).click()
    cy.wait('@unstarDashboard').its('response.statusCode').should('eq', 200)
}

export const expectDashboardToBeStarred = (title) => {
    // check for the filled star next to the title
    cy.getBySel(dashboardStarredSel).should('be.visible')
    cy.getBySel(dashboardUnstarredSel).should('not.exist')

    cy.getBySel(dashboardChipSel)
        .contains(title)
        .parent()
        .siblings(`[data-test="${chipStarSel}"]`)
        .first()
        .should('be.visible')
}

export const expectDashboardToNotBeStarred = (title) => {
    // check for the unfilled star next to the title
    cy.getBySel(dashboardUnstarredSel).should('be.visible')
    cy.getBySel(dashboardStarredSel).should('not.exist')

    cy.getBySel(dashboardChipSel)
        .contains(title)
        .parent()
        .siblings()
        .should('not.exist')
}
