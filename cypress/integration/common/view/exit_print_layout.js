import { When } from 'cypress-cucumber-preprocessor/steps'
import { dashboardTitleSel } from '../../../elements/viewDashboard'

When('I click to exit print preview', () => {
    cy.get('button').not('.small').contains('Exit print preview').click()

    cy.get(dashboardTitleSel).should('be.visible')
})
