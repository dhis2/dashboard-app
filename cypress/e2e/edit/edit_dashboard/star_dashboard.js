import { When, Then } from '@badeball/cypress-cucumber-preprocessor'
import {
    starSel,
    dashboardStarredSel,
    dashboardUnstarredSel,
    dashboardChipSel,
    chipStarSel,
} from '../../../elements/viewDashboard.js'
import { TEST_DASHBOARD_TITLE } from './edit_dashboard.js'

// Scenario: I star the dashboard
When('I click to star the dashboard', () => {
    cy.intercept('POST', '**/favorite').as('starDashboard')

    cy.get(starSel).click()
    cy.wait('@starDashboard').its('response.statusCode').should('eq', 200)
})

When('I click to unstar the dashboard', () => {
    cy.intercept('DELETE', '**/favorite').as('unstarDashboard')

    cy.get(starSel).click()
    cy.wait('@unstarDashboard').its('response.statusCode').should('eq', 200)
})

Then('the dashboard is starred', () => {
    // check for the filled star next to the title
    cy.get(dashboardStarredSel).should('be.visible')
    cy.get(dashboardUnstarredSel).should('not.exist')

    cy.get(dashboardChipSel)
        .contains(TEST_DASHBOARD_TITLE)
        .parent()
        .siblings(chipStarSel)
        .first()
        .should('be.visible')
})

Then('the dashboard is not starred', () => {
    // check for the unfilled star next to the title
    cy.get(dashboardUnstarredSel).should('be.visible')
    cy.get(dashboardStarredSel).should('not.exist')

    cy.get(dashboardChipSel)
        .contains(TEST_DASHBOARD_TITLE)
        .parent()
        .siblings()
        .should('not.exist')
})
