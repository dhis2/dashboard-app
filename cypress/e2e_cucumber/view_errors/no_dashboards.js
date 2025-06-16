import { Given, Then } from '@badeball/cypress-cucumber-preprocessor'
import { newButtonSel } from '../../elements/viewDashboard.js'

// Scenario: There are no dashboards
Given('I open an app with no dashboards', () => {
    cy.intercept('**/dashboards?*', { body: { dashboards: [] } })
    cy.visit('/')
})

Then('a message displays informing that there are no dashboards', () => {
    cy.contains('No dashboards found').should('be.visible')
    cy.get(newButtonSel).should('be.visible')
})
