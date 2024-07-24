import { Given, Then } from '@badeball/cypress-cucumber-preprocessor'
import { newButtonSel } from '../../../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../../../support/utils.js'

// Scenario: There are no dashboards
Given('I open an app with no dashboards', () => {
    cy.intercept('**/dashboards?*', { body: { dashboards: [] } })
    cy.visit('/', EXTENDED_TIMEOUT)
})

Then('a message displays informing that there are no dashboards', () => {
    cy.contains('No dashboards found', EXTENDED_TIMEOUT).should('be.visible')
    cy.get(newButtonSel).should('be.visible')
})
