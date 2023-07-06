import { When } from '@badeball/cypress-cucumber-preprocessor'
import { dashboardTitleSel } from '../../../elements/viewDashboard.js'

When('I click to exit print preview', () => {
    cy.get('button').not('.small').contains('Exit print preview').click()

    cy.get(dashboardTitleSel).should('be.visible')
})
