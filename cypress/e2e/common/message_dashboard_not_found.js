import { Then } from '@badeball/cypress-cucumber-preprocessor'
import { dashboardTitleSel } from '../../elements/viewDashboard.js'

Then('a message displays informing that the dashboard is not found', () => {
    cy.contains('Requested dashboard not found').should('be.visible')
    cy.get(dashboardTitleSel).should('not.exist')
})
