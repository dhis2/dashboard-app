import { When, Then } from '@badeball/cypress-cucumber-preprocessor'
import {
    getNavigationMenuItem,
    closeNavigationMenu,
} from '../../elements/navigationMenu.js'
import {
    dashboardStarredSel,
    dashboardUnstarredSel,
    navMenuItemStarIconSel,
} from '../../elements/viewDashboard.js'
import { TEST_DASHBOARD_TITLE } from './edit_dashboard.js'

// Scenario: I star the dashboard
When('I click to star the dashboard', () => {
    cy.intercept('POST', '**/favorite').as('starDashboard')

    cy.get(dashboardUnstarredSel).click()
    cy.wait('@starDashboard').its('response.statusCode').should('eq', 200)
})

When('I click to unstar the dashboard', () => {
    cy.intercept('DELETE', '**/favorite').as('unstarDashboard')

    cy.get(dashboardStarredSel).click()
    cy.wait('@unstarDashboard').its('response.statusCode').should('eq', 200)
})

Then('the dashboard is starred', () => {
    // check for the filled star next to the title
    cy.get(dashboardStarredSel).should('be.visible')
    cy.get(dashboardUnstarredSel).should('not.exist')

    getNavigationMenuItem(TEST_DASHBOARD_TITLE)
        .find(navMenuItemStarIconSel)
        .should('be.visible')

    closeNavigationMenu()
})

Then('the dashboard is not starred', () => {
    // check for the unfilled star next to the title
    cy.get(dashboardUnstarredSel).should('be.visible')
    cy.get(dashboardStarredSel).should('not.exist')

    getNavigationMenuItem(TEST_DASHBOARD_TITLE)
        .find(navMenuItemStarIconSel)
        .should('not.exist')

    closeNavigationMenu()
})
