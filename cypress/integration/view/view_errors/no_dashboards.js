import { Given, Then } from 'cypress-cucumber-preprocessor/steps'
import { newButtonSel } from '../../../elements/viewDashboard'
import { EXTENDED_TIMEOUT } from '../../../support/utils'

// Scenario: There are no dashboards
Given('I open an app with no dashboards', () => {
    cy.intercept('/dashboards', { dashboards: [] })
    cy.visit('/', EXTENDED_TIMEOUT)
})

Then('a message displays informing that there are no dashboards', () => {
    cy.contains('No dashboards found', EXTENDED_TIMEOUT).should('be.visible')
    cy.get(newButtonSel).should('be.visible')
})
