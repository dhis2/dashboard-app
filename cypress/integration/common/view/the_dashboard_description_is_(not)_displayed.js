import { Then } from 'cypress-cucumber-preprocessor/steps'
import { dashboardDescriptionSel } from '../../../selectors/viewDashboard'

Then('the dashboard description is not displayed', () => {
    cy.get(dashboardDescriptionSel).should('not.exist')
})

Then('the dashboard description is displayed', () => {
    cy.get(dashboardDescriptionSel).should('be.visible')
})
