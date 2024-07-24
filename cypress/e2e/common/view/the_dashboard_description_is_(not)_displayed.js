import { Then } from '@badeball/cypress-cucumber-preprocessor'
import { dashboardDescriptionSel } from '../../../elements/viewDashboard.js'

Then('the dashboard description is not displayed', () => {
    cy.get(dashboardDescriptionSel).should('not.exist')
})

Then('the dashboard description is displayed', () => {
    cy.get(dashboardDescriptionSel).should('be.visible')
})
