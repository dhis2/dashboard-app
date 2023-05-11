import {
    starSel,
    dashboardStarredSel,
    dashboardUnstarredSel,
    dashboardChipSel,
    chipStarSel,
} from '../elements/viewDashboard.js'

export const starDashboard = () => {
    cy.intercept('POST', '**/favorite').as('starDashboard')

    cy.get(starSel).click()
    cy.wait('@starDashboard').its('response.statusCode').should('eq', 200)
}

export const unstarDashboard = () => {
    cy.intercept('DELETE', '**/favorite').as('unstarDashboard')

    cy.get(starSel).click()
    cy.wait('@unstarDashboard').its('response.statusCode').should('eq', 200)
}

export const expectDashboardToBeStarred = (title) => {
    // check for the filled star next to the title
    cy.get(dashboardStarredSel).should('be.visible')
    cy.get(dashboardUnstarredSel).should('not.exist')

    cy.get(dashboardChipSel)
        .contains(title)
        .parent()
        .siblings(chipStarSel)
        .first()
        .should('be.visible')
}

export const expectDashboardToNotBeStarred = (title) => {
    // check for the unfilled star next to the title
    cy.get(dashboardUnstarredSel).should('be.visible')
    cy.get(dashboardStarredSel).should('not.exist')

    cy.get(dashboardChipSel)
        .contains(title)
        .parent()
        .siblings()
        .should('not.exist')
}
