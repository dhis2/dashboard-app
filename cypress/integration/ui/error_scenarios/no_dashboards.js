import { Given, Then } from 'cypress-cucumber-preprocessor/steps'
import { EXTENDED_TIMEOUT } from '../../../support/utils'
import { newDashboardLinkSel } from '../../../selectors/viewDashboard'

// Scenario: There are no dashboards
Given('I open an app with no dashboards', () => {
    cy.intercept('/dashboards', { dashboards: [] })
    cy.visit('/', EXTENDED_TIMEOUT)
})

Then('a message displays informing that there are no dashboards', () => {
    cy.contains('No dashboards found', EXTENDED_TIMEOUT).should('be.visible')
    cy.get(newDashboardLinkSel).should('be.visible')
})
