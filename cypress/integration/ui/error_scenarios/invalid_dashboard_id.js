import { Given, Then } from 'cypress-cucumber-preprocessor/steps'
import { EXTENDED_TIMEOUT } from '../../../support/utils'
import { dashboardTitleSel } from '../../../selectors/viewDashboard'

// Scenario: Dashboard id is invalid
Given('I type an invalid dashboard id in the browser url', () => {
    cy.visit('#/invalid', EXTENDED_TIMEOUT)
})
Then('a message displays informing that the dashboard is not found', () => {
    cy.contains('Requested dashboard not found').should('be.visible')
    cy.get(dashboardTitleSel).should('not.exist')
})
